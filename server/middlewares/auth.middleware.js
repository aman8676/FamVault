import jwt from "jsonwebtoken";
import userModel from "../Models/userModel.js"; 
import pendingUserModel from "../Models/pendingUserModel.js"; 

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.type === "pending") {
      const pendingUser = await pendingUserModel.findById(decodedToken.id).select("+password");

      if (!pendingUser) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired registration token",
        });
      }

      req.pendingUser = pendingUser;
      req.user = null;
      next();
      return;
    }

    const user = await userModel.findById(decodedToken.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    req.user = user;
    req.pendingUser = null;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid token",
    });
  }
};
