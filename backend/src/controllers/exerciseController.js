import Exercise from '../models/Exercise.js';
import '../models/MuscleGroup.js';

const buildExerciseFilter = (query, userId) => {
  const filter = {
    createdBy: userId,
  };

  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: 'i' } },
      { description: { $regex: query.q, $options: 'i' } },
    ];
  }

  for (const field of ['difficulty', 'equipment', 'type']) {
    if (query[field] && query[field] !== 'all') {
      filter[field] = query[field];
    }
  }

  return filter;
};

const formatExercise = (exercise) => {
  const plain = exercise.toObject ? exercise.toObject() : exercise;

  return {
    id: plain._id.toString(),
    _id: plain._id,
    name: plain.name,
    description: plain.description,
    videoUrl: plain.videoUrl,
    difficulty: plain.difficulty,
    type: plain.type,
    equipment: plain.equipment,
    mediaUrl: plain.mediaUrl,
    muscleGroups: plain.muscleGroups || [],
    createdBy: plain.createdBy,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const getExercises = async (req, res, next) => {
  try {
    const exercises = await Exercise.find(buildExerciseFilter(req.query, req.userId))
      .populate('muscleGroups')
      .sort({ createdAt: -1, name: 1 });

    res.json(exercises.map(formatExercise));
  } catch (error) {
    next(error);
  }
};

export const createExercise = async (req, res, next) => {
  try {
    const { name, description, difficulty, type, equipment, videoUrl, mediaUrl, muscleGroups } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Please provide exercise name and type' });
    }

    const exercise = await Exercise.create({
      name,
      description: description || 'User-created exercise',
      difficulty: difficulty || 'beginner',
      type,
      equipment: equipment || 'bodyweight',
      videoUrl: videoUrl || null,
      mediaUrl: mediaUrl || null,
      muscleGroups: Array.isArray(muscleGroups) ? muscleGroups : [],
      createdBy: req.userId,
    });

    res.status(201).json(formatExercise(exercise));
  } catch (error) {
    next(error);
  }
};

export const getExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id).populate('muscleGroups');

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(formatExercise(exercise));
  } catch (error) {
    next(error);
  }
};

export const updateExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    if (exercise.createdBy?.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only update your own exercises' });
    }

    const allowedFields = ['name', 'description', 'difficulty', 'type', 'equipment', 'videoUrl', 'mediaUrl'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        exercise[field] = req.body[field];
      }
    }

    if (Array.isArray(req.body.muscleGroups)) {
      exercise.muscleGroups = req.body.muscleGroups;
    }

    await exercise.save();

    res.json(formatExercise(exercise));
  } catch (error) {
    next(error);
  }
};

export const deleteExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    if (exercise.createdBy?.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own exercises' });
    }

    await exercise.deleteOne();

    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    next(error);
  }
};
