import { verifyAccessToken } from './jwtUtils.js';
import { Auth } from '../models/Auth.js';

/**
 * Protect Middleware: Verifies Bearer JWT Token and attaches logged-in user from MongoDB
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'];
    }

    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No JWT authentication token provided' });
    }

    const decoded = verifyAccessToken(token);
    const user = await Auth.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Authentication Failed: User profile not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired JWT token',
      error: error.message,
    });
  }
};
