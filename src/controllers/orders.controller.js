import { ordersService } from '../services/orders.service.js'

export const createOrder = async (req, res) => {
    try {
        const order = await ordersService.createOrder(req.body)
        res.status(201).json(order)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await ordersService.findAllOrders()
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const order = await ordersService.findOrderById(req.params.id)
        res.status(200).json(order)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const updateOrder = async (req, res) => {
    try {
        const order = await ordersService.updateOrder(req.params.id, req.body)
        res.status(200).json(order)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const deleteOrder = async (req, res) => {
    try {
        await ordersService.deleteOrder(req.params.id)
        res.status(200).json({ message: 'Pedido eliminado correctamente' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}