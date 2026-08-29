import { usersService } from "../services/users.service.js";

export const createUser = async (req, res, next) => {
    try {
        const user = await usersService.createUser(req.body)
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await usersService.findAllUsers()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const user = await usersService.findUserById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const user = await usersService.updateUser(req.params.id, req.body)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        await usersService.deleteUser(req.params.id)
        res.status(200).json({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
        next(error)
    }
}