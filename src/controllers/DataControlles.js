import mongoose from 'mongoose';
import User from '../models/Users.js';
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
export const getmainCat = async (req, res) => {
    try {
        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }
        const main = doc.data.main;
        res.status(200).json({ data: main });
    } catch (error) {
        res.status(500).json({ message: 'fitch data error', error: error.message });
    }
}
export const addmainCat = async (req, res) => {
    try {
        const { section } = req.body;
        const file = req.file;
        const doc = await User.findOne();
        if (!file) {
            return res.status(404).json({ message: 'No file found' });
        }
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }
        const main = doc.data.main;
        const { url: imageUrl, public_id } = await uploadImage(file.buffer);
        main[section].img.url = imageUrl;
        main[section].img.id = public_id;
        await doc.save();

        res.status(200).json({ data: main });
    } catch (error) {
        res.status(500).json({ message: 'fitch data error', error: error.message });
    }
}
export const UpdatemainCat = async (req, res) => {
    try {
        const { section } = req.body;
        const file = req.file;
        const doc = await User.findOne();
        if (!file) {
            return res.status(404).json({ message: 'No file found' });
        }
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }
        const main = doc.data.main;

        const publicId = main[section].img?.id;
        const { url: imageUrl, public_id } = await replaceImage(publicId, file.buffer);
        main[section].img.url = imageUrl;
        main[section].img.id = public_id;

        await doc.save();

        res.status(200).json({ data: main });
    } catch (error) {
        res.status(500).json({ message: 'fitch data error', error: error.message });
    }
}
//seeds categories
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
        const section = 'seeds'; // or dynamic
        const { id } = req.params;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'User document not found' });

        const categoryList = doc.data[section].data;
        const categoryIndex = categoryList.findIndex(cat => cat._id.toString() === id);

        if (categoryIndex === -1) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const category = categoryList[categoryIndex];

        // 🧹 Collect all image IDs to delete
        const imageIdsToDelete = [];

        // 🖼️ Category image
        if (category.img?.id) {
            imageIdsToDelete.push(category.img.id);
        }

        // 🔁 Loop through all nested Types
        category.Type?.forEach(type => {
            if (type.img?.id) {
                imageIdsToDelete.push(type.img.id);
            }
            if (type.description?.img?.id) {
                imageIdsToDelete.push(type.description.img.id);
            }
        });

        // 🧨 Delete all collected images from Cloudinary
        for (const imgId of imageIdsToDelete) {
            await deleteImage(imgId);
        }

        // ❌ Remove category
        categoryList.splice(categoryIndex, 1);
        await doc.save();

        res.status(200).json({ message: '✅ Category and all nested images deleted successfully', categories: doc.data[section] });

    } catch (error) {
        res.status(500).json({ message: '❌ Delete category error', error: error.message });
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
        const file = req.file;
        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }
        if (!file) {
            return res.status(404).json({ message: 'No file found' });
        }

        const seeds = doc.data.seeds.data;
        const seedsCat = seeds.find((m) => m._id.toString() === id);

        if (!seedsCat) {
            return res.status(404).json({ message: 'Seed category not found' });
        }
        const SubCat = seedsCat.Type;
        const { url: imageUrl, public_id } = await uploadImage(file.buffer);

        const newSubCat = {
            _id: new mongoose.Types.ObjectId(),
            name,
            img: {
                url: imageUrl,
                id: public_id,
            },
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
            return res.status(404).json({ message: '❌ No users found' });
        }

        const seeds = doc.data.seeds.data;
        let found = false;

        for (const cat of seeds) {
            const typeIndex = cat.Type.findIndex(sub => sub._id.toString() === id);
            if (typeIndex !== -1) {
                const type = cat.Type[typeIndex];

                // 🧹 Collect all image IDs
                const imageIds = [];

                // Subcategory image
                if (type.img?.id) {
                    imageIds.push(type.img.id);
                }

                // Description image (if exists)
                if (type.description?.img?.id) {
                    imageIds.push(type.description.img.id);
                }

                // 🧨 Delete all images from Cloudinary
                for (const imgId of imageIds) {
                    await deleteImage(imgId);
                }

                // ❌ Remove subcategory
                cat.Type.splice(typeIndex, 1);
                found = true;
                break;
            }
        }

        if (!found) {
            return res.status(404).json({ message: '❌ Subcategory not found' });
        }

        await doc.save();

        res.status(200).json({ message: '✅ Subcategory and nested images deleted successfully' });
    } catch (error) {
        res.status(500).json({
            message: '❌ Delete subcategory error',
            error: error.message,
        });
    }
};

