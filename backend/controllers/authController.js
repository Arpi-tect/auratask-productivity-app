const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');

// Token generation helper
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'your_ultra_secure_super_secret_jwt_key_here_12345',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      lastActiveDate: new Date(),
      streakCurrent: 1,
      streakLongest: 1,
      badges: ['Streak Starter'], // Default badge
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          streakCurrent: user.streakCurrent,
          streakLongest: user.streakLongest,
          badges: user.badges,
          dailyGoal: user.dailyGoal,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update login streak before sending response
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streakUpdated = user.streakCurrent;
    let longestUpdated = user.streakLongest;

    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today - lastActive);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Logged in consecutive day
        streakUpdated += 1;
        if (streakUpdated > longestUpdated) {
          longestUpdated = streakUpdated;
        }
      } else if (diffDays > 1) {
        // Streak broken
        streakUpdated = 1;
      }
    } else {
      streakUpdated = 1;
    }

    user.streakCurrent = streakUpdated;
    user.streakLongest = longestUpdated;
    user.lastActiveDate = new Date();

    // Dynamically assign badges
    const badgesSet = new Set(user.badges);
    if (streakUpdated >= 3) badgesSet.add('Consistent');
    if (streakUpdated >= 7) badgesSet.add('Deep Work Champ');
    if (streakUpdated >= 15) badgesSet.add('Unstoppable');
    user.badges = Array.from(badgesSet);

    await user.save();

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        streakCurrent: user.streakCurrent,
        streakLongest: user.streakLongest,
        badges: user.badges,
        dailyGoal: user.dailyGoal,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Refresh streak logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = new Date(user.lastActiveDate || user.createdAt);
    lastActive.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(Math.abs(today - lastActive) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      user.streakCurrent = 0; // Streak broken because they missed a day
      await user.save();
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Upload avatar image
 * @route   PUT /api/auth/avatar
 * @access  Private
 */
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    // Reference URL or relative directory path
    const avatarUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    );

    res.json({
      success: true,
      avatar: avatarUrl,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update profile details
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const { name, dailyGoal } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (dailyGoal) user.dailyGoal = dailyGoal;

    await user.save();

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  uploadAvatar,
  updateProfile,
};
