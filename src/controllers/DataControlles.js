import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/Users.js';
import { generateAccessToken } from '../utils/tokens.js';
import sendEmail from '../utils/sendEmail.js';
import uploadImage from '../utils/uploader/upload.js';
import deleteImage from '../utils/uploader/deleteImage.js';
import replaceImage from '../utils/uploader/replaceImage.js';

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

//seeds main categories
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

export const deleteCategoryById = async (req, res) => {
    try {
        const section = 'seeds';
        const { id } = req.params;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'User document not found' });

        const categoryList = doc.data[section].data;

        const categoryIndex = categoryList.findIndex(cat => cat._id.toString() === id);

        if (categoryIndex === -1) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Get Cloudinary public ID
        const publicId = categoryList[categoryIndex].img?.id;

        // Delete from Cloudinary
        if (publicId) {
            await deleteImage(publicId);
        }
        // Remove from array
        categoryList.splice(categoryIndex, 1);

        await doc.save();

        res.status(200).json({ message: 'Category deleted successfully', categories: doc.data[section] });
    } catch (error) {
        res.status(500).json({ message: 'Delete category error', error: error.message });
    }
};

export const updateCategoryById = async (req, res) => {
    try {
        const section = "seeds";
        const { id, name } = req.body;
        const file = req.file;

        if (!file && !name) {
            return res.status(400).json({ message: "No data provided for update" });
        }

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: "User document not found" });

        const categoryList = doc.data[section].data;
        const categoryIndex = categoryList.findIndex((cat) => cat._id.toString() === id);

        if (categoryIndex === -1) {
            return res.status(404).json({ message: "Category not found" });
        }

        const categoryItem = categoryList[categoryIndex];

        if (name) {
            categoryItem.name = name;
        }

        if (file) {
            const publicId = categoryItem.img?.id;
            const { url: imageUrl, public_id } = await replaceImage(publicId, file.buffer);
            categoryItem.img.url = imageUrl;
            categoryItem.img.id = public_id;
        }

        await doc.save();

        res.status(200).json({
            message: "Category updated successfully",
            categories: doc.data[section],
        });
    } catch (error) {
        res.status(500).json({ message: "Update error", error: error.message });
    }
};

// seeds main type subCat
export const getSeedsTypeByID = async (req, res) => {
    try {
        const { id } = req.params;

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }

        const seeds = doc.data.seeds.data;
        const seedsType = seeds.find((m) => m._id.toString() === id);

        if (!seedsType) {
            return res.status(404).json({ message: 'Seed category not found' });
        }

        res.status(200).json({ data: seedsType });

    } catch (error) {
        res.status(500).json({ message: "get seeds type error", error: error.message });
    }
}

export const addSeedsTypeByID = async (req, res) => {
    try {
        const { id, name } = req.body;

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }

        const seeds = doc.data.seeds.data;
        const seedsCat = seeds.find((m) => m._id.toString() === id);

        if (!seedsCat) {
            return res.status(404).json({ message: 'Seed category not found' });
        }
        const SubCat = seedsCat.Type;
        const newSubCat = {
            _id: new mongoose.Types.ObjectId(),
            name,
        }
        SubCat.push(newSubCat);
        await doc.save();
        res.status(200).json({ data: seedsCat, message: "adding subCategory successfully" });

    } catch (error) {
        res.status(500).json({ message: "get seeds type error", error: error.message });
    }
}

export const deleteSeedsTypeByID = async (req, res) => {
    try {
        const { id } = req.params;

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }

        const seeds = doc.data.seeds.data;
        let found = false;

        // Loop through all seeds categories
        for (const cat of seeds) {
            const typeIndex = cat.Type.findIndex(
                (sub) => sub._id.toString() === id
            );

            if (typeIndex !== -1) {
                cat.Type.splice(typeIndex, 1); // remove the subcategory
                found = true;
                break;
            }
        }

        if (!found) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        await doc.save();

        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete subcategory error', error: error.message });
    }
};

export const updateSeedsTypeByID = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, img, description } = req.body;

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No user found' });
        }

        const seeds = doc.data.seeds.data;
        let updated = false;

        for (const cat of seeds) {
            const typeItem = cat.Type.find(sub => sub._id.toString() === id);
            if (typeItem) {
                if (name) typeItem.name = name;
                if (img) typeItem.img = img;

                if (description) {
                    typeItem.description = {
                        ...typeItem.description,
                        ...description
                    };
                }

                updated = true;
                break;
            }
        }

        if (!updated) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        await doc.save();
        res.status(200).json({ message: '✅ Subcategory updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Update error', error: error.message });
    }
};

// seeds type desc

