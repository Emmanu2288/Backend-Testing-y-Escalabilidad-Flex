import { Router } from 'express'
import {
    createDelivery,
    getAllDeliveries,
    getDeliveryById,
    updateDelivery,
    deleteDelivery
} from '../controllers/deliveries.controller.js'

const router = Router()

router.post('/', createDelivery)
router.get('/', getAllDeliveries)
router.get('/:id', getDeliveryById)
router.put('/:id', updateDelivery)
router.delete('/:id', deleteDelivery)

export default router