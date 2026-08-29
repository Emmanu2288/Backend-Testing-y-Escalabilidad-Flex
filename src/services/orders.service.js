import { ordersRepository } from '../repositories/orders.repository.js'
import { usersRepository } from '../repositories/users.repository.js'

export const ordersService = {
    createOrder: async (orderData) => {
        const cliente = await usersRepository.findById(orderData.cliente)
        if (!cliente) {
            throw new Error('El cliente indicado no existe')
        }

        const total = orderData.items.reduce((acc, item) => acc + item.cantidad * item.precio, 0)
        const pedidoCompleto = { ...orderData, total }

        return await ordersRepository.create(pedidoCompleto)
    },

    updateOrder: async (id, orderData) => {
        const order = await ordersRepository.findById(id)
        if (!order) {
            throw new Error('Pedido no encontrado')
        }
        return await ordersRepository.update(id, orderData)
    },

    deleteOrder: async (id) => {
        const order = await ordersRepository.findById(id)
        if (!order) {
            throw new Error('Pedido no encontrado')
        }
        return await ordersRepository.delete(id)
    },

    findAllOrders: async () => {
        return await ordersRepository.findAll()
    },

    findOrderById: async (id) => {
        const order = await ordersRepository.findById(id)
        if (!order) {
            throw new Error('Pedido no encontrado')
        }
        return order
    }
}