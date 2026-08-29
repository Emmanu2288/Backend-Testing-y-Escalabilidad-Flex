import Delivery from '../models/delivery.model.js'

export const deliveriesRepository = {
    create: async (deliveryData) => {
        return await Delivery.create(deliveryData)
    },
    findAll: async () => {
        return await Delivery.find()
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