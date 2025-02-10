// utils/auth.js
import jwt from 'jsonwebtoken';
import User from 'models/User';

export async function verifyToken(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
}