import { Router } from 'express'
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} from '../controllers/orders.controller.js'

const router = Router()

router.post('/', createOrder)
router.get('/', getAllOrders)
router.get('/:id', getOrderById)
router.put('/:id', updateOrder)
router.delete('/:id', deleteOrder)

export default router