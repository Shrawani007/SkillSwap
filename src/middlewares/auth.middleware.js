import { ApiError } from "../utils/apiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

function verifyJWT(req, res, next) {
  try {
    let token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
    
    // Ensure explicit JSON error for missing token
    if (!token) {
        return res.status(401).json({ 
            message: "Unauthorized: Access token missing. Please log in.",
            success: false 
        });
    }

    // Verify token
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (!payload || (!payload._id && !payload.id && !payload.userId)) {
      // Ensure explicit JSON error for invalid token
      return res.status(403).json({ 
          message: "Invalid token: User ID not found in payload.",
          success: false 
      });
    }
    
    // Attach the user ID to req.user
    const userId = payload._id || payload.id || payload.userId;
    req.user = { _id: userId }; 
    next();
  } catch (err) {
    console.error("verifyJWT unexpected error:", err.message);
    // Ensure explicit JSON error for verification failure
    return res.status(403).json({ 
        message: `Invalid token: ${err.message}`,
        success: false 
    });
  }
}

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
  if (!token) throw new ApiError(401, "Not authorized");

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // This version attaches the full user document.
  req.user = await User.findById(decoded._id).select("_id");
  next();
});

export { verifyJWT, protect };