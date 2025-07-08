import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import { generateAccessToken } from '../utils/tokens.js';
import sendEmail from '../utils/sendEmail.js';

export const getALlUsers = async (req, res) => {
    try {
        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }
        // Filter only users with role "user"
        const userOnly = doc.users.filter(u => u.role === 'user').map(user => {
            const { password, ...rest } = user.toObject();
            return rest;
        });;

        res.status(200).json({ users: userOnly });

    } catch (error) {
        res.status(500).json({ message: 'Failed to get users', error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const doc = await User.findOne();
      if (!doc) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      const user = doc.users.find(u => u._id.toString() === id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove password before sending
      const { password, ...rest } = user.toObject();
  
      res.status(200).json({ user: rest });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get user', error: error.message });
    }
  };
  
