import mongoose from 'mongoose';
import User from '../models/Users.js';
import sendEmail from '../utils/sendEmail.js';
import uploadImage from '../utils/uploader/upload.js';
import deleteImage from '../utils/uploader/deleteImage.js';
import replaceImage from '../utils/uploader/replaceImage.js';

// GET: All Data
export const getALlData = async (req, res) => {
    try {
        const doc = await User.findOne().lean();
        if (!doc) return res.status(404).json({ message: 'No users found' });

        res.status(200).json({ data: doc.data });
    } catch (error) {
        res.status(500).json({ message: 'fetch data error', error: error.message });
    }
};

// GET: Main Category
export const getmainCat = async (req, res) => {
    try {
        const doc = await User.findOne().lean();
        if (!doc) return res.status(404).json({ message: 'No users found' });

        res.status(200).json({ data: doc.data.main });
    } catch (error) {
        res.status(500).json({ message: 'fetch data error', error: error.message });
    }
};

// POST: Add Main Category Image
export const addmainCat = async (req, res) => {
    try {
        const { section } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No file found' });

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'No users found' });

        const { url: imageUrl, public_id } = await uploadImage(file.buffer);
        doc.data.main[section].img = { url: imageUrl, id: public_id };

        await doc.save();
        res.status(200).json({ data: doc.data.main });
    } catch (error) {
        res.status(500).json({ message: 'fetch data error', error: error.message });
    }
};

// PUT: Update Main Category Image
export const UpdatemainCat = async (req, res) => {
    try {
        const { section } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No file found' });

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'No users found' });

        const publicId = doc.data.main[section]?.img?.id;
        const { url: imageUrl, public_id } = await replaceImage(publicId, file.buffer);

        doc.data.main[section].img = { url: imageUrl, id: public_id };

        await doc.save();
        res.status(200).json({ data: doc.data.main });
    } catch (error) {
        res.status(500).json({ message: 'fetch data error', error: error.message });
    }
};

// GET: All Seeds
export const getAllSeeds = async (req, res) => {
    try {
        const doc = await User.findOne().lean();
        if (!doc) return res.status(404).json({ message: 'No users found' });

        res.status(200).json({ data: doc.data.seeds });
    } catch (error) {
        res.status(500).json({ message: 'fetch data error', error: error.message });
    }
};

// POST: Add Seeds Category
export const addSeedsCategories = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'Image file is required' });

        const doc = await User.findOne();
        if (!doc || !doc.data.seeds) {
            return res.status(404).json({ message: 'Seeds section not found' });
        }

        const { url: imageUrl, public_id } = await uploadImage(file.buffer);
        const newCategory = {
            _id: new mongoose.Types.ObjectId(),
            img: { url: imageUrl, id: public_id },
            name,
            Type: [],
        };

        doc.data.seeds.data.push(newCategory);
        await doc.save();

        res.status(200).json({
            message: 'New category added successfully',
            categories: doc.data.seeds,
        });
    } catch (error) {
        res.status(500).json({ message: 'Add category error', error: error.message });
    }
};

// DELETE: Seeds Category by ID
export const deleteCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'User document not found' });

        const categories = doc.data.seeds.data;
        const index = categories.findIndex(cat => cat._id.toString() === id);

        if (index === -1) return res.status(404).json({ message: 'Category not found' });

        const publicId = categories[index].img?.id;
        if (publicId) await deleteImage(publicId);

        categories.splice(index, 1);
        await doc.save();

        res.status(200).json({
            message: 'Category deleted successfully',
            categories: doc.data.seeds,
        });
    } catch (error) {
        res.status(500).json({ message: 'Delete category error', error: error.message });
    }
};

