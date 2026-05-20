import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Not authorized. Token missing.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User no longer exists.' });

    req.user = { id: user._id, name: user.name, role: user.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized. Invalid or expired token.' });
  }
};