export const updateSeedsTypeByID = async (req, res) => {
    try {
        const { name, id } = req.body;
        const file = req.file;

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: '❌ No user found' });
        }

        const seeds = doc.data.seeds.data;
        let updated = false;

        for (const cat of seeds) {
            const typeItem = cat.Type.find(sub => sub._id.toString() === id);
            if (typeItem) {
                if (name) typeItem.name = name;

                if (file) {
                    const publicId = typeItem.img?.id;
                    const { url: imageUrl, public_id } = await replaceImage(publicId, file.buffer);
                    typeItem.img.url = imageUrl;
                    typeItem.img.id = public_id;
                }

                updated = true;
                break;
            }
        }

        if (!updated) {
            return res.status(404).json({ message: '❌ Subcategory not found' });
        }

        await doc.save();
        res.status(200).json({ message: '✅ Subcategory updated successfully' });
    } catch (error) {
        res.status(500).json({
            message: '❌ Update error',
            error: error.message,
        });
    }
};
// seeds  descreption// ✅ Get the full subcategory (Type) including description by its ID
export const getSeedsDescreptionById = async (req, res) => {
    try {
        const { id } = req.params; // ✅ use req.params not res.params

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }

        const seeds = doc.data.seeds.data;

        // 🔍 Loop through each category to find the Type with matching ID
        let foundType = null;
        for (const cat of seeds) {
            const match = cat.Type.find(type => type._id.toString() === id);
            if (match) {
                foundType = match;
                break;
            }
        }

        if (!foundType) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.status(200).json({ data: foundType }); // includes full description object
    } catch (error) {
        res.status(500).json({ message: 'Fetch error', error: error.message });
    }
};
export const addSubCategoryDescription = async (req, res) => {
    try {
        const { id } = req.params; // Subcategory (Type[]) _id
        const { name, company, description } = req.body;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'User not found' });

        const seeds = doc.data.seeds.data;
        let found = false;

        for (const category of seeds) {
            const subcategory = category.Type.find(type => type._id.toString() === id);

            if (subcategory) {
                // Overwrite or add description
                subcategory.description = {
                    name: name || '',
                    company: company || '',
                    description: description || '',
                };
                found = true;
                break;
            }
        }

        if (!found) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        await doc.save();
        res.status(200).json({ message: '✅ Description added successfully' });

    } catch (error) {
        res.status(500).json({ message: '❌ Failed to add description', error: error.message });
    }
};
export const updateSubCategoryDescription = async (req, res) => {
    try {
        const { id } = req.params; // this is the subcategory (_id) from Type[]
        const { name, company, description } = req.body;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'User not found' });

        const seeds = doc.data.seeds.data;
        let updated = false;

        for (const category of seeds) {
            const subcategory = category.Type.find((type) => type._id.toString() === id);
            if (subcategory) {
                // If description doesn't exist yet, create it
                if (!subcategory.description) {
                    subcategory.description = {};
                }

                if (name !== undefined) subcategory.description.name = name;
                if (company !== undefined) subcategory.description.company = company;
                if (description !== undefined) subcategory.description.description = description;

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
        const { id } = req.params; // subcategory (_id in Type[]) to find

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: 'No user found' });

        const seeds = doc.data.seeds.data;
        let found = false;

        for (const cat of seeds) {
            const subcategory = cat.Type.find(type => type._id.toString() === id);
            if (subcategory && subcategory.description) {
                subcategory.description = undefined; // remove the entire object
                found = true;
                break;
            }
        }

        if (!found) {
            return res.status(404).json({ message: 'Description not found or already deleted' });
        }

        await doc.save();
        res.status(200).json({ message: '✅ Description deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete description', error: error.message });
    }
};

