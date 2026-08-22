import mongoose from "mongoose";
import { PRODUCT_STATUS } from "../constants/index.js";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(PRODUCT_STATUS),
        default: PRODUCT_STATUS.AVAILABLE
    },
    stock: {
        type: Number,
        default: 0
    }
})

const Product = mongoose.model("Product", productSchema);

export default Product;