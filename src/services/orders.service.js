import { ordersRepository } from '../repositories/orders.repository.js'
import { usersRepository } from '../repositories/users.repository.js'
import { AppError } from '../errors/AppError.js'
import logger from '../utils/logger.js'

export const ordersService = {
    createOrder: async (orderData) => {
        const cliente = await usersRepository.findById(orderData.cliente)
        if (!cliente) {
            throw new AppError('USER_NOT_FOUND')
        }

        const total = orderData.items.reduce((acc, item) => acc + item.cantidad * item.precio, 0)
        const pedidoCompleto = { ...orderData, total }

        logger.info(`Pedido creado para el cliente ${orderData.cliente}`)

        return await ordersRepository.create(pedidoCompleto)
    },

    updateOrder: async (id, orderData) => {
        const order = await ordersRepository.findById(id)
        if (!order) {
            throw new AppError('ORDER_NOT_FOUND', 'El pedido indicado no existe')
        }
        return await ordersRepository.update(id, orderData)
    },

    deleteOrder: async (id) => {
        const order = await ordersRepository.findById(id)
        if (!order) {
            throw new AppError('ORDER_NOT_FOUND', 'El pedido indicado no existe')
        }
        return await ordersRepository.delete(id)
    },

    findAllOrders: async () => {
        return await ordersRepository.findAll()
    },

    findOrderById: async (id) => {
        const order = await ordersRepository.findById(id)
        if (!order) {
            throw new AppError('ORDER_NOT_FOUND', 'El pedido indicado no existe')
        }
        return order
    }
}