// PUT: Update Seeds Category
export const updateCategoryById = async (req, res) => {
    try {
        const { id, name } = req.body;
        const file = req.file;

        if (!file && !name) {
            return res.status(400).json({ message: 'No data provided for update' });
        }

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'User document not found' });

        const category = doc.data.seeds.data.find(cat => cat._id.toString() === id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        if (name) category.name = name;

        if (file) {
            const publicId = category.img?.id;
            const { url: imageUrl, public_id } = await replaceImage(publicId, file.buffer);
            category.img = { url: imageUrl, id: public_id };
        }

        await doc.save();
        res.status(200).json({
            message: 'Category updated successfully',
            categories: doc.data.seeds,
        });
    } catch (error) {
        res.status(500).json({ message: 'Update error', error: error.message });
    }
};


// seeds main type subCat
export const getSeedsTypeByID = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'No users found' });

        const seedsType = doc.data.seeds.data.find(m => m._id.toString() === id);
        if (!seedsType) return res.status(404).json({ message: 'Seed category not found' });

        res.status(200).json({ data: seedsType });
    } catch (error) {
        res.status(500).json({ message: "get seeds type error", error: error.message });
    }
};

export const addSeedsTypeByID = async (req, res) => {
    try {
        const { id, name } = req.body;
        const file = req.file;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'No users found' });
        if (!file) return res.status(404).json({ message: 'No file found' });

        const seedsCat = doc.data.seeds.data.find(m => m._id.toString() === id);
        if (!seedsCat) return res.status(404).json({ message: 'Seed category not found' });

        const { url: imageUrl, public_id } = await uploadImage(file.buffer);
        const newSubCat = {
            _id: new mongoose.Types.ObjectId(),
            name,
            img: { url: imageUrl, id: public_id },
        };
        seedsCat.Type.push(newSubCat);

        await doc.save();
        res.status(200).json({ data: seedsCat, message: "adding subCategory successfully" });
    } catch (error) {
        res.status(500).json({ message: "get seeds type error", error: error.message });
    }
};

export const deleteSeedsTypeByID = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No users found' });

        let found = false;
        for (const cat of doc.data.seeds.data) {
            const typeIndex = cat.Type.findIndex(sub => sub._id.toString() === id);
            if (typeIndex !== -1) {
                const publicId = cat.Type[typeIndex].img?.id;
                if (publicId) await deleteImage(publicId);
                cat.Type.splice(typeIndex, 1);
                found = true;
                break;
            }
        }

        if (!found) return res.status(404).json({ message: '❌ Subcategory not found' });

        await doc.save();
        res.status(200).json({ message: '✅ Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Delete subcategory error', error: error.message });
    }
};

export const updateSeedsTypeByID = async (req, res) => {
    try {
        const { name, id } = req.body;
        const file = req.file;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No user found' });

        let updated = false;
        for (const cat of doc.data.seeds.data) {
            const typeItem = cat.Type.find(sub => sub._id.toString() === id);
            if (typeItem) {
                if (name) typeItem.name = name;
                if (file) {
                    const publicId = typeItem.img?.id;
                    const { url: imageUrl, public_id } = await replaceImage(publicId, file.buffer);
                    typeItem.img = { url: imageUrl, id: public_id };
                }
                updated = true;
                break;
            }
        }

        if (!updated) return res.status(404).json({ message: '❌ Subcategory not found' });

        await doc.save();
        res.status(200).json({ message: '✅ Subcategory updated successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Update error', error: error.message });
    }
};

export const getSeedsDescreptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'No users found' });

        let foundType = null;
        for (const cat of doc.data.seeds.data) {
            const match = cat.Type.find(type => type._id.toString() === id);
            if (match) {
                foundType = match;
                break;
            }
        }

        if (!foundType) return res.status(404).json({ message: 'Subcategory not found' });

        res.status(200).json({ data: foundType });
    } catch (error) {
        res.status(500).json({ message: 'Fetch error', error: error.message });
    }
};

