import {usersService} from "../services/users.service.js";

export const createUser = async (req, res) => {
    try {
        const user = await usersService.createUser(req.body)
        res.status(201).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await usersService.findAllUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await usersService.findUserById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }   
}

export const updateUser = async (req, res) => {
    try {
        const user = await usersService.updateUser(req.params.id, req.body)
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const deleteUser = async (req, res) => {
    try {
        await usersService.deleteUser(req.params.id)
        res.status(200).json({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}