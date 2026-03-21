import express from 'express';

import { upload } from '../middlewares/multer.middleware.js';

import { login, logout, register, sendResetOtp, verifyAccount, sendVerifyOtp,resetPassword, getMe } from '../controller/authController.js';
import pendingUserModel from '../Models/pendingUserModel.js';

import {verifyJWT} from "../middlewares/auth.middleware.js"

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }
  ]),
  register,
);

authRouter.post("/login",login)
authRouter.post("/logout", logout);
authRouter.post("/send-reset-otp", sendResetOtp);

authRouter.post("/verify-account", verifyJWT, verifyAccount); 
authRouter.post("/send-verify-otp", verifyJWT, sendVerifyOtp);

authRouter.post("/reset-password", resetPassword);

authRouter.get("/me", verifyJWT, getMe);

authRouter.delete("/cleanup-pending", async (req, res) => {
  const secret = req.header("X-Cleanup-Secret") || req.query.secret;
  if (secret !== process.env.CLEANUP_SECRET) {
    return res.status(403).json({ success: false, message: "Invalid secret" });
  }
  try {
    const result = await pendingUserModel.deleteMany({
      verifyOtpExpiresAt: { $lt: Date.now() }
    });
    return res.status(200).json({ 
      success: true, 
      message: `Cleaned up ${result.deletedCount} expired pending users` 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default authRouter