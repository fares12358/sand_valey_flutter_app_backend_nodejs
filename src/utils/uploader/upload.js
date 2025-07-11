// src/utils/uploadImage.js
import cloudinary from "../../config/cloudinary/cloudinary.js";

const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
      format: "webp", // Convert to webp
      transformation: [
        { width: 500, height: 500, crop: "limit" }, // Resize max 500x500
        { quality: "auto:low" }, // Compress image size
      ],
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    throw new Error("Cloudinary upload failed: " + err.message);
  }
};

export default uploadImage;
