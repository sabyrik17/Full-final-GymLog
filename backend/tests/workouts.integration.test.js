import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../src/server.js';
import Exercise from '../src/models/Exercise.js';
import User from '../src/models/User.js';
import Workout from '../src/models/Workout.js';
import WorkoutSet from '../src/models/WorkoutSet.js';

const dbUri = 'mongodb://localhost:27017/gymlog-test';

const registerUser = async (email = `user-${Date.now()}@test.com`) => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email,
      password: 'password123',
    });

  return response.body.token;
};

describe('Workouts API integration', () => {
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
      User.deleteMany({}),
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('POST /api/auth/register returns a JWT token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Register Test',
        email: 'register@test.com',
        password: 'password123',
      })
      .expect(201);

    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe('register@test.com');
  });

  it('GET /api/workouts rejects requests without a token', async () => {
    const response = await request(app).get('/api/workouts').expect(401);

    expect(response.body.message).toMatch(/not authorized/i);
  });

  it('creates, reads, updates, and deletes the signed-in user workout', async () => {
    const token = await registerUser('owner@test.com');

    const created = await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Push day',
        date: '2026-05-17',
        note: 'First real API workout',
        exercises: [
          {
            name: 'Bench Press',
            details: '80kg x 10',
            sets: 3,
            reps: 10,
            weight: 80,
            mediaUrl: 'https://utfs.io/f/bench.jpg',
          },
        ],
      })
      .expect(201);

    expect(created.body.title).toBe('Push day');
    expect(created.body.exercises).toHaveLength(1);
    expect(created.body.exercises[0].name).toBe('Bench Press');
    expect(created.body.exercises[0].mediaUrl).toBe('https://utfs.io/f/bench.jpg');

    const list = await request(app)
      .get('/api/workouts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);

    const updated = await request(app)
      .put(`/api/workouts/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Pull day',
        date: '2026-05-18',
        note: 'Updated workout',
        exercises: [
          {
            name: 'Deadlift',
            details: '100kg x 5',
            sets: 2,
            reps: 5,
            weight: 100,
          },
        ],
      })
      .expect(200);

    expect(updated.body.title).toBe('Pull day');
    expect(updated.body.exercises[0].name).toBe('Deadlift');

    await request(app)
      .delete(`/api/workouts/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const emptyList = await request(app)
      .get('/api/workouts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(emptyList.body).toHaveLength(0);
  });

  it('does not allow one user to read another user workout', async () => {
    const ownerToken = await registerUser('owner@test.com');
    const otherToken = await registerUser('other@test.com');

    const created = await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Private workout',
        date: '2026-05-17',
        exercises: [],
      })
      .expect(201);

    await request(app)
      .get(`/api/workouts/${created.body.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(404);
  });
});
