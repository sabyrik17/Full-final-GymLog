import mongoose from 'mongoose';

const muscleGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide muscle group name'],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    bodyPart: {
      type: String,
      enum: ['upper', 'lower', 'core'],
      required: true,
    },
    exerciseCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('MuscleGroup', muscleGroupSchema);
