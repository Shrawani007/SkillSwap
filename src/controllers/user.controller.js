import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/apiError.utils.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import User from "../models/user.models.js";


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        console.log("Generating tokens for user:", userId);
        const accessToken = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
        const refreshToken = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        });
        console.log("Tokens generated successfully");
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw error;
    }
}

export const register = async (req, res) => {
    try {
        const { fullname, email, phone, birthdate,gender, username,password, confirmPassword} = req.body;
        if (!fullname || !email || !phone || !birthdate ||!gender || !username || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        // let the mongoose pre-save hook handle password hashing
        const newUser = new User({
            fullname,
            email,
            phone,
            birthdate,
            gender,
            username,
            password: password
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully!",userId: newUser._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

//login
 export const loginUserHandler = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email is required");
    }

    if (!password) {
        throw new ApiError(400, "password is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    let isPasswordValid = false;
    try {
        isPasswordValid = await user.isPasswordCorrect(password);
    } catch (err) {
        console.error('Error comparing password for user', user._id, err);
        throw new ApiError(500, 'Error validating credentials');
    }

    if (!isPasswordValid) {
        console.warn(`Failed login attempt for user=${user._id} username=${user.username} email=${user.email}`);
        throw new ApiError(401, "Invalid user credentials");
    }

    try {
        console.log("User authenticated successfully:", user._id);
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully"));
    } catch (error) {
        console.error("Error during login:", error);
        throw new ApiError(500, "Error generating tokens");
    }
});

 export const loginUser = async (loginData) => {
    const user = await User.findOne({ email: loginData.email });
    if (!user || !user.comparePassword(loginData.password)) {
        throw new Error('Invalid credentials');
    }
    return user;
};

//logout
 export const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(400, "User not authenticated");
    }

    await User.findByIdAndUpdate(
        req.user._id, {
            $unset: {
                refreshToken: 1
            }
        }, {
            new: true,
            writeConcern: {
                w: "majority",

        }
    }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out Successfully")); 
});

// profile - fetch details for the logged-in user
export const getUserProfile = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(400, "User not authenticated");
    }

    const user = await User.findById(req.user._id)
        .select("-password")
        .populate({
            path: 'offering',
            select: 'name' // Only return the skill name from the Skill document
        })
        .populate({
            path: 'interested',
            select: 'name' // Only return the skill name from the Skill document
        })
        .lean(); // 🔑 CRITICAL FIX: Add .lean() to convert Mongoose document to plain object

if (!user) {
throw new ApiError(404, "User not found");
}

return res.status(200).json(new ApiResponse(200, { user }, "User profile fetched successfully"));
});

// public: get user by id (for viewing other user's profile)
export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, 'id required');
    const user = await User.findById(id).select('-password -refreshToken');
    if (!user) throw new ApiError(404, 'User not found');
    return res.status(200).json(new ApiResponse(200, { user }, 'User fetched'));
});

// update profile for logged-in user
export const updateUserProfile = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) throw new ApiError(400, 'User not authenticated');

     const { offering, interested, bio, location, socialLinks } = req.body;

     const update = {};
        
     // Validate if they are arrays before setting
     if (offering && Array.isArray(offering)) { 
         // offering is an array of Skill IDs
         update.offering = offering; 
     } else if (typeof offering !== 'undefined' && !Array.isArray(offering)) {
          throw new ApiError(400, 'offering must be an array of Skill IDs');
     }

     if (interested && Array.isArray(interested)) {
         // interested is an array of Skill IDs
         update.interested = interested; 
     } else if (typeof interested !== 'undefined' && !Array.isArray(interested)) {
          throw new ApiError(400, 'interested must be an array of Skill IDs');
     }

     if (typeof bio !== 'undefined') update.bio = bio;
     if (typeof location !== 'undefined') update.location = location;

     // --- Social Links Logic (Kept mostly as is) ---
     if (socialLinks) {
     // validate social links before merging
     const invalid = [];
     const validateUrl = (u) => {
     if (!u) return true; // allow empty
     try {
     const parsed = new URL(u);
     return parsed.protocol === 'http:' || parsed.protocol === 'https:';
     } catch (e) {
         return false;
     }
     };
     if (typeof socialLinks === 'object') {
     for (const key of ['twitter', 'linkedin', 'github']) {
     if (key in socialLinks) {
     const val = socialLinks[key];
     if (val && !validateUrl(val)) invalid.push(key);
     }
     }
     } else {
     // not an object - invalid
     throw new ApiError(400, 'socialLinks must be an object with twitter/linkedin/github');
     }

     if (invalid.length) {
     throw new ApiError(400, `Invalid URL for social links: ${invalid.join(', ')}`);
     }
            
     // This line might need refinement if req.user is only { _id: ... }
     // For now, keeping your original merge logic:
     update.socialLinks = { ...req.user.socialLinks, ...socialLinks }; 
     }
     // --- End Social Links Logic ---

     // 🔑 FIX: Add .lean() here too for consistency
     const updated = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true })
         .select('-password -refreshToken')
         .populate({ path: 'offering', select: 'name' })
         .populate({ path: 'interested', select: 'name' })
         .lean(); 

     return res.status(200).json(new ApiResponse(200, { user: updated }, 'Profile updated successfully'));
});