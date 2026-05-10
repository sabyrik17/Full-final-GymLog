import jwt from 'jwt-simple';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const generateToken = (userId) => {
  return jwt.encode({ userId, iat: Math.floor(Date.now() / 1000) }, JWT_SECRET);
};

export const verifyToken = (token) => {
  try {
    return jwt.decode(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const JWT_SECRET_CONFIG = JWT_SECRET;
