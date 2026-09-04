import Order from '../models/order.model.js'

export const ordersRepository = {
    create: async (orderData) => {
        return await Order.create(orderData)
    },
    findAll: async (page = 1, limit = 10) => {
        const orders = await Order.find().skip((page - 1) * limit).limit(limit)
        const total = await Order.countDocuments()
        return { 
            orders,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }
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