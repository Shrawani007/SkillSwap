// controllers/skill.controller.js
import {asyncHandler} from "../utils/asyncHandler.utils.js";
import Skill from "../models/skill.models.js";
import { ApiResponse } from "../utils/apiResponse.utils.js";

const getAllSkills = asyncHandler(async (req, res) => {
    // 💡 FIX: Ensure ApiResponse uses the correct structure (status code first, then data)
    const skills = await Skill.find().lean();
    res.status(200).json(new ApiResponse(200, skills, "Skills retrieved successfully"));
});

// 🔑 NEW: Utility to convert skillName to Skill ID
const findOrCreateSkill = async (skillName) => {
    const normalizedName = skillName.toLowerCase().trim();
    let skill = await Skill.findOne({ name: normalizedName });

    if (!skill) {
        // In a production app, you might prevent new skill creation here, 
        // but for now, we'll allow it if the user types one in.
        skill = await Skill.create({ 
            name: normalizedName,
        });
    }
    return skill; // Returns the full skill object including _id
};

export { getAllSkills, findOrCreateSkill };