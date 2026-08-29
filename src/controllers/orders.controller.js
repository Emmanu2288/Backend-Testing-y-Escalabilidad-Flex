import { ordersService } from '../services/orders.service.js'

export const createOrder = async (req, res, next) => {
    try {
        const order = await ordersService.createOrder(req.body)
        res.status(201).json(order)
    } catch (error) {
        next(error)
    }
}

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await ordersService.findAllOrders()
        res.status(200).json(orders)
    } catch (error) {
        next(error)
    }
}

export const getOrderById = async (req, res, next) => {
    try {
        const order = await ordersService.findOrderById(req.params.id)
        res.status(200).json(order)
    } catch (error) {
        next(error)
    }
}

export const updateOrder = async (req, res, next) => {
    try {
        const order = await ordersService.updateOrder(req.params.id, req.body)
        res.status(200).json(order)
    } catch (error) {
        next(error)
    }
}

export const deleteOrder = async (req, res, next) => {
    try {
        await ordersService.deleteOrder(req.params.id)
        res.status(200).json({ message: 'Pedido eliminado correctamente' })
    } catch (error) {
        next(error)
    }
}

export const uploadOrderProof = async (req, res, next) => {
    try {
        const { id } = req.params
        const file = req.file
        const updatedOrder = await ordersService.addProof(id, file)
        res.status(200).json(updatedOrder)
    } catch (error) {
        next(error)
    }
}