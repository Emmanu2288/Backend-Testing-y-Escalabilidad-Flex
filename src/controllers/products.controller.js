import {productService } from "../services/products.service.js";

export const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body)
    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
}

export const getAllProducts = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const products = await productService.findAllProducts(page, limit)
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
}

export const getProductById = async (req, res, next) => {
    try {
        const product = await productService.findProductById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body)
        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id)
        res.status(200).json({ message: 'Producto eliminado correctamente' })
    } catch (error) {
        next(error)
    }
}
