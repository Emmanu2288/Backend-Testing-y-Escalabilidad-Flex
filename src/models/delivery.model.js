import mongoose from 'mongoose'
import { ESTADOS_ENTREGA, PRIORIDAD_ENTREGA } from '../constants/index.js'

const deliverySchema = new mongoose.Schema({
    pedido: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    repartidor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    estado: {
        type: String,
        enum: Object.values(ESTADOS_ENTREGA),
        default: ESTADOS_ENTREGA.ASIGNADA
    },
    prioridad: {
        type: String,
        enum: Object.values(PRIORIDAD_ENTREGA),
        default: PRIORIDAD_ENTREGA.NORMAL
    }
})

const Delivery = mongoose.model('Delivery', deliverySchema)

export default Delivery