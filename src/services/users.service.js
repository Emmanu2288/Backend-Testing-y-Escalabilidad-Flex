import {usersRepository} from "../repositories/users.repository.js";
import bcrypt from 'bcrypt'

export const usersService = {
    createUser: async (userData) => {
  if (!userData.email.includes('@')) {
    throw new Error('Email inválido');
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10)
  const userToCreate = { ...userData, password: hashedPassword }
  return await usersRepository.create(userToCreate);
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