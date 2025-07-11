import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import { generateAccessToken } from '../utils/tokens.js';
import sendEmail from '../utils/sendEmail.js';
import uploadImage from '../utils/uploader/upload.js';

export const getALlData = async (req, res) => {
    try {
        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json({ data: doc.data });
    } catch (error) {
        res.status(500).json({ message: 'fitch data error', error: error.message });
    }
};

export const getAllSeeds = async (req, res) => {
    try {
        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }
        const seeds = doc.data.seeds;
        res.status(200).json({ data: seeds });
    } catch (error) {
        res.status(500).json({ message: 'fitch data error', error: error.message });
    }
};


export const addSeedsCategories = async (req, res) => {
    try {
        const section = 'seeds';
        const { name } = req.body;

        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'Image file is required' });
        }
        
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'User document not found' });
        
        if (!doc.data[section]) {
            return res.status(404).json({ message: `Section '${section}' not found` });
        }
        const cat = doc.data[section].data;
        const { url: imageUrl, public_id } = await uploadImage(file.buffer);
        
        const newCategory = {
            _id: new mongoose.Types.ObjectId(),
            img: {
                url: imageUrl,
                id: public_id,
            },
            name,
            Type: [],
        }

        cat.push(newCategory)
        await doc.save();
        res.status(200).json({
            message: 'new category added successfully',
            categories: doc.data[section],
        });

    } catch (error) {
        res.status(500).json({ message: 'Add category error', error: error.message });
    }
};

export const updateData = async (req, res) => {
    const { select, typeone, typetwo, description, img, name, id } = req.body;
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
    const { select, typeone, typetwo, description, img, name, id } = req.body;
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
