import bcrypt from 'bcryptjs';
import { Auth } from '../models/Auth.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './jwtUtils.js';

/**
 * Register User Account & Save Tokens in MongoDB Auth Schema
 */
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, passportNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required for registration.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone ? phone.trim() : '';

    // Check unique email
    const existingEmailUser = await Auth.findOne({ email: normalizedEmail });
    if (existingEmailUser) {
      return res.status(400).json({ message: 'An account with this email address already exists. Please sign in.' });
    }

    // Check unique phone number if provided
    if (normalizedPhone !== '') {
      const existingPhoneUser = await Auth.findOne({ phone: normalizedPhone });
      if (existingPhoneUser) {
        return res.status(400).json({ message: 'An account with this mobile number already exists. Please sign in.' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Auth({
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      passportNumber: passportNumber ? passportNumber.trim() : '',
      role: 'USER',
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Save initial tokens inside MongoDB Auth document
    newUser.token = accessToken;
    newUser.refreshToken = refreshToken;

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please log in with your email and password.',
      registeredEmail: newUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

/**
 * Login User & Save Tokens in MongoDB Auth Schema
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await Auth.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email address or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email address or password' });
    }

    // Generate fresh dual tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save tokens in MongoDB Auth Schema
    user.token = accessToken;
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        passportNumber: user.passportNumber,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

/**
 * Refresh JWT Access Token using Refresh Token from MongoDB Auth Schema
 */
export const refreshTokens = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token signature
    const decoded = verifyRefreshToken(refreshToken);

    // Find user in MongoDB Auth collection matching this refreshToken
    const user = await Auth.findOne({ _id: decoded.id, refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'Invalid or revoked refresh token' });
    }

    // Generate new Access Token and Refresh Token
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.token = newAccessToken;
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      message: 'Tokens refreshed successfully',
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token', error: error.message });
  }
};

/**
 * Get Currently Authenticated User Profile
 */
export const getMe = async (req, res) => {
  try {
    if (req.user) {
      return res.json({ user: req.user });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    const token = authHeader.split(' ')[1];
    const user = await Auth.findOne({ token }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Failed to retrieve profile', error: error.message });
  }
};

/**
 * Update User Profile in MongoDB Auth Schema
 */
export const updateProfile = async (req, res) => {
  try {
    const { email, name, phone, passportNumber } = req.body;
    const targetEmail = req.user ? req.user.email : email;

    if (!targetEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const updatedUser = await Auth.findOneAndUpdate(
      { email: targetEmail.toLowerCase().trim() },
      { name, phone, passportNumber },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User profile not found for update' });
    }

    res.json({
      message: 'Profile details updated in MongoDB Auth schema',
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user profile', error: error.message });
  }
};

/**
 * Logout User & Clear Tokens from MongoDB Auth Schema
 */
export const logout = async (req, res) => {
  try {
    const { email } = req.body;
    const userEmail = req.user ? req.user.email : email;

    if (userEmail) {
      await Auth.findOneAndUpdate(
        { email: userEmail.toLowerCase().trim() },
        { token: '', refreshToken: '' }
      );
    }

    res.json({ message: 'Logged out successfully, tokens cleared from MongoDB Auth schema' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error.message });
  }
};
