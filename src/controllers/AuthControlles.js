import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import { generateAccessToken } from '../utils/tokens.js';
import sendEmail from '../utils/sendEmail.js';
import otpTemplate from '../utils/emailTemplates/otpTemplate.js';
import verifyEmailTemplate from '../utils/emailTemplates/verifyEmailTemplate.js';
import emailVerifiedTemplate from '../utils/emailTemplates/emailVerifiedTemplate.js';
// masterAdmin , admin

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const doc = await User.findOne(); // Get the main document that holds all users

    if (!doc) return res.status(404).json({ message: 'No users found' });

    const user = doc.users.find(u => u.username === username);

    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    user.accessToken = accessToken;

    await doc.save(); // Save the updated token

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        token: user.accessToken,
        role: user.role,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};

export const registerUser = async (req, res) => {
  const { username, password, email, name } = req.body;
  try {
    let doc = await User.findOne(); // One document holds all users
    if (!doc) {
      doc = new User({ users: [] });
    }
    const existingUser = doc.users.find(u => u.username === username);
    if (existingUser) {
      return res.status(409).json({ message: 'username already exist' });
    }
    const existingUserEmail = doc.users.find(u => u.email === email);
    if (existingUserEmail) {
      return res.status(409).json({ message: 'email already exist' });
    }
    const token = crypto.randomBytes(20).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: new mongoose.Types.ObjectId(),
      name,
      username,
      password: hashedPassword,
      email,
      role: "user",
      accessToken: generateAccessToken({ username }),
      isEmailVerified: false,
    };
    await sendEmail(
      email,
      'Verify Your Email',
      verifyEmailTemplate(username, `https://sand-valey-flutter-app-backend-node.vercel.app/api/auth/verify-email/${token}`)
    );

    doc.users.push(newUser);
    await doc.save();

    res.status(200).json({
      statusCode: 200,
      message: 'Registration successful',
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        token: newUser.accessToken,
        role: newUser.role,
        emailVerificationToken: newUser.emailVerificationToken,
        isEmailVerified: newUser.isEmailVerified,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Registration error', error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { input } = req.body; // input can be username or email
  try {
    // Find user by username or email
    const doc = await User.findOne();
    if (!doc) return res.status(404).json({ message: 'User storage not found' });

    const user = doc.users.find(
      (u) => u.username === input || u.email === input
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes

    user.resetOTP = otp;
    user.resetOTPExpires = expiry;

    await sendEmail(user.email, 'Your OTP Code', otpTemplate(user.username, otp));
    await doc.save(); // Save the entire document

    res.json({ message: 'OTP sended check your email' }); // Remove `otp` in prod

  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  const { input, otp } = req.body; // input can be username or email

  try {
    const doc = await User.findOne();
    if (!doc) return res.status(404).json({ message: 'No users found' });

    const user = doc.users.find(
      (u) => u.username === input || u.email === input
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resetOTP || !user.resetOTPExpires) {
      return res.status(400).json({ message: 'No OTP generated or expired' });
    }

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: 'Incorrect OTP' });
    }

    if (user.resetOTPExpires < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    res.status(200).json({ message: 'OTP verified successfully' });

  } catch (error) {
    res.status(500).json({ message: 'OTP verification failed', error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { input, otp, newPassword } = req.body; // "username" can be username OR email

  try {
    const doc = await User.findOne();
    if (!doc) return res.status(404).json({ message: 'No users found' });

    const user = doc.users.find(u =>
      u.username === input || u.email === input
    );

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    if (!user.resetOTP || !user.resetOTPExpires)
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    if (user.resetOTP !== otp)
      return res.status(400).json({ message: 'Incorrect OTP' });

    if (user.resetOTPExpires < new Date())
      return res.status(400).json({ message: 'OTP expired' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = null;
    user.resetOTPExpires = null;

    await doc.save();

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    res.status(500).json({ message: 'Reset failed', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id, username, password, newPassword, email, name } = req.body;
  try {
    // Get the single User document that contains all users
    const rootUserDoc = await User.findOne();
    if (!rootUserDoc) return res.status(404).json({ message: 'User collection not found' });

    // Find the specific user by _id in the array
    const user = rootUserDoc.users.find(u => u._id.toString() === id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Handle password change if requested
    if (newPassword) {
      if (!password) return res.status(400).json({ message: 'Current password required' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid current password' });

      user.password = await bcrypt.hash(newPassword, 10);
    }
    // Handle username update if provided
    if (username) {
      user.username = username;
    }
    if (name) {
      user.name = name;
    }

    if (email && email !== user.email) {
      // Check if email already exists in another user
      const emailExists = rootUserDoc.users.some(u => u.email === email && u._id.toString() !== id);
      if (emailExists) {
        return res.status(409).json({ message: 'Email already in use by another user' });
      }
      user.email = email;
      user.isEmailVerified = false;
      user.emailVerificationToken = crypto.randomBytes(20).toString('hex');

      // Send verification email
      const verificationLink = `https://sand-valey-flutter-app-backend-node.vercel.app/api/auth/verify-email/${user.emailVerificationToken}`;
      await sendEmail(
        email,
        'Verify Your New Email',
        verifyEmailTemplate(user.username, verificationLink)
      );
    }

    await rootUserDoc.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        isEmailVerified: user.isEmailVerified
        // Only include password if absolutely needed (not recommended)
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const doc = await User.findOne();
    if (!doc) return res.status(404).json({ message: 'User storage not found' });

    const user = doc.users.find(u => u.emailVerificationToken === token);
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.isEmailVerified = true;
    user.emailVerificationToken = null;

    await doc.save();

    res.status(200).send(emailVerifiedTemplate(user.username));

  } catch (error) {
    res.status(500).json({ message: 'Email verification failed', error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  const { id } = req.params;

  try {
    const rootDoc = await User.findOne();
    if (!rootDoc) return res.status(404).json({ message: 'User collection not found' });

    const user = rootDoc.users.find(u => u._id.toString() === id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate and assign verification token
    user.emailVerificationToken = crypto.randomBytes(20).toString('hex');
    user.isEmailVerified = false;

    await rootDoc.save();

    const verificationLink = `https://sand-valey-flutter-app-backend-node.vercel.app/api/auth/verify-email/${user.emailVerificationToken}`;

    await sendEmail(
      user.email,
      'Verify Your Email',
      verifyEmailTemplate(user.username, verificationLink)
    );

    res.status(200).json({ message: 'Verification email sent successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Failed to send verification email', error: error.message });
  }
};
