import mongoose from 'mongoose';
import Exercise from '../src/models/Exercise.js';

describe('Exercise Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/gymlog-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create an exercise with valid data', async () => {
    const exerciseData = {
      name: 'Bench Press',
      description: 'A compound exercise for chest',
      difficulty: 'intermediate',
      type: 'compound',
      muscleGroups: [],
    };

    const exercise = new Exercise(exerciseData);
    expect(exercise.name).toBe('Bench Press');
    expect(exercise.difficulty).toBe('intermediate');
    expect(exercise.type).toBe('compound');
  });

  it('should require name field', () => {
    const exerciseData = {
      description: 'A compound exercise',
      type: 'compound',
    };

    const exercise = new Exercise(exerciseData);
    const error = exercise.validateSync();
    expect(error.errors.name).toBeDefined();
  });

  it('should require type field', () => {
    const exerciseData = {
      name: 'Bench Press',
      description: 'A compound exercise',
    };

    const exercise = new Exercise(exerciseData);
    const error = exercise.validateSync();
    expect(error.errors.type).toBeDefined();
  });
});
