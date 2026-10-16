import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'PHELAVISA_JWT_ACCESS_SECRET_KEY_2026_PRODUCTION';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'PHELAVISA_JWT_REFRESH_SECRET_KEY_2026_PRODUCTION';

/**
 * Generate Access Token (Short-lived JWT for API Authorization)
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      role: user.role || 'USER',
      type: 'ACCESS_TOKEN',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Generate Refresh Token (Long-lived JWT stored in MongoDB Auth Schema)
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      type: 'REFRESH_TOKEN',
    },
    JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, JWT_REFRESH_SECRET);
};
