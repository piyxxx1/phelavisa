import express from 'express';
import {
  register,
  login,
  refreshTokens,
  getMe,
  updateProfile,
  logout,
} from '../auth/authController.js';
import { protect } from '../auth/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshTokens);

// Protected Routes (Requires Bearer Access Token)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;
