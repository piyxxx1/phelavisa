import mongoose from 'mongoose';

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: true,
    },
    passportNumber: {
      type: String,
      default: '',
    },
    refreshToken: {
      type: String,
      default: '',
    },
    token: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'PARTNER'],
      default: 'USER',
    },
  },
  {
    timestamps: true,
  }
);

export const Auth = mongoose.model('Auth', authSchema);
