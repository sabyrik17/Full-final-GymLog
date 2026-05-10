import mongoose from 'mongoose';
import User from '../src/models/User.js';

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/gymlog-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a user with valid data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      weight: 80,
      height: 180,
    };

    const user = new User(userData);
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.weight).toBe(80);
    expect(user.height).toBe(180);
  });

  it('should require name field', () => {
    const userData = {
      email: 'john@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    const error = user.validateSync();
    expect(error.errors.name).toBeDefined();
  });

  it('should require email field', () => {
    const userData = {
      name: 'John Doe',
      password: 'password123',
    };

    const user = new User(userData);
    const error = user.validateSync();
    expect(error.errors.email).toBeDefined();
  });

  it('should require password field', () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const user = new User(userData);
    const error = user.validateSync();
    expect(error.errors.password).toBeDefined();
  });
});
