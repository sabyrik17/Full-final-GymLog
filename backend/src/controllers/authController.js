import User from '../models/User.js';
import { generateToken } from '../config/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid && user.password === password) {
      user.password = password;
      await user.save();
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        weight: user.weight,
        height: user.height,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, weight, height, bio, isPublic, avatar } = req.body;
    const updates = {
      ...(name !== undefined && { name }),
      ...(weight !== undefined && { weight }),
      ...(height !== undefined && { height }),
      ...(bio !== undefined && { bio }),
      ...(isPublic !== undefined && { isPublic }),
      ...(avatar !== undefined && { avatar }),
    };

    const user = await User.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};