//Comunication
export const getAllCommunication = async (req, res) => {
    try {
        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }
        const comm = doc.data.Communication;
        res.status(200).json({ data: comm });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to get Communication', error: error.message });
    }
}
//add Communication
export const addCommunication = async (req, res) => {
    try {
        const { name } = req.body;
        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }
        const comm = doc.data.Communication.data;
        const newCommunicationt = {
            _id: new mongoose.Types.ObjectId(),
            name,
            eng: [],
        }
        comm.push(newCommunicationt);
        await doc.save();
        res.status(200).json({ data: comm });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to add Communication', error: error.message });
    }
}
//update communication 
export const updateCommunication = async (req, res) => {
    try {
        const { id, name } = req.body;
        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: 'No users found' });
        }
        const comm = doc.data.Communication.data;
        const selcted = comm.find((m) => m._id.toString() === id);
        if (name) {
            selcted.name = name;
        }
        await doc.save();
        res.status(200).json({ data: comm });

    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to update engineer',
            error: error.message
        });
    }
}
//delete communication
export const deleteCommunication = async (req, res) => {
    try {
        const { id } = req.params;

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: '❌ No users found' });
        }

        const communication = doc.data.Communication.data;
        const placeIndex = communication.findIndex(item => item._id.toString() === id);

        if (placeIndex === -1) {
            return res.status(404).json({ message: '❌ Communication item not found' });
        }

        const place = communication[placeIndex];

        // 🧹 Collect image IDs to delete
        const imageIds = [];

        // Main place image
        if (place.img?.id) {
            imageIds.push(place.img.id);
        }

        // All engineer images
        if (place.eng && Array.isArray(place.eng)) {
            for (const eng of place.eng) {
                if (eng.img?.id) {
                    imageIds.push(eng.img.id);
                }
            }
        }

        // 🧨 Delete all images from Cloudinary
        for (const imgId of imageIds) {
            await deleteImage(imgId);
        }

        // ❌ Remove the communication place from array
        doc.data.Communication.data.splice(placeIndex, 1);

        await doc.save();
        res.status(200).json({
            message: '✅ Communication and all nested images deleted successfully',
            data: doc.data.Communication.data
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to delete communication',
            error: error.message
        });
    }
};

//add eng 
export const addEngCommunication = async (req, res) => {
    try {
        const { id, name, phone } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: '❌ Image file is required' });
        }

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: '❌ No users found' });
        }

        const communication = doc.data.Communication.data;

        // ✅ Fix: Properly compare the id as string
        const place = communication.find(place => place._id.toString() === id);

        if (!place) {
            return res.status(404).json({ message: '❌ Place not found' });
        }

        const { url: imageUrl, public_id } = await uploadImage(file.buffer);

        const newEngineer = {
            _id: new mongoose.Types.ObjectId(),
            name,
            phone,
            img: {
                url: imageUrl,
                id: public_id,
            }
        };

        place.eng.push(newEngineer);

        await doc.save();

        res.status(200).json({
            message: '✅ Engineer added successfully',
            data: newEngineer
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to add engineer',
            error: error.message
        });
    }
};
//get engs for place by id 
export const getEngCommunicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: '❌ No users found' });
        }

        const communication = doc.data.Communication.data;
        const place = communication.find(place => place._id.toString() === id);

        if (!place) {
            return res.status(404).json({ message: '❌ Place not found' });
        }

        res.status(200).json({
            message: '✅ Engineer fetched successfully',
            data: place
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to get engineer',
            error: error.message
        });
    }
};
export const updateEngById = async (req, res) => {
    try {
        const { placeId, engId } = req.params; // place _id and engineer _id from params
        const { name, phone } = req.body;
        const file = req.file;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No users found' });

        const communication = doc.data.Communication.data;
        const place = communication.find(p => p._id.toString() === placeId);
        if (!place) return res.status(404).json({ message: '❌ Place not found' });

        const eng = place.eng.find(e => e._id.toString() === engId);
        if (!eng) return res.status(404).json({ message: '❌ Engineer not found' });

        if (name) eng.name = name;
        if (phone) eng.phone = phone;

        if (file) {
            const publicId = eng.img?.id;
            const { url: imageUrl, public_id } = await replaceImage(publicId, file.buffer);
            eng.img.url = imageUrl;
            eng.img.id = public_id;
        }

        await doc.save();

        res.status(200).json({
            message: '✅ Engineer updated successfully',
            data: eng,
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to update engineer',
            error: error.message,
        });
    }
};

