import {usersRepository} from "../repositories/users.repository.js";
import bcrypt from 'bcrypt'
import { AppError } from '../errors/AppError.js'

export const usersService = {
    createUser: async (userData) => {
  if (!userData.email.includes('@')) {
    throw new AppError('VALIDATION_ERROR', 'Email inválido');
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10)
  const userToCreate = { ...userData, password: hashedPassword }
  return await usersRepository.create(userToCreate);
},

    updateUser: async (id, userData) => {
        const user = await usersRepository.findById(id);
        if (!user) {
            throw new AppError('USER_NOT_FOUND');
        }
        return await usersRepository.update(id, userData);
    },

    deleteUser: async (id) => {
        const user = await usersRepository.findById(id);
        if (!user) {
            throw new AppError('USER_NOT_FOUND');
        }
        return await usersRepository.delete(id);
    },

    findAllUsers: async () => {
        return await usersRepository.findAll();
    },

    findUserById: async (id) => {
        const user = await usersRepository.findById(id);
        if (!user) {
            throw new AppError('USER_NOT_FOUND');
        }
        return user;
    }
}