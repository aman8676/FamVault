import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folderPath) => {
  try {
    console.log(" Uploading to Cloudinary");
    console.log("Local path:", localFilePath);
    console.log("Folder:", folderPath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: folderPath,
    });

    console.log(" Cloudinary response:", response.secure_url);

    fs.unlinkSync(localFilePath); // cleanup
    return response;
  } catch (error) {
    console.error(" Cloudinary upload error:", error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw error; //  DO NOT REMOVE THIS
  }
};

export const uploadEncryptedDocument = async (
  localFilePath,
  folderPath,
  originalName,
) => {
  try {
    console.log("Uploading encrypted document to Cloudinary");
    console.log("Local path:", localFilePath);
    console.log("Folder:", folderPath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "raw", // ← key difference from image upload
      folder: folderPath,
      public_id: `${Date.now()}_${originalName}`,
      overwrite: false,
    });

    console.log("Encrypted document uploaded:", response.secure_url);

    // delete encrypted temp file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    console.error("Encrypted document upload error:", error);

    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    throw error;
  }
};


export const deleteFromCloudinary = async (cloudinaryPublicId) => {
  try {
    console.log("Deleting from cloudianry", cloudinaryPublicId);

    const response = await cloudinary.uploader.destroy(cloudinaryPublicId, {
      resource_type: "raw",
    });
    console.log("Cloudinary delete response:", response);
    return response;
  } catch (error) {
    console.error("Cloudinary delete error", error);
    throw error;
  }
};


export default uploadOnCloudinary;