export const deleteEngById = async (req, res) => {
    try {
        const { placeId, engId } = req.params;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No users found' });

        const communication = doc.data.Communication.data;
        const place = communication.find(p => p._id.toString() === placeId);
        if (!place) return res.status(404).json({ message: '❌ Place not found' });

        // Find the engineer to delete
        const engineer = place.eng.find(e => e._id.toString() === engId);
        if (!engineer) return res.status(404).json({ message: '❌ Engineer not found' });

        // Delete image from cloud if exists
        const publicId = engineer.img?.id;
        if (publicId) {
            await deleteImage(publicId);
        }

        // Remove engineer from array
        place.eng = place.eng.filter(e => e._id.toString() !== engId);

        await doc.save();

        res.status(200).json({
            message: '✅ Engineer deleted successfully',
            data: place.eng,
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to delete engineer',
            error: error.message,
        });
    }
};
// get insecticide
export const getInsecticideData = async (req, res) => {
    try {
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No data found' });
        const data = doc.data.Insecticide;
        if (!data) {
            return res.status(404).json({ message: '❌ No data found' });
        }
        res.status(200).json({
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to delete engineer',
            error: error.message,
        });
    }
}
//add data
export const addInsecticideData = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(404).json({ message: '❌ No file found' });
        }
        if (!name) {
            return res.status(404).json({ message: '❌ No name found' });
        }
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ No data found' });
        const data = doc.data.Insecticide.data;
        if (!data) {
            return res.status(404).json({ message: '❌ No data found' });
        }
        const { url: imageUrl, public_id } = await uploadImage(file.buffer);

        const newData = {
            _id: new mongoose.Types.ObjectId(),
            name,
            img: {
                id: public_id,
                url: imageUrl,
            },
            Type: []
        }
        data.push(newData);
        await doc.save();
        res.status(200).json({
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to add data',
            error: error.message,
        });
    }
}
//delete
export const deleteInsecticideData = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: '❌ No id provided' });
        }

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: '❌ No user document found' });
        }

        const insecticideData = doc.data.Insecticide?.data;
        if (!insecticideData) {
            return res.status(404).json({ message: '❌ No Insecticide data found' });
        }

        const categoryToDelete = insecticideData.find(item => item._id.toString() === id);
        if (!categoryToDelete) {
            return res.status(404).json({ message: '❌ Category not found' });
        }

        const imageIdsToDelete = [];

        // Main category image
        if (categoryToDelete.img?.id) {
            imageIdsToDelete.push(categoryToDelete.img.id);
        }

        // All nested Type images
        for (const type of categoryToDelete.Type || []) {
            if (type.img?.id) {
                imageIdsToDelete.push(type.img.id);
            }
        }

        // Delete all images from Cloudinary
        for (const imgId of imageIdsToDelete) {
            await deleteImage(imgId);
        }

        // Remove the category
        doc.data.Insecticide.data = insecticideData.filter(item => item._id.toString() !== id);

        await doc.save();

        res.status(200).json({
            message: '✅ Category and nested images deleted successfully',
            data: doc.data.Insecticide.data,
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to delete category',
            error: error.message,
        });
    }
};