export const addSubCategoryDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, company, description } = req.body;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'User not found' });

        let found = false;
        for (const category of doc.data.seeds.data) {
            const sub = category.Type.find(type => type._id.toString() === id);
            if (sub) {
                sub.description = { name: name || '', company: company || '', description: description || '' };
                found = true;
                break;
            }
        }

        if (!found) return res.status(404).json({ message: 'Subcategory not found' });

        await doc.save();
        res.status(200).json({ message: '✅ Description added successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to add description', error: error.message });
    }
};

export const updateSubCategoryDescription = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, company, description } = req.body;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'User not found' });

        let updated = false;
        for (const category of doc.data.seeds.data) {
            const sub = category.Type.find(type => type._id.toString() === id);
            if (sub) {
                if (!sub.description) sub.description = {};
                if (name !== undefined) sub.description.name = name;
                if (company !== undefined) sub.description.company = company;
                if (description !== undefined) sub.description.description = description;
                updated = true;
                break;
            }
        }

        if (!updated) return res.status(404).json({ message: 'Subcategory not found' });

        await doc.save();
        res.status(200).json({ message: '✅ Description updated successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to update description', error: error.message });
    }
};

export const deleteSubCategoryDescriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'No user found' });

        let found = false;
        for (const cat of doc.data.seeds.data) {
            const sub = cat.Type.find(type => type._id.toString() === id);
            if (sub && sub.description) {
                sub.description = undefined;
                found = true;
                break;
            }
        }

        if (!found) return res.status(404).json({ message: 'Description not found or already deleted' });

        await doc.save();
        res.status(200).json({ message: '✅ Description deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete description', error: error.message });
    }
};



export const getAllCommunication = async (req, res) => {
    try {
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No user found' });

        res.status(200).json({ data: doc.data.Communication });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch communication', error: error.message });
    }
};

// ✅ Add communication place
export const addCommunication = async (req, res) => {
    try {
        const { name } = req.body;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No user found' });

        const newPlace = {
            _id: new mongoose.Types.ObjectId(),
            name,
            eng: [],
        };

        doc.data.Communication.data.push(newPlace);
        await doc.save();

        res.status(200).json({ message: '✅ Communication place added', data: newPlace });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to add communication place', error: error.message });
    }
};

// ✅ Update communication place
export const updateCommunication = async (req, res) => {
    try {
        const { id, name } = req.body;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No user found' });

        const place = doc.data.Communication.data.find(p => p._id.toString() === id);
        if (!place) return res.status(404).json({ message: '❌ Communication place not found' });

        if (name) place.name = name;

        await doc.save();
        res.status(200).json({ message: '✅ Communication place updated', data: place });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to update communication place', error: error.message });
    }
};

// ✅ Delete communication place
export const deleteCommunication = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No user found' });

        const originalLength = doc.data.Communication.data.length;
        doc.data.Communication.data = doc.data.Communication.data.filter(p => p._id.toString() !== id);

        if (doc.data.Communication.data.length === originalLength)
            return res.status(404).json({ message: '❌ Communication place not found' });

        await doc.save();
        res.status(200).json({ message: '✅ Communication place deleted' });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete communication place', error: error.message });
    }
};

// ✅ Add engineer to communication place
export const addEngCommunication = async (req, res) => {
    try {
        const { id, name, phone } = req.body;
        const file = req.file;
        if (!file) return res.status(400).json({ message: '❌ Image is required' });

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No user found' });

        const place = doc.data.Communication.data.find(p => p._id.toString() === id);
        if (!place) return res.status(404).json({ message: '❌ Communication place not found' });

        const { url, public_id } = await uploadImage(file.buffer);
        const newEng = {
            _id: new mongoose.Types.ObjectId(),
            name,
            phone,
            img: { url, id: public_id },
        };

        place.eng.push(newEng);
        await doc.save();

        res.status(200).json({ message: '✅ Engineer added', data: newEng });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to add engineer', error: error.message });
    }
};

