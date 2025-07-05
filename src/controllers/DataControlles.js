import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import { generateAccessToken } from '../utils/tokens.js';
import sendEmail from '../utils/sendEmail.js';

export const getALlData = async (req, res) => {
    try {
        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json({ data: doc.data });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
};

export const addData = async (req, res) => {
    const { select, typeone, typetwo, description, img, name ,id } = req.body;
    try {
        const Doc = await User.findOne();
        if (!Doc) return res.status(404).json({ message: 'collection not found' });
    
        // Find the specific user by _id in the array
        const user = Doc.users.find(u => u._id.toString() === id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const data = Doc.data;

    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
};

export const updateData = async (req, res) => {
    const { select, typeone, typetwo, description, img, name ,id } = req.body;
    try {
        const Doc = await User.findOne();
        if (!Doc) return res.status(404).json({ message: 'collection not found' });
    
        // Find the specific user by _id in the array
        const user = Doc.users.find(u => u._id.toString() === id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const data = Doc.data;

    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
};

export const DeleteData = async (req, res) => {
    const { select, typeone, typetwo, description, img, name ,id } = req.body;
    try {
        const Doc = await User.findOne();
        if (!Doc) return res.status(404).json({ message: 'collection not found' });
    
        // Find the specific user by _id in the array
        const user = Doc.users.find(u => u._id.toString() === id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const data = Doc.data;

    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
};


