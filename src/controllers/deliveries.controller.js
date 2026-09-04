import { deliveriesService } from '../services/deliveries.service.js'

export const createDelivery = async (req, res, next) => {
    try {
        const delivery = await deliveriesService.createDelivery(req.body)
        res.status(201).json(delivery)
    } catch (error) {
        next(error)
    }
}

export const getAllDeliveries = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const deliveries = await deliveriesService.findAllDeliveries(page, limit)
        res.status(200).json(deliveries)
    } catch (error) {
        next(error)
    }
}

export const getDeliveryById = async (req, res, next) => {
    try {
        const delivery = await deliveriesService.findDeliveryById(req.params.id)
        res.status(200).json(delivery)
    } catch (error) {
        next(error)
    }
}

export const updateDelivery = async (req, res, next) => {
    try {
        const delivery = await deliveriesService.updateDelivery(req.params.id, req.body)
        res.status(200).json(delivery)
    } catch (error) {
        next(error)
    }
}

export const deleteDelivery = async (req, res, next) => {
    try {
        await deliveriesService.deleteDelivery(req.params.id)
        res.status(200).json({ message: 'Entrega eliminada correctamente' })
    } catch (error) {
        next(error)
    }
}