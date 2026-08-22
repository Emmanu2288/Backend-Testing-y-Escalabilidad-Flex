import {productService } from "../services/products.service.js";

export const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.findAllProducts(req.body)
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await productService.findProductById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body)
        res.status(200).json(product)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id)
        res.status(200).json({ message: 'Producto eliminado correctamente' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}
