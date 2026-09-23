import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const SkillSchema = new Schema({
name: { 
        type: String, 
        required: true, 
        trim: true,
        unique: true,      // Ensures no duplicate skill names
        lowercase: true,   // Ensures consistent storage for all skills
    },
description: { type: String, trim: true },
},
{ timestamps: true }
);

export default mongoose.model("Skill", SkillSchema);