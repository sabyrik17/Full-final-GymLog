import { createServer } from 'http';
import mongoose from 'mongoose';
import WebSocket, { WebSocketServer } from 'ws';
import { generateToken } from '../src/config/jwt.js';
import User from '../src/models/User.js';
import { setupWebSocket } from '../src/websocket/handlers.js';

const dbUri = 'mongodb://localhost:27017/gymlog-test';

const waitForOpen = (socket) => new Promise((resolve, reject) => {
  socket.once('open', resolve);
  socket.once('error', reject);
});

const waitForMessage = (socket, predicate, timeout = 1500) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    socket.off('message', onMessage);
    reject(new Error('Timed out waiting for WebSocket message'));
  }, timeout);

  const onMessage = (data) => {
    const message = JSON.parse(data.toString());

    if (predicate(message)) {
      clearTimeout(timer);
      socket.off('message', onMessage);
      resolve(message);
    }
  };

  socket.on('message', onMessage);
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const createUser = async (name, email) => {
  return User.create({
    name,
    email,
    password: 'password123',
  });
};

describe('WebSocket friend-only realtime', () => {
  let httpServer;
  let wss;
  let url;
  const sockets = [];

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(dbUri);
    }
  });

  beforeEach(async () => {
    httpServer = createServer();
    wss = new WebSocketServer({ server: httpServer });
    setupWebSocket(wss);

    await new Promise((resolve) => httpServer.listen(0, resolve));
    url = `ws://127.0.0.1:${httpServer.address().port}`;
  });

  afterEach(async () => {
    sockets.forEach((socket) => socket.close());
    sockets.length = 0;
    await new Promise((resolve) => wss.close(resolve));
    await new Promise((resolve) => httpServer.close(resolve));
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('sends online users and workout events only to friends', async () => {
    const alice = await createUser('Alice', 'alice-ws@test.com');
    const bob = await createUser('Bob', 'bob-ws@test.com');
    const charlie = await createUser('Charlie', 'charlie-ws@test.com');

    alice.friends = [bob._id];
    bob.friends = [alice._id];
    await Promise.all([alice.save(), bob.save()]);

    const connectClient = async (user) => {
      const socket = new WebSocket(url);
      sockets.push(socket);
      await waitForOpen(socket);
      socket.send(JSON.stringify({ type: 'AUTH', token: generateToken(user._id.toString()) }));
      return socket;
    };

    const aliceSocket = await connectClient(alice);
    const bobSocket = await connectClient(bob);
    const charlieSocket = await connectClient(charlie);

    const aliceOnline = await waitForMessage(aliceSocket, (message) => (
      message.type === 'ONLINE_USERS' && message.users.some((user) => user.id === bob._id.toString())
    ));

    expect(aliceOnline.users).toHaveLength(1);
    expect(aliceOnline.users[0].name).toBe('Bob');

    const charlieOnline = await waitForMessage(charlieSocket, (message) => message.type === 'ONLINE_USERS');
    expect(charlieOnline.users).toHaveLength(0);

    let charlieSawTraining = false;
    charlieSocket.on('message', (data) => {
      const message = JSON.parse(data.toString());
      if (message.type === 'TRAINING_STATUS') {
        charlieSawTraining = true;
      }
    });

    bobSocket.send(JSON.stringify({
      type: 'TRAINING_UPDATE',
      workoutData: {
        title: 'Friend-only workout',
        action: 'created',
      },
    }));

    const aliceEvent = await waitForMessage(aliceSocket, (message) => message.type === 'TRAINING_STATUS');

    expect(aliceEvent.userId).toBe(bob._id.toString());
    expect(aliceEvent.data.title).toBe('Friend-only workout');

    await delay(250);
    expect(charlieSawTraining).toBe(false);
  });
});
