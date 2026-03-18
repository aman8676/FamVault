import express from 'express';

import { upload } from '../middlewares/multer.middleware.js';

import { login, logout, register, sendResetOtp, verifyAccount, sendVerifyOtp,resetPassword, getMe } from '../controller/authController.js';

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
authRouter.post("/send-verify-otp", verifyJWT, sendVerifyOtp); // ✅ added this route

authRouter.post("/reset-password", resetPassword);

authRouter.get("/me", verifyJWT, getMe);




export default authRouter