import { ordersRepository } from '../repositories/orders.repository.js'
import { usersRepository } from '../repositories/users.repository.js'
import { AppError } from '../errors/AppError.js'
import logger from '../utils/logger.js'
import fs from 'fs/promises'

export const ordersService = {
    createOrder: async (orderData) => {
        const cliente = await usersRepository.findById(orderData.cliente)
        if (!cliente) {
            throw new AppError('USER_NOT_FOUND')
        }

        if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
            throw new AppError('VALIDATION_ERROR', 'El pedido debe incluir al menos un item')
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

    findAllOrders: async (page = 1, limit = 10) => {
        return await ordersRepository.findAll(page, limit)
    },

    findOrderById: async (id) => {
        const order = await ordersRepository.findById(id)
        if (!order) {
            throw new AppError('ORDER_NOT_FOUND', 'El pedido indicado no existe')
        }
        return order
    },

    addProof: async (id, file) => {
        if (!file) {
            throw new AppError('FILE_REQUIRED', 'Se requiere un archivo para subir el comprobante')
        }

        try {
            const order = await ordersRepository.findById(id)
            if (!order) {
                throw new AppError('ORDER_NOT_FOUND', 'El pedido indicado no existe')
            }

            const proof = {
                originalName: file.originalname,
                fileName: file.filename,
                path: file.path,
                mimeType: file.mimetype,
                size: file.size,
                uploadedAt: new Date()
            }

            const updatedOrder = await ordersRepository.update(id, { proof })
            logger.info(`Comprobante asociado al pedido ${id}: ${file.originalname}`)
            return updatedOrder
        } catch (error) {
            await fs.rm(file.path, { force: true })
            throw error
        }
    }
}