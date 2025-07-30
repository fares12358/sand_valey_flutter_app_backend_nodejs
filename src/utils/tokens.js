import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role || "user", },
    process.env.JWT_SECRET,
    { expiresIn: '365d' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    REFRESH_SECRET,
    { expiresIn: '30d' } // long-lived
  );
};