// ✅ Get all engineers by place ID
export const getEngCommunicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No user found' });

        const place = doc.data.Communication.data.find(p => p._id.toString() === id);
        if (!place) return res.status(404).json({ message: '❌ Communication place not found' });

        res.status(200).json({ message: '✅ Engineers fetched', data: place.eng });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to get engineers', error: error.message });
    }
};

// ✅ Update engineer by ID
export const updateEngById = async (req, res) => {
    try {
        const { placeId, engId } = req.params;
        const { name, phone } = req.body;
        const file = req.file;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No user found' });

        const place = doc.data.Communication.data.find(p => p._id.toString() === placeId);
        if (!place) return res.status(404).json({ message: '❌ Communication place not found' });

        const eng = place.eng.find(e => e._id.toString() === engId);
        if (!eng) return res.status(404).json({ message: '❌ Engineer not found' });

        if (name) eng.name = name;
        if (phone) eng.phone = phone;

        if (file) {
            const { url, public_id } = await replaceImage(eng.img?.id, file.buffer);
            eng.img = { url, id: public_id };
        }

        await doc.save();
        res.status(200).json({ message: '✅ Engineer updated', data: eng });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to update engineer', error: error.message });
    }
};

// ✅ Delete engineer by ID
export const deleteEngById = async (req, res) => {
    try {
        const { placeId, engId } = req.params;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No user found' });

        const place = doc.data.Communication.data.find(p => p._id.toString() === placeId);
        if (!place) return res.status(404).json({ message: '❌ Communication place not found' });

        const engIndex = place.eng.findIndex(e => e._id.toString() === engId);
        if (engIndex === -1) return res.status(404).json({ message: '❌ Engineer not found' });

        const publicId = place.eng[engIndex].img?.id;
        if (publicId) await deleteImage(publicId);

        place.eng.splice(engIndex, 1);
        await doc.save();

        res.status(200).json({ message: '✅ Engineer deleted', data: place.eng });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete engineer', error: error.message });
    }
};


// Get all insecticide data
export const getInsecticideData = async (req, res) => {
    try {
        const doc = await User.findOne();
        if (!doc?.data?.Insecticide) {
            return res.status(404).json({ message: '❌ No data found' });
        }

        res.status(200).json({ data: doc.data.Insecticide });
    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to get insecticide data',
            error: error.message,
        });
    }
};

// Add new insecticide category
export const addInsecticideData = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;

        if (!name || !file) {
            return res.status(400).json({ message: '❌ Name and image file are required' });
        }

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No user found' });

        const data = doc.data.Insecticide?.data || [];

        const { url: imageUrl, public_id } = await uploadImage(file.buffer);

        const newEntry = {
            _id: new mongoose.Types.ObjectId(),
            name,
            img: {
                url: imageUrl,
                id: public_id,
            },
            Type: [],
        };

        data.push(newEntry);
        doc.data.Insecticide = { data };
        await doc.save();

        res.status(200).json({ message: '✅ Insecticide added', data });
    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to add insecticide',
            error: error.message,
        });
    }
};

// Update insecticide category
export const updateInsecticideData = async (req, res) => {
    try {
        const { id, name } = req.body;
        const file = req.file;

        if (!id) {
            return res.status(400).json({ message: '❌ ID is required' });
        }

        const doc = await User.findOne();
        if (!doc?.data?.Insecticide?.data) {
            return res.status(404).json({ message: '❌ Insecticide data not found' });
        }

        const insecticide = doc.data.Insecticide.data.find(item => item._id.toString() === id);
        if (!insecticide) {
            return res.status(404).json({ message: '❌ Category not found' });
        }

        if (name) insecticide.name = name;

        if (file) {
            const oldPublicId = insecticide.img?.id;
            const { url: imageUrl, public_id } = await replaceImage(oldPublicId, file.buffer);
            insecticide.img = { url: imageUrl, id: public_id };
        }

        await doc.save();

        res.status(200).json({
            message: '✅ Insecticide updated successfully',
            data: insecticide,
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to update insecticide',
            error: error.message,
        });
    }
};

