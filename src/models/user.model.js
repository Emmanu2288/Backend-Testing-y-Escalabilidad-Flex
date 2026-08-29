import mongoose from "mongoose";
import { USER_ROLES } from "../constants/index.js";

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
});

const User = mongoose.model("User", userSchema)

export default User