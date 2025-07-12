// src/utils/replaceImage.js

import deleteImage from "./deleteImage.js";
import uploadImage from "./upload.js";

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
