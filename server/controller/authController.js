import mongoose from "mongoose";
import userModel from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import dotenv from "dotenv";
import uploadOnCloudinary from "../config/cloudinary.js";
import { sendWelcomeMail } from "../services/sendWelcomeEmail.js";
import { sendVerifyOtpMail } from "../services/sendVerifyOtpMail.js";
import { ResetOtpMail } from "../services/ResetOtpMail.js";
dotenv.config();

export const getMe = async (req, res) => {
  try {
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

  console.log(req.body);
  

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }


  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const userId = new mongoose.Types.ObjectId();

    console.log(userId)

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
      return res.status(400).json({
        success: false,
        message: "Avatar is required",
      });
    }

    console.log(avatarLocalPath);

    const folderPath = `fam_vault/users/user-${userId}/avatar`;

    const uploadedAvatar = await uploadOnCloudinary(
      avatarLocalPath,
      folderPath,
    );

    const avatarUrl = uploadedAvatar?.secure_url || uploadedAvatar?.url;

    console.log(avatarUrl)

    if (!avatarUrl) {
      throw new Error("Avatar upload failed");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      _id: userId,
      name,
      email,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    const otp = String(Math.floor(100000+Math.random()*900000));
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now()+24*60*60*1000;

    await user.save();

    // sending veify otp mail
    sendVerifyOtpMail(email, otp).catch((err) =>
      console.error("Email error:", err.message),
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

    
   

    return res.status(201).json({
      success: true,
      token,
      user,
    });
  } 
  
  catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const verifyAccount = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user._id; // ← from req.user, not req.body

  if (!otp) {
    return res.status(400).json({ success: false, message: "OTP is required" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isAccountVerified)
      return res.status(400).json({ success: false, message: "Already verified" });
    if (user.verifyOtp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (user.verifyOtpExpiresAt < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiresAt = 0;
    await user.save();

    // welcome email (optional)

    sendWelcomeMail(user.email).catch((err) =>
      console.error("Welcome email error:", err.message),
    );

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req,res)=>{
  const {email,password} = req.body;

  console.log(req.body);

  if(!email||!password) return res.status(400).json({
    success:false,
    message:"please enter all the details "
  })

  try {
        const user = await userModel.findOne({email}).select("+password");

        console.log(user)

        if(!user) {
          return res.status(401).json({success:false,message:"Invalid email"})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
          return res.status(401).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn : '7d'});

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        
         return res.status(200).json({ success: true, message: "Login Successful" });
  }
  catch(error){
    console.error(error);
    console.error(error.message);
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

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });

    // ✅ SEND EMAIL IN BACKGROUND
    ResetOtpMail(email, otp).catch((err) =>
      console.error("Email error:", err.message),
    );
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

  try {
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.resetOtp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (user.resetOtpExpiresAt < Date.now())
      return res.status(400).json({ success: false, message: "OTP expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpiresAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


