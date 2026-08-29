import { deliveriesService } from '../services/deliveries.service.js'

export const createDelivery = async (req, res) => {
    try {
        const delivery = await deliveriesService.createDelivery(req.body)
        res.status(201).json(delivery)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

export const getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await deliveriesService.findAllDeliveries()
        res.status(200).json(deliveries)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getDeliveryById = async (req, res) => {
    try {
        const delivery = await deliveriesService.findDeliveryById(req.params.id)
        res.status(200).json(delivery)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const updateDelivery = async (req, res) => {
    try {
        const delivery = await deliveriesService.updateDelivery(req.params.id, req.body)
        res.status(200).json(delivery)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

export const deleteDelivery = async (req, res) => {
    try {
        await deliveriesService.deleteDelivery(req.params.id)
        res.status(200).json({ message: 'Entrega eliminada correctamente' })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}