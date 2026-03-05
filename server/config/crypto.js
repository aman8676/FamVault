import crypto from "crypto";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// AES-256-CBC requires a 32-byte key and 16-byte IV
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

const getMasterKey = () => {
  const key = process.env.ENCRYPTION_MASTER_KEY;

  if (!key) {
    throw new Error(
      "ENCRYPTION_MASTER_KEY is not set in environment variables"
    );
  }

  // If key is hex string, convert to buffer
  if (key.length === 64) {
    return Buffer.from(key, "hex");
  }

  // If key is 32 characters, use directly
  if (key.length === 32) {
    return Buffer.from(key, "utf-8");
  }

  throw new Error(
    "ENCRYPTION_MASTER_KEY must be 32 characters or 64 hex characters"
  );
};

export const generateIV = () => {
  return crypto.randomBytes(IV_LENGTH);
};


export const encryptBuffer = (buffer, iv) => {
  const key = getMasterKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);

  return encrypted;
};

export const decryptBuffer = (encryptedBuffer, ivHex) => {
  const key = getMasterKey();
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);

  return decrypted;
};

export const encryptFile = async (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const iv = generateIV();
      const key = getMasterKey();

      const readStream = fs.createReadStream(inputPath);
      const writeStream = fs.createWriteStream(outputPath);
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

      readStream
        .pipe(cipher)
        .pipe(writeStream)
        .on("finish", () => {
          resolve({
            iv: iv.toString("hex"),
            encryptedPath: outputPath,
          });
        })
        .on("error", reject);

      readStream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

export const decryptFile = async (encryptedFilePath, ivHex) => {
  return new Promise((resolve, reject) => {
    try {
      const key = getMasterKey();
      const iv = Buffer.from(ivHex, "hex");

      const chunks = [];
      const readStream = fs.createReadStream(encryptedFilePath);
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

      readStream
        .pipe(decipher)
        .on("data", (chunk) => chunks.push(chunk))
        .on("end", () => resolve(Buffer.concat(chunks)))
        .on("error", reject);

      readStream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};


export const decryptFromBuffer = (encryptedBuffer, ivHex) => {
  return decryptBuffer(encryptedBuffer, ivHex);
};

export const generateMasterKey = () => {
  return crypto.randomBytes(KEY_LENGTH).toString("hex");
};

export default {
  encryptBuffer,
  decryptBuffer,
  encryptFile,
  decryptFile,
  decryptFromBuffer,
  generateIV,
  generateMasterKey,
};
