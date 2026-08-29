import Order from '../models/order.model.js'

export const ordersRepository = {
    create: async (orderData) => {
        return await Order.create(orderData)
    },
    findAll: async () => {
        return await Order.find()
    },
    findById: async (id) => {
        return await Order.findById(id)
    },
    update: async (id, orderData) => {
        return await Order.findByIdAndUpdate(id, orderData, { new: true })
    },
    delete: async (id) => {
        return await Order.findByIdAndDelete(id)
    }
}