// Delete insecticide category
export const deleteInsecticideData = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).json({ message: '❌ ID is required' });

        const doc = await User.findOne();
        if (!doc?.data?.Insecticide?.data) {
            return res.status(404).json({ message: '❌ Insecticide data not found' });
        }

        const category = doc.data.Insecticide.data.find(item => item._id.toString() === id);
        if (!category) {
            return res.status(404).json({ message: '❌ Category not found' });
        }

        const publicId = category.img?.id;
        if (publicId) await deleteImage(publicId);

        doc.data.Insecticide.data = doc.data.Insecticide.data.filter(item => item._id.toString() !== id);
        await doc.save();

        res.status(200).json({
            message: '✅ Category deleted successfully',
            data: doc.data.Insecticide.data,
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to delete insecticide',
            error: error.message,
        });
    }
};


// Get all types of a category
export const getInsecticideTypes = async (req, res) => {
    try {
        const { catId } = req.params;
        const doc = await User.findOne();

        const category = doc?.data?.Insecticide?.data.find(cat => cat._id.toString() === catId);
        if (!category) return res.status(404).json({ message: '❌ Category not found' });

        res.status(200).json({ data: category.Type });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch types', error: error.message });
    }
};

// Add a new type to a category
export const addInsecticideType = async (req, res) => {
    try {
        const { name, description, id, company } = req.body;
        const file = req.file;

        if (!name || !file || !id) {
            return res.status(400).json({ message: '❌ Name, image file, and category ID are required' });
        }

        const doc = await User.findOne();
        const category = doc?.data?.Insecticide?.data.find(cat => cat._id.toString() === id);
        if (!category) return res.status(404).json({ message: '❌ Category not found' });

        const { url: imageUrl, public_id } = await uploadImage(file.buffer);

        const newType = {
            _id: new mongoose.Types.ObjectId(),
            name,
            description,
            img: { url: imageUrl, id: public_id },
            company,
        };

        category.Type.push(newType);
        await doc.save();

        res.status(200).json({ message: '✅ Type added successfully', data: category.Type });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to add type', error: error.message });
    }
};

// Update a type inside a category
export const updateInsecticideType = async (req, res) => {
    try {
        const { catId, typeId } = req.params;
        const { name, description, company } = req.body;
        const file = req.file;

        const doc = await User.findOne();
        const category = doc?.data?.Insecticide?.data.find(cat => cat._id.toString() === catId);
        if (!category) return res.status(404).json({ message: '❌ Category not found' });

        const type = category.Type.find(t => t._id.toString() === typeId);
        if (!type) return res.status(404).json({ message: '❌ Type not found' });

        if (name) type.name = name;
        if (description) type.description = description;
        if (company) type.company = company;

        if (file) {
            const oldPublicId = type.img?.id;
            const { url: imageUrl, public_id } = await replaceImage(oldPublicId, file.buffer);
            type.img = { url: imageUrl, id: public_id };
        }

        await doc.save();
        res.status(200).json({ message: '✅ Type updated successfully', data: type });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to update type', error: error.message });
    }
};

// Delete a type from a category
export const deleteInsecticideType = async (req, res) => {
    try {
        const { catId, typeId } = req.params;

        const doc = await User.findOne();
        const category = doc?.data?.Insecticide?.data.find(cat => cat._id.toString() === catId);
        if (!category) return res.status(404).json({ message: '❌ Category not found' });

        const type = category.Type.find(t => t._id.toString() === typeId);
        if (!type) return res.status(404).json({ message: '❌ Type not found' });

        const oldPublicId = type.img?.id;
        if (oldPublicId) await deleteImage(oldPublicId);

        category.Type = category.Type.filter(t => t._id.toString() !== typeId);
        await doc.save();

        res.status(200).json({ message: '✅ Type deleted successfully', data: category.Type });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete type', error: error.message });
    }
};