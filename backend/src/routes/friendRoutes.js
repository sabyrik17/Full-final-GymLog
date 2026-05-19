import express from 'express';
import {
  acceptFriendRequest,
  getFriendRequests,
  getFriends,
  getFriendWorkouts,
  rejectFriendRequest,
  sendFriendRequest,
} from '../controllers/friendController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getFriends);
router.get('/requests', getFriendRequests);
router.post('/request', sendFriendRequest);
router.put('/:id/accept', acceptFriendRequest);
router.put('/:id/reject', rejectFriendRequest);
router.get('/:id/workouts', getFriendWorkouts);

export default router;
