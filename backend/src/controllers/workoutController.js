import Exercise from '../models/Exercise.js';
import Workout from '../models/Workout.js';
import WorkoutSet from '../models/WorkoutSet.js';

const defaultExerciseDescription = 'Exercise created from workout notes';

const toNumber = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

const toWeight = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
};

const findOwnedWorkout = async (workoutId, userId) => {
  return Workout.findOne({ _id: workoutId, user: userId });
};

const resolveExercise = async (exerciseInput, userId) => {
  const name = (exerciseInput.name || '').trim();
  if (!name) return null;

  let exercise = await Exercise.findOne({ name });

  if (!exercise) {
    exercise = await Exercise.create({
      name,
      description: exerciseInput.description || defaultExerciseDescription,
      type: exerciseInput.type || 'compound',
      difficulty: exerciseInput.difficulty || 'beginner',
      equipment: exerciseInput.equipment || 'bodyweight',
      muscleGroups: exerciseInput.muscleGroups || [],
      mediaUrl: exerciseInput.mediaUrl || null,
      createdBy: userId,
    });
  } else if (exerciseInput.mediaUrl && exercise.mediaUrl !== exerciseInput.mediaUrl) {
    exercise.mediaUrl = exerciseInput.mediaUrl;
    await exercise.save();
  }

  return exercise;
};

const createWorkoutSets = async (workoutId, userId, exercises = []) => {
  const createdSets = [];

  for (const [index, exerciseInput] of exercises.entries()) {
    const exercise = await resolveExercise(exerciseInput, userId);
    if (!exercise) continue;

    const workoutSet = await WorkoutSet.create({
      workout: workoutId,
      exercise: exercise._id,
      setNumber: index + 1,
      sets: toNumber(exerciseInput.sets, 1),
      reps: toNumber(exerciseInput.reps, 1),
      weight: toWeight(exerciseInput.weight),
      notes: (exerciseInput.details || exerciseInput.notes || '').trim(),
      isRecord: Boolean(exerciseInput.isRecord),
    });

    createdSets.push(workoutSet);
  }

  return createdSets;
};

const getWorkoutSets = async (workoutId) => {
  return WorkoutSet.find({ workout: workoutId }).populate('exercise').sort({ setNumber: 1, createdAt: 1 });
};

const formatWorkout = (workout, sets = []) => {
  const plainWorkout = workout.toObject ? workout.toObject() : workout;

  return {
    id: plainWorkout._id.toString(),
    _id: plainWorkout._id,
    title: plainWorkout.title,
    date: plainWorkout.date,
    note: plainWorkout.notes || '',
    notes: plainWorkout.notes || '',
    isPublic: plainWorkout.isPublic,
    exercises: sets.map((set) => ({
      id: set._id.toString(),
      setId: set._id.toString(),
      exerciseId: set.exercise?._id?.toString() || set.exercise?.toString(),
      name: set.exercise?.name || '',
      details: set.notes || '',
      sets: set.sets,
      reps: set.reps,
      weight: set.weight,
      isRecord: set.isRecord,
      mediaUrl: set.exercise?.mediaUrl || '',
    })),
    createdAt: plainWorkout.createdAt,
    updatedAt: plainWorkout.updatedAt,
  };
};

export const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.userId }).sort({ date: -1, createdAt: -1 });
    const formatted = await Promise.all(
      workouts.map(async (workout) => formatWorkout(workout, await getWorkoutSets(workout._id)))
    );

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

export const createWorkout = async (req, res, next) => {
  try {
    const { title, date, note, notes, isPublic, exercises } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Please provide workout title and date' });
    }

    const workout = await Workout.create({
      title,
      date,
      notes: note ?? notes ?? '',
      isPublic: Boolean(isPublic),
      user: req.userId,
    });

    await createWorkoutSets(workout._id, req.userId, exercises);
    const sets = await getWorkoutSets(workout._id);

    res.status(201).json(formatWorkout(workout, sets));
  } catch (error) {
    next(error);
  }
};

export const getWorkout = async (req, res, next) => {
  try {
    const workout = await findOwnedWorkout(req.params.id, req.userId);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(formatWorkout(workout, await getWorkoutSets(workout._id)));
  } catch (error) {
    next(error);
  }
};

export const updateWorkout = async (req, res, next) => {
  try {
    const workout = await findOwnedWorkout(req.params.id, req.userId);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const { title, date, note, notes, isPublic, exercises } = req.body;
    workout.title = title ?? workout.title;
    workout.date = date ?? workout.date;
    workout.notes = note ?? notes ?? workout.notes;
    workout.isPublic = typeof isPublic === 'boolean' ? isPublic : workout.isPublic;
    await workout.save();

    if (Array.isArray(exercises)) {
      await WorkoutSet.deleteMany({ workout: workout._id });
      await createWorkoutSets(workout._id, req.userId, exercises);
    }

    res.json(formatWorkout(workout, await getWorkoutSets(workout._id)));
  } catch (error) {
    next(error);
  }
};

export const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await findOwnedWorkout(req.params.id, req.userId);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    await WorkoutSet.deleteMany({ workout: workout._id });
    await workout.deleteOne();

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addWorkoutSet = async (req, res, next) => {
  try {
    const workout = await findOwnedWorkout(req.params.id, req.userId);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    await createWorkoutSets(workout._id, req.userId, [req.body]);
    res.status(201).json(formatWorkout(workout, await getWorkoutSets(workout._id)));
  } catch (error) {
    next(error);
  }
};

export const updateWorkoutSet = async (req, res, next) => {
  try {
    const workout = await findOwnedWorkout(req.params.id, req.userId);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const workoutSet = await WorkoutSet.findOne({ _id: req.params.setId, workout: workout._id });

    if (!workoutSet) {
      return res.status(404).json({ message: 'Workout set not found' });
    }

    if (req.body.name) {
      const exercise = await resolveExercise(req.body, req.userId);
      workoutSet.exercise = exercise._id;
    }

    workoutSet.sets = toNumber(req.body.sets, workoutSet.sets);
    workoutSet.reps = toNumber(req.body.reps, workoutSet.reps);
    workoutSet.weight = toWeight(req.body.weight ?? workoutSet.weight);
    workoutSet.notes = (req.body.details || req.body.notes || workoutSet.notes || '').trim();
    workoutSet.isRecord = typeof req.body.isRecord === 'boolean' ? req.body.isRecord : workoutSet.isRecord;
    await workoutSet.save();

    res.json(formatWorkout(workout, await getWorkoutSets(workout._id)));
  } catch (error) {
    next(error);
  }
};

export const deleteWorkoutSet = async (req, res, next) => {
  try {
    const workout = await findOwnedWorkout(req.params.id, req.userId);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const deleted = await WorkoutSet.findOneAndDelete({ _id: req.params.setId, workout: workout._id });

    if (!deleted) {
      return res.status(404).json({ message: 'Workout set not found' });
    }

    res.json(formatWorkout(workout, await getWorkoutSets(workout._id)));
  } catch (error) {
    next(error);
  }
};
