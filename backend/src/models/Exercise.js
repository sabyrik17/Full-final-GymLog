import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide exercise name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide exercise description'],
      maxlength: 1000,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    type: {
      type: String,
      enum: ['compound', 'isolation', 'cardio', 'stretching'],
      required: true,
    },
    muscleGroups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MuscleGroup',
      required: true,
    }],
    equipment: {
      type: String,
      enum: ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'kettlebell', 'bands'],
      default: 'bodyweight',
    },
    mediaUrl: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Exercise', exerciseSchema);
