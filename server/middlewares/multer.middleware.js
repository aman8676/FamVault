import multer from "multer";
import fs from "fs";

// Creates the folder if it doesn't exist (fixes Render deployment issue)
fs.mkdirSync("./public/temp", { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
});
