import {usersRepository} from "../repositories/users.repository.js";

export const usersService = {
    createUser: async (userData) => {
  if (!userData.email.includes('@')) {
    throw new Error('Email inválido');
  }
  return await usersRepository.create(userData);
},

    updateUser: async (id, userData) => {
        const user = await usersRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return await usersRepository.update(id, userData);
    },

    deleteUser: async (id) => {
        const user = await usersRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return await usersRepository.delete(id);
    },

    findAllUsers: async () => {
        return await usersRepository.findAll();
    },

    findUserById: async (id) => {
        const user = await usersRepository.findById(id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    }
}