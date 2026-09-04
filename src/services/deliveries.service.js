import { ordersRepository } from '../repositories/orders.repository.js'
import { usersRepository } from '../repositories/users.repository.js'
import { deliveriesRepository } from '../repositories/deliveries.repository.js'
import { USER_ROLES } from '../constants/index.js'
import { AppError } from '../errors/AppError.js'

export const deliveriesService = {
    createDelivery: async (deliveryData) => {
        const order = await ordersRepository.findById(deliveryData.pedido)
        if (!order) {
            throw new AppError('ORDER_NOT_FOUND', 'El pedido indicado no existe')
        }
        
        const repartidor = await usersRepository.findById(deliveryData.repartidor)
        if (!repartidor) {
            throw new AppError('USER_NOT_FOUND', 'El repartidor indicado no existe')
        }

        const rol = repartidor.rol
        if (rol !== USER_ROLES.DRIVER) {
            throw new AppError('INVALID_DRIVER_ROLE', 'El usuario indicado no es un repartidor')
        }

        return await deliveriesRepository.create(deliveryData)
    },
    
    updateDelivery: async (id, deliveryData) => {
        const delivery = await deliveriesRepository.findById(id)
        if (!delivery) {
            throw new AppError('DELIVERY_NOT_FOUND')
        }
        return await deliveriesRepository.update(id, deliveryData)
    },

    deleteDelivery: async (id) => {
        const delivery = await deliveriesRepository.findById(id)
        if (!delivery) {
            throw new AppError('DELIVERY_NOT_FOUND')
        }
        return await deliveriesRepository.delete(id)
    },

    findAllDeliveries: async (page = 1, limit = 10) => {
        return await deliveriesRepository.findAll(page, limit)
    },

    findDeliveryById: async (id) => {
        const delivery = await deliveriesRepository.findById(id)
        if (!delivery) {
            throw new AppError('DELIVERY_NOT_FOUND')
        }
        return delivery
    }
}

