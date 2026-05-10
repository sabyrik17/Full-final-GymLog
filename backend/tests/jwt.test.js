import { generateToken, verifyToken } from '../src/config/jwt.js';

describe('JWT Config', () => {
  it('should generate a valid JWT token', () => {
    const userId = '123456789';
    const token = generateToken(userId);
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
  });

  it('should verify a valid token', () => {
    const userId = '123456789';
    const token = generateToken(userId);
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(userId);
  });

  it('should throw error for invalid token', () => {
    expect(() => verifyToken('invalid-token')).toThrow();
  });

  it('should decode token with correct payload', () => {
    const userId = 'user-id-123';
    const token = generateToken(userId);
    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(userId);
    expect(decoded.iat).toBeDefined();
  });
});