// update
export const updateInsecticideData = async (req, res) => {
    try {
        const { name, id } = req.body;
        const file = req.file;

        if (!id) {
            return res.status(400).json({ message: '❌ No id provided' });
        }

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: '❌ No user document found' });
        }

        const data = doc.data.Insecticide?.data;
        if (!data) {
            return res.status(404).json({ message: '❌ No Insecticide data found' });
        }

        const insecticide = data.find((m) => m._id.toString() === id);
        if (!insecticide) {
            return res.status(404).json({ message: '❌ Category not found' });
        }

        // Update name
        if (name) {
            insecticide.name = name;
        }

        // Replace image if file is provided
        if (file) {
            const oldPublicId = insecticide.img?.id;

            const { url: imageUrl, public_id } = await replaceImage(oldPublicId, file.buffer);

            insecticide.img = {
                url: imageUrl,
                id: public_id,
            };
        }

        await doc.save();

        res.status(200).json({
            message: '✅ Insecticide category updated successfully',
            data: insecticide,
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to update data',
            error: error.message,
        });
    }
};

//insecticide type
export const getInsecticideTypes = async (req, res) => {
    try {
        const { catId } = req.params;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ User not found' });

        const category = doc.data.Insecticide.data.find(cat => cat._id.toString() === catId);
        if (!category) return res.status(404).json({ message: '❌ Category not found' });

        res.status(200).json({ data: category.Type });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to fetch types', error: error.message });
    }
};

export const addInsecticideType = async (req, res) => {
    try {
        const { name, description, id, company } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: '❌ Image file is required' });

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ User not found' });

        const category = doc.data.Insecticide.data.find(cat => cat._id.toString() === id);
        if (!category) return res.status(404).json({ message: '❌ Category not found' });

        const { url: imageUrl, public_id } = await uploadImage(file.buffer);

        const newType = {
            _id: new mongoose.Types.ObjectId(),
            name,
            description,
            img: { url: imageUrl, id: public_id },
            company
        };

        category.Type.push(newType);
        await doc.save();

        res.status(200).json({ message: '✅ Type added', data: category.Type });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to add type', error: error.message });
    }
};

export const updateInsecticideType = async (req, res) => {
    try {
        const { catId, typeId } = req.params;
        const { name, description, company } = req.body;
        const file = req.file;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ User not found' });

        const category = doc.data.Insecticide.data.find(cat => cat._id.toString() === catId);
        if (!category) return res.status(404).json({ message: '❌ Category not found' });

        const type = category.Type.find(t => t._id.toString() === typeId);
        if (!type) return res.status(404).json({ message: '❌ Type not found' });

        if (name) type.name = name;
        if (description) type.description = description;

        if (file) {
            const oldId = type.img?.id;
            const { url, public_id } = await replaceImage(oldId, file.buffer);
            type.img = { url, id: public_id };
        }
        if (company) {
            type.company = company;
        }
        await doc.save();

        res.status(200).json({ message: '✅ Type updated', data: type });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to update type', error: error.message });
    }
};

export const deleteInsecticideType = async (req, res) => {
    try {
        const { catId, typeId } = req.params;

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ User not found' });

        const category = doc.data.Insecticide.data.find(cat => cat._id.toString() === catId);
        if (!category) return res.status(404).json({ message: '❌ Category not found' });

        const type = category.Type.find(t => t._id.toString() === typeId);
        if (!type) return res.status(404).json({ message: '❌ Type not found' });

        const oldId = type.img?.id;
        if (oldId) await deleteImage(oldId);

        category.Type = category.Type.filter(t => t._id.toString() !== typeId);
        await doc.save();

        res.status(200).json({ message: '✅ Type deleted', data: category.Type });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete type', error: error.message });
    }
};

//Fertilizer
export const getFertilizerdata = async (req, res) => {
    try {
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ doc not found' });
        const Fertilizer = doc.data.Fertilizer.data;

        res.status(200).json({ data: Fertilizer });

    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete type', error: error.message });
    }
}

