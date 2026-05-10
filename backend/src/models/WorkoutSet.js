import mongoose from 'mongoose';

const workoutSetSchema = new mongoose.Schema(
  {
    workout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workout',
      required: true,
    },
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise',
      required: true,
    },
    sets: {
      type: Number,
      required: [true, 'Please provide number of sets'],
      min: 1,
    },
    reps: {
      type: Number,
      required: [true, 'Please provide number of reps'],
      min: 1,
    },
    weight: {
      type: Number,
      default: 0,
      min: 0,
    },
    isRecord: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('WorkoutSet', workoutSetSchema);
