import {productsRepository} from "../repositories/products.repository.js";
import { AppError } from '../errors/AppError.js'

export const productService = {
    createProduct: async (productData) => {
        if (productData.precio <= 0) {
            throw new AppError('VALIDATION_ERROR', 'El precio debe ser mayor a cero');
        }
        return await productsRepository.create(productData);
    },
    
    updateProduct: async (id, productData) => {
        const product = await productsRepository.findById(id);
        if (!product) {
            throw new AppError('PRODUCT_NOT_FOUND');
        }
        return await productsRepository.update(id, productData);
    },

    deleteProduct: async (id) => {
        const product = await productsRepository.findById(id);
        if (!product) {
            throw new AppError('PRODUCT_NOT_FOUND');
        }
        return await productsRepository.delete(id);
    },

    findAllProducts: async () => {
  return await productsRepository.findAll()
},

    findProductById: async (id) => {
        const product = await productsRepository.findById(id)
                if (!product) {
                 throw new AppError('PRODUCT_NOT_FOUND')
                }
  return product
    }
}