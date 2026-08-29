import { Router } from 'express'
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    uploadOrderProof
} from '../controllers/orders.controller.js'
import upload from '../middlewares/upload.middleware.js'

const router = Router()

router.post('/', createOrder)
router.get('/', getAllOrders)
router.get('/:id', getOrderById)
router.put('/:id', updateOrder)
router.delete('/:id', deleteOrder)
router.post('/:id/proof', upload.single('proof'), uploadOrderProof)

export default router