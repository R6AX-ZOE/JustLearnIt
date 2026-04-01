import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  learningStats: {
    totalStudyTime: {
      type: Number,
      default: 0,
    },
    completedCourses: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastStudyDate: {
      type: Date,
      default: null,
    },
  },
});

const User = mongoose.model('User', userSchema);

export default User;
