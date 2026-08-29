import mongoose from "mongoose";
import { USER_ROLES } from "../constants/index.js";

const documentSchema = new mongoose.Schema({
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
}, { _id: false })

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        enum: Object.values(USER_ROLES),
        default: USER_ROLES.CUSTOMER,
    },
    documents: {
        type: [documentSchema],
        default: []
    }
});

const User = mongoose.model("User", userSchema)

export default User
