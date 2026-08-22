import Product from "../models/product.model.js";

export const productsRepository = {
    create: async (productData) => {
        const product = new Product(productData);
        return await product.save();
    },
    findAll: async () => {
        return await Product.find();
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