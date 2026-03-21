import mongoose from "mongoose";
import userModel from "../Models/userModel.js";
import pendingUserModel from "../Models/pendingUserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../config/nodemailer.js";
import dotenv from "dotenv";
import uploadOnCloudinary from "../config/cloudinary.js";
import { sendWelcomeMail } from "../services/sendWelcomeEmail.js";
import { sendVerifyOtpMail } from "../services/sendVerifyOtpMail.js";
import { ResetOtpMail } from "../services/ResetOtpMail.js";
dotenv.config();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getMe = async (req, res) => {
  try {
    if (req.pendingUser) {
      return res.status(403).json({ 
        success: false, 
        message: "Please verify your email first",
        isPendingUser: true
      });
    }

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const existingPendingUser = await pendingUserModel.findOne({ email }).select("+password");
    if (existingPendingUser) {
      const otp = String(Math.floor(100000+Math.random()*900000));
      existingPendingUser.verifyOtp = otp;
      existingPendingUser.verifyOtpExpiresAt = Date.now()+24*60*60*1000;
      await existingPendingUser.save();

      sendVerifyOtpMail(email, otp).catch((err) =>
        console.error("Email error:", err.message),
      );

      const regToken = jwt.sign({ id: existingPendingUser._id, type: "pending" }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      return res.status(201).json({
        success: true,
        message: "OTP resent to your email. Please verify your account.",
        regToken,
      });
    }

    const userId = new mongoose.Types.ObjectId();

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
      return res.status(400).json({
        success: false,
        message: "Avatar is required",
      });
    }

    const folderPath = `fam_vault/users/user-${userId}/avatar`;

    const uploadedAvatar = await uploadOnCloudinary(
      avatarLocalPath,
      folderPath,
    );

    const avatarUrl = uploadedAvatar?.secure_url || uploadedAvatar?.url;

    if (!avatarUrl) {
      throw new Error("Avatar upload failed");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const pendingUser = await pendingUserModel.create({
      _id: userId,
      name,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    const otp = String(Math.floor(100000+Math.random()*900000));
    pendingUser.verifyOtp = otp;
    pendingUser.verifyOtpExpiresAt = Date.now()+24*60*60*1000;

    await pendingUser.save();

    sendVerifyOtpMail(email, otp).catch((err) =>
      console.error("Email error:", err.message),
    );

    const regToken = jwt.sign({ id: pendingUser._id, type: "pending" }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
      regToken,
    });
  } 
  
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendVerifyOtp = async (req, res) => {
  const pendingUser = req.pendingUser;

  if (!pendingUser) {
    return res.status(401).json({ success: false, message: "Invalid registration session" });
  }

  try {
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    pendingUser.verifyOtp = otp;
    pendingUser.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    await pendingUser.save();

    sendVerifyOtpMail(pendingUser.email, otp).catch((err) =>
      console.error("Email error:", err.message),
    );

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyAccount = async (req, res) => {
  const { otp } = req.body;
  const pendingUser = req.pendingUser;

  if (!otp) {
    return res.status(400).json({ success: false, message: "OTP is required" });
  }

  if (!pendingUser) {
    return res.status(401).json({ success: false, message: "Invalid registration session" });
  }

  try {
    if (!pendingUser.verifyOtp) {
      return res.status(400).json({ success: false, message: "No OTP found. Please request a new one." });
    }

    const isValidOtp = crypto.timingSafeEqual(
      Buffer.from(pendingUser.verifyOtp),
      Buffer.from(otp)
    );

    if (!isValidOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (pendingUser.verifyOtpExpiresAt < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    const existingUser = await userModel.findOne({ email: pendingUser.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "This email is already registered. Please login instead." 
      });
    }

    const user = await userModel.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      avatar: pendingUser.avatar,
      isAccountVerified: true,
    });

    await pendingUserModel.findByIdAndDelete(pendingUser._id);

    sendWelcomeMail(user.email).catch((err) =>
      console.error("Welcome email error:", err.message),
    );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ 
      success: true, 
      message: "Email verified successfully", 
      token,
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req,res)=>{
  const {email,password} = req.body;

  if(!email||!password) return res.status(400).json({
    success:false,
    message:"please enter all the details "
  })

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  try {
        const user = await userModel.findOne({email}).select("+password");

        if(!user) {
          return res.status(401).json({success:false,message:"Invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
          return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn : '7d'});

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        return res.status(200).json({ 
          success: true, 
          message: "Login Successful",
          user: { 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            avatar: user.avatar 
          }
        });
  } catch(error){
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const logout = async(req,res)=>{

  try{
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    };
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logout Successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (user) {
      const otp = String(Math.floor(100000 + Math.random() * 900000));

      user.resetOtp = otp;
      user.resetOtpExpiresAt = Date.now() + 10 * 60 * 1000;
      await user.save();

      ResetOtpMail(email, otp).catch((err) =>
        console.error("Email error:", err.message),
      );
    }

    res.status(200).json({
      success: true,
      message: "If an account exists with this email, an OTP has been sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "Email, OTP, and new password are required" });
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user || !user.resetOtp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const isValidOtp = crypto.timingSafeEqual(
      Buffer.from(user.resetOtp || ''),
      Buffer.from(otp)
    );

    if (!isValidOtp) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    if (user.resetOtpExpiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpiresAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

