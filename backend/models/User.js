const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password in standard queries
  },
  avatar: {
    type: String,
    default: '',
  },
  streakCurrent: {
    type: Number,
    default: 0,
  },
  streakLongest: {
    type: Number,
    default: 0,
  },
  lastActiveDate: {
    type: Date,
  },
  badges: {
    type: [String],
    default: [], // e.g., ["Focus Master", "Streak Starter", "Task Crusher"]
  },
  dailyGoal: {
    type: Number,
    default: 3, // Target tasks completed per day
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hashing user passwords on save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password input to database hash
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
