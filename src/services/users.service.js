import {usersRepository} from "../repositories/users.repository.js";
import bcrypt from 'bcrypt'
import { AppError } from '../errors/AppError.js'
import { DOCUMENT_TYPES } from "../constants/index.js";
import logger from '../utils/logger.js'
import fs from 'fs/promises'

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

    findAllUsers: async (page = 1, limit = 10) => {
        return await usersRepository.findAll(page, limit);
    },

    findUserById: async (id) => {
        const user = await usersRepository.findById(id);
        if (!user) {
            throw new AppError('USER_NOT_FOUND');
        }
        return user;
    },

    addDocument: async (uid, file, type = DOCUMENT_TYPES.USER_DOCUMENT) => {
        if (!file) {
            throw new AppError('FILE_REQUIRED', 'Se requiere un archivo para subir el documento');
        }

        try {
            if (!Object.values(DOCUMENT_TYPES).includes(type)) {
                throw new AppError('INVALID_DOCUMENT_TYPE', 'Tipo de documento inválido');
            }

            const user = await usersRepository.findById(uid);
            if (!user) {
                throw new AppError('USER_NOT_FOUND', 'El usuario indicado no existe');
            }

            return await usersService.saveDocument(uid, user, file, type);
        } catch (error) {
            await fs.rm(file.path, { force: true });
            throw error;
        }
    },

    saveDocument: async (uid, user, file, type) => {

        const document = {
            originalName: file.originalname,
            fileName: file.filename,
            path: file.path,
            mimeType: file.mimetype,
            size: file.size,
            type: type,
            uploadedAt: new Date()
        }

        const updatedUser = await usersRepository.update(uid, { documents: [...user.documents, document] });
        logger.info(`Documento agregado al usuario ${uid}: ${file.originalname}`);
        return updatedUser;

    }
}