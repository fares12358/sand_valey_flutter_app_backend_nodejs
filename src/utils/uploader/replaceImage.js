// src/utils/replaceImage.js
import uploadImage from "./uploadImage.js";
import deleteImage from "./deleteImage.js";

const replaceImage = async (oldPublicId, newImagePath) => {
  try {
    await deleteImage(oldPublicId);
    const newUpload = await uploadImage(newImagePath);
    return newUpload;
  } catch (err) {
    throw new Error("Image replacement failed: " + err.message);
  }
};

export default replaceImage;
