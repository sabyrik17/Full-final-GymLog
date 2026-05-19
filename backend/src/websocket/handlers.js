import { verifyToken } from '../config/jwt.js';
import User from '../models/User.js';

const clients = new Map();

const OPEN = 1;

export const setupWebSocket = (wss) => {
  wss.on('connection', (ws) => {
    const clientId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    clients.set(clientId, {
      ws,
      userId: null,
      userName: '',
      friendIds: new Set(),
      isTraining: false,
    });

    console.log(`WebSocket client connected: ${clientId}`);

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data);
        await handleWebSocketMessage(clientId, message, wss);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log(`WebSocket client disconnected: ${clientId}`);
      clients.delete(clientId);
      broadcastOnlineUsers(wss).catch((error) => console.error('WebSocket broadcast error:', error));
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
};

const handleWebSocketMessage = async (clientId, message, wss) => {
  const client = clients.get(clientId);
  if (!client) return;

  switch (message.type) {
    case 'AUTH': {
      const isAuthenticated = await authenticateClient(client, message);
      if (isAuthenticated) await broadcastOnlineUsers(wss);
      break;
    }

    case 'TRAINING_START':
      if (!client.userId) break;
      client.isTraining = true;
      await broadcastOnlineUsers(wss);
      await broadcastTrainingStatus(wss, client, 'START', message.workout);
      break;

    case 'TRAINING_UPDATE':
      if (!client.userId) break;
      await broadcastTrainingStatus(wss, client, 'UPDATE', message.workoutData);
      break;

    case 'TRAINING_END':
      if (!client.userId) break;
      client.isTraining = false;
      await broadcastOnlineUsers(wss);
      await broadcastTrainingStatus(wss, client, 'END', message.workout || null);
      break;

    default:
      break;
  }
};

const authenticateClient = async (client, message) => {
  try {
    const decoded = message.token ? verifyToken(message.token) : null;
    const userId = decoded?.userId || message.userId;

    if (!userId) return false;

    const user = await User.findById(userId).select('name friends');
    if (!user) return false;

    client.userId = user._id.toString();
    client.userName = user.name || message.userName || message.name || 'User';
    client.friendIds = new Set((user.friends || []).map((friendId) => friendId.toString()));
    return true;
  } catch (error) {
    console.error('WebSocket auth error:', error.message);
    return false;
  }
};

const getAuthenticatedClients = () => {
  return Array.from(clients.values()).filter((client) => client.userId);
};

const canSeeClient = (viewer, subject) => {
  return Boolean(viewer?.userId && subject?.userId && viewer.friendIds?.has(subject.userId));
};

const refreshClientFriends = async (client) => {
  if (!client.userId) return;

  const user = await User.findById(client.userId).select('name friends');

  if (!user) {
    client.userId = null;
    client.userName = '';
    client.friendIds = new Set();
    client.isTraining = false;
    return;
  }

  client.userName = user.name || client.userName || 'User';
  client.friendIds = new Set((user.friends || []).map((friendId) => friendId.toString()));
};

const refreshAuthenticatedClients = async () => {
  await Promise.all(getAuthenticatedClients().map(refreshClientFriends));
};

const getVisibleOnlineUsers = (viewer) => {
  const byUser = new Map();

  getAuthenticatedClients().forEach((client) => {
    if (!canSeeClient(viewer, client)) return;

    const current = byUser.get(client.userId);
    byUser.set(client.userId, {
      id: client.userId,
      name: client.userName || current?.name || 'User',
      isTraining: Boolean(current?.isTraining || client.isTraining),
    });
  });

  return Array.from(byUser.values());
};

const sendJson = (socket, payload) => {
  if (socket.readyState === OPEN) {
    socket.send(JSON.stringify(payload));
  }
};

const broadcastOnlineUsers = async () => {
  await refreshAuthenticatedClients();

  getAuthenticatedClients().forEach((client) => {
    sendJson(client.ws, {
      type: 'ONLINE_USERS',
      users: getVisibleOnlineUsers(client),
    });
  });
};

const broadcastTrainingStatus = async (wss, sender, status, data) => {
  await refreshAuthenticatedClients();

  const message = {
    type: 'TRAINING_STATUS',
    userId: sender.userId,
    userName: sender.userName || 'User',
    status,
    data,
    createdAt: new Date().toISOString(),
  };

  getAuthenticatedClients().forEach((client) => {
    if (canSeeClient(client, sender)) {
      sendJson(client.ws, message);
    }
  });
};
