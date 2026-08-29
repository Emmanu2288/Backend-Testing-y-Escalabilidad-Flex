import { ordersRepository } from '../repositories/orders.repository.js'
import { usersRepository } from '../repositories/users.repository.js'
import { deliveriesRepository } from '../repositories/deliveries.repository.js'
import { USER_ROLES } from '../constants/index.js'

export const deliveriesService = {
    createDelivery: async (deliveryData) => {
        const order = await ordersRepository.findById(deliveryData.pedido)
        if (!order) {
            throw new Error('El pedido indicado no existe')
        }
        
        const repartidor = await usersRepository.findById(deliveryData.repartidor)
        if (!repartidor) {
            throw new Error('El repartidor indicado no existe')
        }

        const rol = repartidor.rol
        if (rol !== USER_ROLES.DRIVER) {
            throw new Error('El usuario indicado no es un repartidor')
        }

        return await deliveriesRepository.create(deliveryData)
    },
    
    updateDelivery: async (id, deliveryData) => {
        const delivery = await deliveriesRepository.findById(id)
        if (!delivery) {
            throw new Error('Entrega no encontrada')
        }
        return await deliveriesRepository.update(id, deliveryData)
    },

    deleteDelivery: async (id) => {
        const delivery = await deliveriesRepository.findById(id)
        if (!delivery) {
            throw new Error('Entrega no encontrada')
        }
        return await deliveriesRepository.delete(id)
    },

    findAllDeliveries: async () => {
        return await deliveriesRepository.findAll()
    },

    findDeliveryById: async (id) => {
        const delivery = await deliveriesRepository.findById(id)
        if (!delivery) {
            throw new Error('Entrega no encontrada')
        }
        return delivery
    }
}

