import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  uploadDocument,
  getMyDocuments,
  viewOrDownloadDocument,
  deleteDocument,
  getFamilyDocuments,
} from "../controller/docController.js";
const docRouter = express.Router();
// Personal vault upload
docRouter.post(
  "/upload",
  verifyJWT,
  upload.fields([{ name: "document", maxCount: 1 }]),
  uploadDocument,
);
// Family vault upload
docRouter.post(
  "/upload/:familyId",
  verifyJWT,
  upload.fields([{ name: "document", maxCount: 1 }]),
  uploadDocument,
);

docRouter.get("/my-documents", verifyJWT, getMyDocuments);

docRouter.get("/family-documents/:familyId", verifyJWT, getFamilyDocuments);

docRouter.get("/:documentId", verifyJWT, viewOrDownloadDocument);

docRouter.delete("/:documentId", verifyJWT, deleteDocument);

export default docRouter;
