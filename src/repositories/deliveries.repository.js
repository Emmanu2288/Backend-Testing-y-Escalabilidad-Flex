import Delivery from '../models/delivery.model.js'

export const deliveriesRepository = {
    create: async (deliveryData) => {
        return await Delivery.create(deliveryData)
    },
    findAll: async (page = 1, limit = 10) => {
        const deliveries = await Delivery.find().skip((page - 1) * limit).limit(limit)
        const total = await Delivery.countDocuments()
        return { deliveries, total, page, totalPages: Math.ceil(total / limit) }
    },
    findById: async (id) => {
        return await Delivery.findById(id)
    },
    update: async (id, deliveryData) => {
        return await Delivery.findByIdAndUpdate(id, deliveryData, { new: true })
    },
    delete: async (id) => {
        return await Delivery.findByIdAndDelete(id)
    }
}