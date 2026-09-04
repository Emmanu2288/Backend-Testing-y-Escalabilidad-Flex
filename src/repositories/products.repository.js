import Product from "../models/product.model.js";

export const productsRepository = {
    create: async (productData) => {
        const product = new Product(productData);
        return await product.save();
    },
    findAll: async (page = 1, limit = 10) => {
        const products = await Product.find().skip((page - 1) * limit).limit(limit);
        const total = await Product.countDocuments();
        return { products, total, page, totalPages: Math.ceil(total / limit) };
    },
    findById: async (id) => {
        return await Product.findById(id);
    },
    update: async (id, productData) => {
        return await Product.findByIdAndUpdate(id, productData, { new: true });
    },
    delete: async (id) => {
        return await Product.findByIdAndDelete(id);
    }
}