import User from '../models/user.model.js';

export const usersRepository = {
    create: async (userData) => {
        const user = new User(userData);
        return await user.save();
    },
    findAll: async () => {
        return await User.find();
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