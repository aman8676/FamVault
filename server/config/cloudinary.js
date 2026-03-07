import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path"
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folderPath) => {
   const absolutePath = path.resolve(localFilePath); 
  try {
    console.log(" Uploading to Cloudinary");
    console.log("Local path:", localFilePath);
    console.log("Absolute path:", absolutePath);
    console.log("Folder:", folderPath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: folderPath,
    });

    console.log(" Cloudinary response:", response.secure_url);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(" Temp file deleted:", absolutePath);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(" Temp file deleted on error:", absolutePath);
    }

    throw error;
  }
};

export const uploadEncryptedDocument = async (
  localFilePath,
  folderPath,
  originalName,
) => {
  const absolutePath = path.resolve(localFilePath); 

  try {
    const response = await cloudinary.uploader.upload(absolutePath, {
      resource_type: "raw",
      folder: folderPath,
      public_id: `${Date.now()}_${originalName}`,
      overwrite: false,
    });

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    return response;
  } catch (error) {
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
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