export const addFertilizerdata = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;
        if (!name) return res.status(400).json({ message: '❌ name is required' });
        if (!file) return res.status(400).json({ message: '❌ Image file is required' });
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ doc not found' });
        const Fertilizer = doc.data.Fertilizer.data;
        const { url: imageUrl, public_id } = await uploadImage(file.buffer);
        const newData = {
            _id: new mongoose.Types.ObjectId(),
            name,
            img: {
                url: imageUrl,
                id: public_id,
            }
        }
        Fertilizer.push(newData);
        await doc.save();
        res.status(200).json({ data: Fertilizer });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete type', error: error.message });
    }
}

export const updateFertilizerdata = async (req, res) => {
    try {
        const { name, id } = req.body;
        const file = req.file;

        if (!id) return res.status(400).json({ message: '❌ id is required' });
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ doc not found' });
        const Fertilizer = doc.data.Fertilizer.data;
        const selected = Fertilizer.find((m) => m._id.toString() === id);
        if (name) {
            selected.name = name;
        }
        if (file) {
            const oldId = selected.img.id;
            const { url, public_id } = await replaceImage(oldId, file.buffer);
            selected.img = { url, id: public_id };
        }
        await doc.save();
        res.status(200).json({ data: Fertilizer });
    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete type', error: error.message });
    }
}
export const deleteFertilizerdata = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: '❌ No id provided' });
        }

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: '❌ No user document found' });
        }

        const Fertilizer = doc.data.Fertilizer?.data;
        if (!Fertilizer) {
            return res.status(404).json({ message: '❌ No Fertilizer data found' });
        }

        const categoryToDelete = Fertilizer.find(item => item._id.toString() === id);
        if (!categoryToDelete) {
            return res.status(404).json({ message: '❌ Category not found' });
        }

        const imageIdsToDelete = [];

        // ✅ Main category image
        if (categoryToDelete.img?.id) {
            imageIdsToDelete.push(categoryToDelete.img.id);
        }

        // ✅ Level 1: Type[].img
        for (const type of categoryToDelete.Type || []) {
            if (type.img?.id) {
                imageIdsToDelete.push(type.img.id);
            }

            // ✅ Level 2: Type[].Type[].img
            for (const subType of type.Type || []) {
                if (subType.img?.id) {
                    imageIdsToDelete.push(subType.img.id);
                }
            }
        }

        // ✅ Delete all collected image IDs from Cloudinary
        for (const imgId of imageIdsToDelete) {
            await deleteImage(imgId);
        }

        // ✅ Remove the category from Fertilizer list
        doc.data.Fertilizer.data = Fertilizer.filter(item => item._id.toString() !== id);

        await doc.save();

        res.status(200).json({
            message: '✅ Fertilizer category and nested images deleted successfully',
            data: doc.data.Fertilizer.data,
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to delete Fertilizer category',
            error: error.message,
        });
    }
};

