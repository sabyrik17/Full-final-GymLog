import express from 'express';
import {
  addWorkoutSet,
  createWorkout,
  deleteWorkout,
  deleteWorkoutSet,
  getWorkout,
  getWorkouts,
  updateWorkout,
  updateWorkoutSet,
} from '../controllers/workoutController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getWorkouts).post(createWorkout);
router.route('/:id').get(getWorkout).put(updateWorkout).delete(deleteWorkout);
router.post('/:id/sets', addWorkoutSet);
router.put('/:id/sets/:setId', updateWorkoutSet);
router.delete('/:id/sets/:setId', deleteWorkoutSet);

export default router;
