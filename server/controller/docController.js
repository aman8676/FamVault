import fs from "fs";
import crypto from "crypto";
import path from "path";
import axios from "axios";
import { encryptFile, decryptBuffer } from "../config/crypto.js";
import {
  uploadEncryptedDocument,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import familyModel from "../Models/FamilyModel.js";
import docModel from "../Models/docModel.js";
import { v2 as cloudinary } from "cloudinary";

export const uploadDocument = async (req, res) => {
  let originalFilePath = null;
  let encryptedFilePath = null;

  try {
    const userId = req.user._id;
    const familyId = req.params.familyId || null;
    const isPersonalVault = !familyId;

    const { title, description, category, visibility, tags } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const file = req.files?.document?.[0];

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required",
      });
    }

    originalFilePath = file.path;

    if (familyId) {
      const family = await familyModel.findById(familyId);

      if (!family) {
        return res.status(404).json({
          success: false,
          message: "family not found",
        });
      }

      const isAdmin = family.admin.toString() === userId.toString();

      const isMember = family.members.some(
        (m) => m.user.toString() === userId.toString(),
      );

      if (!isAdmin && !isMember) {
        // cleanUp temp file here

        if (fs.existsSync(originalFilePath)) {
          fs.unlinkSync(originalFilePath);
        }

        return res.status(403).json({
          success: false,
          message: "You don't have permission to upload to this family",
        });
      }
    }

    // step1 : Generate encrypted output path:

    const encryptedFileName = `encrypted_${Date.now()}_${file.originalname}`;
    encryptedFilePath = path.join(
      path.dirname(originalFilePath),
      encryptedFileName,
    );

    console.log("Starting AES-256 encryption...");
    console.log("Original file:", originalFilePath);
    console.log("Encrypted output:", encryptedFilePath);

    //step2 : encrypt the file now

    const { iv, encryptedPath } = await encryptFile(
      originalFilePath,
      encryptedFilePath,
    );

    console.log("encryption done .IV", iv);

    // now delete immediately original file  no need to keep unencrypted file longer then needed

    if (fs.existsSync(originalFilePath)) {
      fs.unlinkSync(originalFilePath);
      originalFilePath = null;
    }

    // upload encrypted file to cloudinary

    const folderPath = isPersonalVault
      ? `fam_vault/users/user-${userId}/documents`
      : `fam_vault/families/family-${familyId}/documents`;

    console.log("Uploadin gto cloudinary folder : ", folderPath);

    const cloudinaryResponse = await uploadEncryptedDocument(
      encryptedPath,
      folderPath,
      file.originalname,
    );

    encryptedFilePath = null; // it means already deleted inside the cloudinary configuration

    console.log("Uploaded to cloudinary:", cloudinaryResponse.secure_url);

    let parsedTags = [];
    if (tags) {
      parsedTags =
        typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;
    }

    const document = await docModel.create({
      title,
      description: description || "",
      // cloud information
      fileUrl: cloudinaryResponse.secure_url,
      encryptionIV: iv,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      cloudinaryPublicId: cloudinaryResponse.public_id,

      // encryption info

      isEncrypted: true,

      // ownership
      uploadedBy: userId,

      // vault info
      family: familyId,
      isPersonalVault: isPersonalVault,

      // sharing

      sharedFrom: null,
      sharedWith: [],

      // settings

      visibility: isPersonalVault ? "private" : visibility || "family",
      category: category || "other",
      tags: parsedTags,
    });

    // return response

    const documentData = await docModel
      .findById(document._id)
      .populate("uploadedBy", "name email avatar")
      .populate("family", "name");

    res.status(201).json({
      success: true,
      message: isPersonalVault
        ? "Document uploaded to personal vault successfully"
        : "Document uploaded to family vault successfully",
      document: documentData,
    });
  } catch (error) {
    console.error("Upload error:", error);

    // cleanup on error
    if (originalFilePath && fs.existsSync(originalFilePath)) {
      fs.unlinkSync(originalFilePath);
    }
    if (encryptedFilePath && fs.existsSync(encryptedFilePath)) {
      fs.unlinkSync(encryptedFilePath);
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload document",
    });
  }
};

export const getMyDocuments = async (req, res) => {
  try {
    const userId = req.user._id;
    const documents = await docModel
      .find({
        uploadedBy: userId,
        isPersonalVault: true,
        deletedByUploader: false,
      })
      .populate("uploadedBy", "name email avatar")
      .sort({ createdAt: -1 }); //newest first

    res.status(200).json({
      success: true,
      documents,
      count: documents.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFamilyDocuments = async (req, res) => {
  try {
    const userId = req.user._id;
    const { familyId } = req.params;

    if (!familyId) {
      return res.status(400).json({
        success: false,
        message: "Family ID is required",
      });
    }

    // Check if user is admin or member of this family
    const family = await familyModel.findById(familyId);

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    const isAdmin = family.admin.toString() === userId.toString();
    const isMember = family.members.some(
      (m) => m.user.toString() === userId.toString(),
    );

    if (!isAdmin && !isMember) {
      return res.status(403).json({
        success: false,
        message: "You don't have access to this family",
      });
    }

    const documents = await docModel
      .find({
        family: familyId,
        isPersonalVault: false,
        deletedByUploader: { $ne: true },
      })
      .populate("uploadedBy", "name email avatar")
      .populate("family", "name")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      documents,
      count: documents.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const viewOrDownloadDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { action } = req.query;
    const userId = req.user._id;

    const document = await docModel
      .findById(documentId)
      .select("+encryptionIV +cloudinaryPublicId");

    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    const isOwner = document.uploadedBy.toString() === userId.toString();
    let isFamilyMember = false;

    // Only check family membership if not the owner
    if (!isOwner && document.family) {
      const family = await familyModel
        .findById(document.family)
        .select("admin members");

      if (family) {
        const isAdmin = family.admin.toString() === userId.toString();
        const isMember = family.members.some(
          (m) => (m.user || m).toString() === userId.toString(),
        );
        isFamilyMember = isAdmin || isMember;
      }
    }

    if (!isOwner && !isFamilyMember) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Fetch encrypted file from Cloudinary
    let response;
    try {
      response = await axios.get(document.fileUrl, {
        responseType: "arraybuffer",
      });
    } catch (fetchError) {
      console.error("Failed to fetch from Cloudinary:", fetchError.message);
      return res
        .status(502)
        .json({ success: false, message: "Failed to fetch file from storage" });
    }

    // Decrypt
    let decryptedBuffer;
    try {
      const encryptedBuffer = Buffer.from(response.data);
      decryptedBuffer = decryptBuffer(encryptedBuffer, document.encryptionIV);
    } catch (decryptError) {
      console.error("Decryption failed:", decryptError.message);
      return res
        .status(500)
        .json({ success: false, message: "Failed to decrypt document" });
    }

    const disposition = action === "download" ? "attachment" : "inline";
    res.setHeader("Content-Type", document.fileType);
    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename="${document.fileName}"`,
    );
    res.setHeader("Content-Length", decryptedBuffer.length);
    return res.send(decryptedBuffer);
  } catch (error) {
    console.error("View/Download error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch document",
    });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user._id;

    const document = await docModel
      .findById(documentId)
      .select("+cloudinaryPublicId");
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Docuemnt not found",
      });
    }

    const isOwner = document.uploadedBy.toString() === userId.toString();

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await deleteFromCloudinary(document.cloudinaryPublicId);

    await docModel.findByIdAndDelete(documentId);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete error", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete document",
    });
  }
};