//Fertilizer type1
export const getFertilizerType = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ doc not found' });
        const Fertilizer = doc.data.Fertilizer.data;
        const type = Fertilizer.find((m) => m._id.toString() === id);
        if (!type) {
            return res.status(404).json({ message: '❌ type not found' });
        }
        res.status(200).json({ data: type });
    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to get type',
            error: error.message,
        });
    }
}
export const addFertilizerType = async (req, res) => {
    try {
        const { id, name, haveType, company, description } = req.body;
        const file = req.file;

        if (!id) return res.status(400).json({ message: '❌ id is required' });
        if (!name) return res.status(400).json({ message: '❌ name is required' });
        if (!file) return res.status(400).json({ message: '❌ Image file is required' });

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ User document not found' });

        const Fertilizer = doc.data.Fertilizer.data;
        const category = Fertilizer.find((cat) => cat._id.toString() === id);
        if (!category) return res.status(404).json({ message: '❌ Category not found' });

        const { url: imageUrl, public_id } = await uploadImage(file.buffer);

        const newType = {
            _id: new mongoose.Types.ObjectId(),
            name,
            img: {
                url: imageUrl,
                id: public_id,
            }
        };

        if (!haveType || haveType === 'false' || (!!company && !!description)) {
            // Add as a leaf type (no nested Type array)
            newType.company = company;
            newType.description = description;
        } else {
            // Add as a parent type (can contain sub-types)
            newType.Type = [];
        }
        category.Type.push(newType);

        await doc.save();

        res.status(200).json({ message: '✅ Type added successfully', data: category.Type });

    } catch (error) {
        res.status(500).json({ message: '❌ Failed to add type', error: error.message });
    }
};
export const updateFertilizerType = async (req, res) => {
    try {
        const { categoryId, typeId, name, company, description } = req.body;
        const file = req.file;

        if (!categoryId || !typeId) {
            return res.status(400).json({ message: '❌ categoryId and typeId are required' });
        }

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: '❌ User document not found' });
        }

        const Fertilizer = doc.data.Fertilizer.data;
        const category = Fertilizer.find((cat) => cat._id.toString() === categoryId);
        if (!category) {
            return res.status(404).json({ message: '❌ Category not found' });
        }

        const type = category.Type.find((t) => t._id.toString() === typeId);
        if (!type) {
            return res.status(404).json({ message: '❌ Type not found in this category' });
        }

        // Update fields
        if (name) type.name = name;
        if (company) type.company = company;
        if (description) type.description = description;

        if (file) {
            const oldId = type.img?.id;
            const { url, public_id } = await replaceImage(oldId, file.buffer);
            type.img = { url, id: public_id };
        }

        await doc.save();

        res.status(200).json({ message: '✅ Type updated successfully', data: type });

    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to update type',
            error: error.message,
        });
    }
};
export const deleteFertilizerType = async (req, res) => {
    try {
        const { categoryId, typeId } = req.params;

        if (!categoryId || !typeId) {
            return res.status(400).json({ message: '❌ categoryId and typeId are required' });
        }

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: '❌ User document not found' });
        }

        const fertilizerCategories = doc.data.Fertilizer.data;
        const category = fertilizerCategories.find(cat => cat._id.toString() === categoryId);
        if (!category) {
            return res.status(404).json({ message: '❌ Fertilizer category not found' });
        }

        const typeIndex = category.Type.findIndex(type => type._id.toString() === typeId);
        if (typeIndex === -1) {
            return res.status(404).json({ message: '❌ Fertilizer type not found in this category' });
        }

        const typeToDelete = category.Type[typeIndex];
        const imageIdsToDelete = [];

        // ✅ Main type image
        if (typeToDelete.img?.id) {
            imageIdsToDelete.push(typeToDelete.img.id);
        }

        // ✅ Nested Type[].Type[].img
        for (const nested of typeToDelete.Type || []) {
            if (nested.img?.id) {
                imageIdsToDelete.push(nested.img.id);
            }
        }

        // ✅ Delete all collected images
        for (const imgId of imageIdsToDelete) {
            await deleteImage(imgId);
        }

        // ✅ Remove the type
        category.Type.splice(typeIndex, 1);
        await doc.save();

        res.status(200).json({
            message: '✅ Fertilizer type and nested images deleted successfully',
            data: category.Type
        });

    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to delete fertilizer type',
            error: error.message,
        });
    }
};

