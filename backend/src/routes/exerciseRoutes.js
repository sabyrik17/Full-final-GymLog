import express from 'express';
import {
  createExercise,
  deleteExercise,
  getExercise,
  getExercises,
  updateExercise,
} from '../controllers/exerciseController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getExercises).post(createExercise);
router.route('/:id').get(getExercise).put(updateExercise).delete(deleteExercise);

export default router;
