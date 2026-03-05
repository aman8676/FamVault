import jwt from "jsonwebtoken";
import userModel from "../Models/userModel.js"; 

export const verifyJWT = async (req, res, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log(" Decoded Token:", decodedToken); 
    console.log(" Looking for user ID:", decodedToken.id); 

    // Find user and attach to request
    const user = await userModel.findById(decodedToken.id).select("-password");

     console.log(" User found:", user ? "YES" : "NO"); 

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid token",
    });
  }
};