//Fertilizer type2
export const getFertilizerNestedType = async (req, res) => {
    try {
        const { categoryId, typeId } = req.params;

        if (!categoryId || !typeId) {
            return res.status(400).json({ message: '❌ categoryId and typeId are required' });
        }

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: '❌ User document not found' });
        }

        const fertilizerCategories = doc.data.Fertilizer.data;
        const category = fertilizerCategories.find(cat => cat._id.toString() === categoryId);
        if (!category) {
            return res.status(404).json({ message: '❌ Fertilizer category not found' });
        }

        const type = category.Type.find(type => type._id.toString() === typeId);
        if (!type) {
            return res.status(404).json({ message: '❌ Fertilizer type not found in this category' });
        }
        const nestedType = type.Type;
        if (!nestedType) {
            return res.status(404).json({ message: '❌ Fertilizer nested type not found in this category' });
        }

        res.status(200).json({ data: nestedType });
    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to get nested type',
            error: error.message,
        });
    }
}
export const addFertilizerNestedType = async (req, res) => {
    try {
        const { categoryId, typeId, name, company, description } = req.body;
        const file = req.file;

        if (!categoryId || !typeId) {
            return res.status(400).json({ message: '❌ categoryId and typeId are required' });
        }
        if (!name || !company || !description) {
            return res.status(400).json({ message: '❌ data are required' });
        }

        const doc = await User.findOne();
        if (!doc) {
            return res.status(404).json({ message: '❌ User document not found' });
        }

        const fertilizerCategories = doc.data.Fertilizer.data;
        const category = fertilizerCategories.find(cat => cat._id.toString() === categoryId);
        if (!category) {
            return res.status(404).json({ message: '❌ Fertilizer category not found' });
        }

        const type = category.Type.find(type => type._id.toString() === typeId);
        if (!type) {
            return res.status(404).json({ message: '❌ Fertilizer type not found in this category' });
        }
        const nestedType = type.Type;
        if (!nestedType) {
            return res.status(404).json({ message: '❌ Fertilizer nested type not found in this category' });
        }
        const { url: imageUrl, public_id } = await uploadImage(file.buffer);

        const newType = {
            name,
            company,
            description,
            img: {
                id: public_id,
                url: imageUrl,
            }
        }
        nestedType.push(newType);

        await doc.save();

        res.status(200).json({ data: nestedType, message: "Fertilizer adding successfully" });
    } catch (error) {
        res.status(500).json({
            message: '❌ Failed to add nested type',
            error: error.message,
        });
    }
}
export const updateFertilizerNestedType = async (req, res) => {
    try {
        const { categoryId, typeId, nestedTypeId, name, company, description } = req.body;
        const file = req.file;

        if (!categoryId || !typeId || !nestedTypeId) {
            return res.status(400).json({ message: '❌ Required IDs are missing' });
        }

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ User document not found' });

        const category = doc.data.Fertilizer.data.find(cat => cat._id.toString() === categoryId);
        if (!category) return res.status(404).json({ message: '❌ Category not found' });

        const type = category.Type.find(t => t._id.toString() === typeId);
        if (!type) return res.status(404).json({ message: '❌ Type not found' });

        const nested = type.Type.find(nt => nt._id.toString() === nestedTypeId);
        if (!nested) return res.status(404).json({ message: '❌ Nested type not found' });

        if (name) nested.name = name;
        if (company) nested.company = company;
        if (description) nested.description = description;

        if (file) {
            const oldId = nested.img?.id;
            const { url, public_id } = await replaceImage(oldId, file.buffer);
            nested.img = { url, id: public_id };
        }

        await doc.save();
        res.status(200).json({ data: type.Type });

    } catch (error) {
        res.status(500).json({ message: '❌ Failed to update nested type', error: error.message });
    }
};

export const deleteFertilizerNestedType = async (req, res) => {
    try {
        const { categoryId, typeId, nestedTypeId } = req.params;

        if (!categoryId || !typeId || !nestedTypeId) {
            return res.status(400).json({ message: '❌ categoryId, typeId, and nestedTypeId are required' });
        }

        const doc = await User.findOne();
        if (!doc) return res.status(404).json({ message: '❌ User document not found' });

        const category = doc.data.Fertilizer.data.find(cat => cat._id.toString() === categoryId);
        if (!category) return res.status(404).json({ message: '❌ Fertilizer category not found' });

        const type = category.Type.find(t => t._id.toString() === typeId);
        if (!type) return res.status(404).json({ message: '❌ Fertilizer type not found' });

        const index = type.Type.findIndex(nested => nested._id.toString() === nestedTypeId);
        if (index === -1) return res.status(404).json({ message: '❌ Nested type not found' });

        const imageId = type.Type[index]?.img?.id;
        if (imageId) await deleteImage(imageId);

        type.Type.splice(index, 1);
        await doc.save();

        res.status(200).json({ message: '✅ Nested type deleted', data: type.Type });

    } catch (error) {
        res.status(500).json({ message: '❌ Failed to delete nested type', error: error.message });
    }
};
