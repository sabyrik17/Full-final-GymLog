import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../src/server.js';
import Exercise from '../src/models/Exercise.js';
import User from '../src/models/User.js';

const dbUri = 'mongodb://localhost:27017/gymlog-test';

const registerUser = async (email = `exercise-${Date.now()}@test.com`) => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Exercise Owner',
      email,
      password: 'password123',
    })
    .expect(201);

  return response.body.token;
};

describe('Exercises API integration', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(dbUri);
    }
  });

  afterEach(async () => {
    await Promise.all([
      Exercise.deleteMany({}),
      User.deleteMany({}),
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('rejects exercise requests without a token', async () => {
    const response = await request(app).get('/api/exercises').expect(401);

    expect(response.body.message).toMatch(/not authorized/i);
  });

  it('creates, filters, updates, and deletes the signed-in user exercise', async () => {
    const token = await registerUser('exercise-owner@test.com');

    const created = await request(app)
      .post('/api/exercises')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Bench Press',
        description: 'Chest compound movement',
        difficulty: 'intermediate',
        type: 'compound',
        equipment: 'barbell',
        mediaUrl: 'https://utfs.io/f/bench.mp4',
      })
      .expect(201);

    expect(created.body.name).toBe('Bench Press');
    expect(created.body.mediaUrl).toBe('https://utfs.io/f/bench.mp4');

    const filtered = await request(app)
      .get('/api/exercises?q=bench&difficulty=intermediate&equipment=barbell&type=compound')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(filtered.body).toHaveLength(1);
    expect(filtered.body[0].id).toBe(created.body.id);

    const updated = await request(app)
      .put(`/api/exercises/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Paused Bench Press',
        description: 'Updated tempo bench',
        difficulty: 'advanced',
        type: 'compound',
        equipment: 'barbell',
      })
      .expect(200);

    expect(updated.body.name).toBe('Paused Bench Press');
    expect(updated.body.difficulty).toBe('advanced');

    await request(app)
      .delete(`/api/exercises/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const emptyList = await request(app)
      .get('/api/exercises?q=paused')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(emptyList.body).toHaveLength(0);
  });

  it('does not allow one user to update another user exercise', async () => {
    const ownerToken = await registerUser('exercise-private-owner@test.com');
    const otherToken = await registerUser('exercise-other@test.com');

    const created = await request(app)
      .post('/api/exercises')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Private Curl',
        description: 'Owner-created exercise',
        difficulty: 'beginner',
        type: 'isolation',
        equipment: 'dumbbell',
      })
      .expect(201);

    await request(app)
      .put(`/api/exercises/${created.body.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        name: 'Stolen Curl',
      })
      .expect(403);
  });

  it('does not show exercises created by another user in the list', async () => {
    const ownerToken = await registerUser('exercise-list-owner@test.com');
    const otherToken = await registerUser('exercise-list-other@test.com');

    await request(app)
      .post('/api/exercises')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Owner Only Press',
        description: 'Only owner should see this',
        difficulty: 'beginner',
        type: 'compound',
        equipment: 'barbell',
      })
      .expect(201);

    const otherList = await request(app)
      .get('/api/exercises')
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200);

    expect(otherList.body).toHaveLength(0);
  });
});
