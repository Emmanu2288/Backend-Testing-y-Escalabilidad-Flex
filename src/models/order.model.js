import mongoose from 'mongoose'
import { ESTADOS_PEDIDO } from '../constants/index.js'

const orderSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [
            {
                nombre: { type: String, required: true },
                cantidad: { type: Number, required: true },
                precio: { type: Number, required: true }
            }
        ],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: Object.values(ESTADOS_PEDIDO),
        default: ESTADOS_PEDIDO.CREADO
    },
    proof: {
        originalName: String,
        fileName: String,
        path: String,
        mimeType: String,
        size: Number,
        uploadedAt: Date
    }
})

const Order = mongoose.model('Order', orderSchema)

export default Order