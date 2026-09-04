import User from '../models/user.model.js';

export const usersRepository = {
    create: async (userData) => {
        const user = new User(userData);
        return await user.save();
    },
    findAll: async (page = 1, limit = 10) => {
        const users = await User.find().skip((page - 1) * limit).limit(limit);
        const total = await User.countDocuments();
        return { users, total, page, totalPages: Math.ceil(total / limit) };
        
    },
    findById: async (id) => {
        return await User.findById(id);
    },
    update: async (id, userData) => {
        return await User.findByIdAndUpdate(id, userData, { new: true });
    },
    delete: async (id) => {
        return await User.findByIdAndDelete(id);
    }
}