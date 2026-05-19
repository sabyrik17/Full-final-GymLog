import mongoose from 'mongoose';
import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import WorkoutSet from '../models/WorkoutSet.js';
import '../models/Exercise.js';

const userSelect = 'name email avatar bio isPublic friends';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const formatUser = (user, extra = {}) => {
  const plain = user.toObject ? user.toObject() : user;

  return {
    id: plain._id.toString(),
    name: plain.name,
    email: plain.email,
    avatar: plain.avatar,
    bio: plain.bio || '',
    isPublic: Boolean(plain.isPublic),
    ...extra,
  };
};

const formatRequest = (request) => ({
  id: request._id.toString(),
  sender: formatUser(request.sender),
  receiver: formatUser(request.receiver),
  status: request.status,
  message: request.message || '',
  isRead: Boolean(request.isRead),
  createdAt: request.createdAt,
  updatedAt: request.updatedAt,
});

const getWorkoutSets = async (workoutId) => {
  return WorkoutSet.find({ workout: workoutId }).populate('exercise').sort({ setNumber: 1, createdAt: 1 });
};

const formatWorkout = (workout, sets = []) => {
  const plain = workout.toObject ? workout.toObject() : workout;

  return {
    id: plain._id.toString(),
    title: plain.title,
    date: plain.date,
    note: plain.notes || '',
    notes: plain.notes || '',
    isPublic: Boolean(plain.isPublic),
    exercises: sets.map((set) => ({
      id: set._id.toString(),
      name: set.exercise?.name || '',
      details: set.notes || '',
      sets: set.sets,
      reps: set.reps,
      weight: set.weight,
      isRecord: Boolean(set.isRecord),
      mediaUrl: set.exercise?.mediaUrl || '',
    })),
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

const findRelationship = async (userId, otherUserId) => {
  const currentUser = await User.findById(userId).select('friends');
  const isFriend = currentUser?.friends?.some((friendId) => friendId.toString() === otherUserId);

  if (isFriend) return 'friend';

  const request = await FriendRequest.findOne({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
    status: 'pending',
  });

  if (!request) return null;
  return request.sender.toString() === userId ? 'outgoing_pending' : 'incoming_pending';
};

export const getFriends = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.userId).populate('friends', userSelect);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const friendIds = currentUser.friends.map((friend) => friend._id.toString());
    const friends = currentUser.friends.map((friend) => formatUser(friend, { canViewDiary: Boolean(friend.isPublic) }));

    let searchResults = [];
    const search = (req.query.search || req.query.q || '').trim();

    if (search) {
      const users = await User.find({
        _id: { $ne: req.userId },
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      })
        .select(userSelect)
        .limit(12);

      searchResults = await Promise.all(
        users.map(async (user) => {
          const userId = user._id.toString();
          const relation = friendIds.includes(userId) ? 'friend' : await findRelationship(req.userId, userId);
          return formatUser(user, { relation });
        })
      );
    }

    res.json({ friends, searchResults });
  } catch (error) {
    next(error);
  }
};

export const getFriendRequests = async (req, res, next) => {
  try {
    const [incoming, outgoing] = await Promise.all([
      FriendRequest.find({ receiver: req.userId, status: 'pending' })
        .populate('sender', userSelect)
        .populate('receiver', userSelect)
        .sort({ createdAt: -1 }),
      FriendRequest.find({ sender: req.userId, status: 'pending' })
        .populate('sender', userSelect)
        .populate('receiver', userSelect)
        .sort({ createdAt: -1 }),
    ]);

    res.json({
      incoming: incoming.map(formatRequest),
      outgoing: outgoing.map(formatRequest),
    });
  } catch (error) {
    next(error);
  }
};

export const sendFriendRequest = async (req, res, next) => {
  try {
    const receiverId = req.body.receiverId || req.body.userId;

    if (!receiverId || !isValidObjectId(receiverId)) {
      return res.status(400).json({ message: 'Please provide a valid receiver id' });
    }

    if (receiverId === req.userId) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }

    const [sender, receiver] = await Promise.all([
      User.findById(req.userId),
      User.findById(receiverId),
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (sender.friends.some((friendId) => friendId.toString() === receiverId)) {
      return res.status(409).json({ message: 'You are already friends' });
    }

    const existing = await FriendRequest.findOne({
      $or: [
        { sender: req.userId, receiver: receiverId },
        { sender: receiverId, receiver: req.userId },
      ],
    });

    if (existing?.status === 'pending') {
      return res.status(409).json({ message: 'Friend request already exists' });
    }

    if (existing?.status === 'accepted') {
      return res.status(409).json({ message: 'You are already friends' });
    }

    const request = existing || new FriendRequest();
    request.sender = req.userId;
    request.receiver = receiverId;
    request.status = 'pending';
    request.message = (req.body.message || '').trim();
    request.isRead = false;
    await request.save();
    await request.populate('sender', userSelect);
    await request.populate('receiver', userSelect);

    res.status(201).json(formatRequest(request));
  } catch (error) {
    next(error);
  }
};

export const acceptFriendRequest = async (req, res, next) => {
  try {
    const request = await FriendRequest.findOne({
      _id: req.params.id,
      receiver: req.userId,
      status: 'pending',
    });

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    request.status = 'accepted';
    request.isRead = true;
    await request.save();

    await Promise.all([
      User.findByIdAndUpdate(request.sender, { $addToSet: { friends: request.receiver } }),
      User.findByIdAndUpdate(request.receiver, { $addToSet: { friends: request.sender } }),
    ]);

    await request.populate('sender', userSelect);
    await request.populate('receiver', userSelect);
    res.json(formatRequest(request));
  } catch (error) {
    next(error);
  }
};

export const rejectFriendRequest = async (req, res, next) => {
  try {
    const request = await FriendRequest.findOne({
      _id: req.params.id,
      receiver: req.userId,
      status: 'pending',
    });

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    request.status = 'rejected';
    request.isRead = true;
    await request.save();
    await request.populate('sender', userSelect);
    await request.populate('receiver', userSelect);

    res.json(formatRequest(request));
  } catch (error) {
    next(error);
  }
};

export const getFriendWorkouts = async (req, res, next) => {
  try {
    const friendId = req.params.id;

    if (!isValidObjectId(friendId)) {
      return res.status(400).json({ message: 'Please provide a valid friend id' });
    }

    const [currentUser, friend] = await Promise.all([
      User.findById(req.userId).select('friends'),
      User.findById(friendId).select(userSelect),
    ]);

    if (!friend || !currentUser) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    const isFriend = currentUser.friends.some((id) => id.toString() === friendId);

    if (!isFriend) {
      return res.status(403).json({ message: 'You can only view workouts of your friends' });
    }

    if (!friend.isPublic) {
      return res.status(403).json({ message: 'This friend keeps their diary private' });
    }

    const workouts = await Workout.find({ user: friendId }).sort({ date: -1, createdAt: -1 });
    const formatted = await Promise.all(
      workouts.map(async (workout) => formatWorkout(workout, await getWorkoutSets(workout._id)))
    );

    res.json({
      friend: formatUser(friend, { canViewDiary: true }),
      workouts: formatted,
    });
  } catch (error) {
    next(error);
  }
};
