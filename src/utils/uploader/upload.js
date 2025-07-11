import cloudinary from "../../config/cloudinary/cloudinary.js";
import streamifier from "streamifier";

const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "uploads",
        format: "webp",
        transformation: [
          { width: 500, height: 500, crop: "limit" },
          { quality: "auto:low" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default uploadImage;
