import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema= new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    gender: {
        type: String,   
        enum: ["Male","Female"],
        required: true,
    },
    // profile fields
    offering: {
        type: [{ type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill' }],
        require: true,
        default: []
    },
    interested: {
        type: [{ type: mongoose.Schema.Types.ObjectId, 
            ref: 'Skill' }],
        require: true,
        default: []
    },
    bio: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        require: true,
        default: ""
    },
    socialLinks: {
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        github: { type: String, default: "" }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    myLearning: [
        {
            skill: { type: mongoose.Schema. Types.ObjectId,
                ref: 'Skill' ,
                required: true },
            status: { type: String, enum: ["ongoing", "completed"], default: "ongoing" },
            progress: { type: Number, min: 0, max: 100, default: 0 }
        }
    ]
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next(); 
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);