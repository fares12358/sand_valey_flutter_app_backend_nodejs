// src/utils/replaceImage.js
import uploadImage from "./uploadImage.js";
import deleteImage from "./deleteImage.js";

const replaceImage = async (oldPublicId, newBuffer) => {
  try {
    await deleteImage(oldPublicId);
    const newUpload = await uploadImage(newBuffer);
    return newUpload;
  } catch (err) {
    throw new Error("Image replacement failed: " + err.message);
  }
};

export default replaceImage;
