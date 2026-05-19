import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../src/server.js';
import Exercise from '../src/models/Exercise.js';
import FriendRequest from '../src/models/FriendRequest.js';
import User from '../src/models/User.js';
import Workout from '../src/models/Workout.js';
import WorkoutSet from '../src/models/WorkoutSet.js';

const dbUri = 'mongodb://localhost:27017/gymlog-test';

const registerUser = async (email, name = 'Friend Test User') => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name,
      email,
      password: 'password123',
    })
    .expect(201);

  return response.body;
};

describe('Friends API integration', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(dbUri);
    }
  });

  afterEach(async () => {
    await Promise.all([
      WorkoutSet.deleteMany({}),
      Workout.deleteMany({}),
      Exercise.deleteMany({}),
      FriendRequest.deleteMany({}),
      User.deleteMany({}),
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('rejects friends requests without a token', async () => {
    const response = await request(app).get('/api/friends').expect(401);

    expect(response.body.message).toMatch(/not authorized/i);
  });

  it('searches users, sends a request, and accepts it', async () => {
    const owner = await registerUser('owner-friends@test.com', 'Owner');
    const receiver = await registerUser('receiver-friends@test.com', 'Receiver');

    const search = await request(app)
      .get('/api/friends?search=receiver')
      .set('Authorization', `Bearer ${owner.token}`)
      .expect(200);

    expect(search.body.searchResults).toHaveLength(1);
    expect(search.body.searchResults[0].email).toBe('receiver-friends@test.com');

    const sent = await request(app)
      .post('/api/friends/request')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({
        receiverId: receiver.user.id,
        message: 'Lets train',
      })
      .expect(201);

    expect(sent.body.status).toBe('pending');
    expect(sent.body.message).toBe('Lets train');

    const requests = await request(app)
      .get('/api/friends/requests')
      .set('Authorization', `Bearer ${receiver.token}`)
      .expect(200);

    expect(requests.body.incoming).toHaveLength(1);
    expect(requests.body.incoming[0].sender.email).toBe('owner-friends@test.com');

    await request(app)
      .put(`/api/friends/${sent.body.id}/accept`)
      .set('Authorization', `Bearer ${receiver.token}`)
      .expect(200);

    const ownerFriends = await request(app)
      .get('/api/friends')
      .set('Authorization', `Bearer ${owner.token}`)
      .expect(200);

    expect(ownerFriends.body.friends).toHaveLength(1);
    expect(ownerFriends.body.friends[0].email).toBe('receiver-friends@test.com');
  });

  it('only returns friend workouts when the friend diary is public', async () => {
    const owner = await registerUser('workout-owner@test.com', 'Workout Owner');
    const viewer = await registerUser('workout-viewer@test.com', 'Workout Viewer');

    const sent = await request(app)
      .post('/api/friends/request')
      .set('Authorization', `Bearer ${viewer.token}`)
      .send({ receiverId: owner.user.id })
      .expect(201);

    await request(app)
      .put(`/api/friends/${sent.body.id}/accept`)
      .set('Authorization', `Bearer ${owner.token}`)
      .expect(200);

    await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({
        title: 'Public Push',
        date: '2026-05-17',
        exercises: [{ name: 'Bench Press', sets: 3, reps: 8, weight: 80 }],
      })
      .expect(201);

    await request(app)
      .get(`/api/friends/${owner.user.id}/workouts`)
      .set('Authorization', `Bearer ${viewer.token}`)
      .expect(403);

    await request(app)
      .put('/api/auth/profile')
      .set('Authorization', `Bearer ${owner.token}`)
      .send({ isPublic: true })
      .expect(200);

    const diary = await request(app)
      .get(`/api/friends/${owner.user.id}/workouts`)
      .set('Authorization', `Bearer ${viewer.token}`)
      .expect(200);

    expect(diary.body.friend.email).toBe('workout-owner@test.com');
    expect(diary.body.workouts).toHaveLength(1);
    expect(diary.body.workouts[0].title).toBe('Public Push');
  });
});
