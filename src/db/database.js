import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ MongoDB connected");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;