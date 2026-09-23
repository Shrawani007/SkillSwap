import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const resourceSchema = new mongoose.Schema({
  owner: { type: Types.ObjectId, ref: "User", required: true },

  // ✅ FIX: Add default empty array
  sharedWith: [{
    type: Types.ObjectId,
    ref: "User",
    default: []
  }],

  skill: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  folder: { type: String, default: "My Resources" },

  imagePath: { type: String },
  generalLink: { type: String },
  videoLink: { type: String },
  files: [
    {
      fileUrl: String,
      fileType: String
    }
  ],
  audioLink: { type: String },
  pdfPath: { type: String },
  pdfType: { type: String },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Resource", resourceSchema);