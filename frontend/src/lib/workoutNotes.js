import { fetchAPI } from './api';

function normalizeExercise(exercise) {
  return {
    id: exercise.id || exercise.setId || `${Date.now()}-${Math.random()}`,
    setId: exercise.setId || exercise.id,
    exerciseId: exercise.exerciseId,
    name: exercise.name || '',
    details: exercise.details || exercise.notes || '',
    sets: exercise.sets || 1,
    reps: exercise.reps || 1,
    weight: exercise.weight || 0,
    isRecord: Boolean(exercise.isRecord),
    mediaUrl: exercise.mediaUrl || '',
  };
}

function normalizeWorkout(workout) {
  const exercises = Array.isArray(workout.exercises) ? workout.exercises.map(normalizeExercise) : [];

  return {
    ...workout,
    id: workout.id || workout._id,
    note: workout.note || workout.notes || '',
    exercises,
    exercise: exercises[0] || { name: '', details: '' },
  };
}

export async function readWorkoutNotes() {
  const workouts = await fetchAPI('/api/workouts');
  return Array.isArray(workouts) ? workouts.map(normalizeWorkout) : [];
}

export async function createWorkoutNote(data) {
  const workout = await fetchAPI('/api/workouts', {
    method: 'POST',
    body: JSON.stringify({
      title: data.title,
      date: data.date,
      note: data.note,
      exercises: data.exercises || [],
    }),
  });

  return normalizeWorkout(workout);
}

export async function updateWorkoutNote(id, data) {
  const workout = await fetchAPI(`/api/workouts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: data.title,
      date: data.date,
      note: data.note,
      exercises: data.exercises || [],
    }),
  });

  return normalizeWorkout(workout);
}

export async function deleteWorkoutNote(id) {
  await fetchAPI(`/api/workouts/${id}`, {
    method: 'DELETE',
  });
}

export async function getWorkoutNote(id) {
  const workout = await fetchAPI(`/api/workouts/${id}`);
  return normalizeWorkout(workout);
}
