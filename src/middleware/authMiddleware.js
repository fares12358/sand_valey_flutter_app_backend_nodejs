import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "❌ No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "❌ Invalid token: user not found" });
    }
    req.user = user; // attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: "❌ Invalid token", error: error.message });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '❌ No token provided' });
      }

      const token = authHeader.split(' ')[1]; // extract token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token

      // Find the user from the database using decoded ID
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: '❌ User not found' });
      }

      // Check if user role is allowed
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: '❌ Access denied. Insufficient permissions' });
      }


      next(); // pass to next middleware/route
    } catch (error) {
      res.status(401).json({ message: '❌ Invalid or expired token', error: error.message });
    }
  };
};
