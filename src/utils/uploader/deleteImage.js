// src/utils/deleteImage.js
import cloudinary from "../../config/cloudinary/cloudinary.js";

const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (err) {
    throw new Error("Cloudinary deletion failed: " + err.message);
  }
};

export default deleteImage;
