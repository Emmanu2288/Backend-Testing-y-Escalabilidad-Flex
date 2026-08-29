import { expect } from 'chai'
import request from 'supertest'
import app from '../src/app.js'
import User from '../src/models/user.model.js'
import Order from '../src/models/order.model.js'
import Delivery from '../src/models/delivery.model.js'

describe('Deliveries API', () => {
    let clienteId
    let repartidorId
    let pedidoId

    before(async () => {
        const cliente = await User.create({
            nombre: 'Cliente Test',
            email: `test-deliveries-cliente-${Date.now()}@mail.com`,
            password: 'coder123',
            rol: 'cliente'
        })
        clienteId = cliente._id.toString()

        const repartidor = await User.create({
            nombre: 'Repartidor Test',
            email: `test-deliveries-repartidor-${Date.now()}@mail.com`,
            password: 'coder123',
            rol: 'repartidor'
        })
        repartidorId = repartidor._id.toString()

        const order = await Order.create({
            cliente: clienteId,
            items: [{ nombre: 'Item', cantidad: 1, precio: 500 }],
            total: 500
        })
        pedidoId = order._id.toString()
    })

    after(async () => {
        await Delivery.deleteMany({ pedido: pedidoId })
        await Order.deleteMany({ cliente: clienteId })
        await User.deleteMany({ email: /test-deliveries-/ })
    })

    it('debería crear una entrega correctamente', async () => {
        const response = await request(app)
            .post('/api/deliveries')
            .send({
                pedido: pedidoId,
                repartidor: repartidorId,
                prioridad: 'alta'
            })

        expect(response.status).to.equal(201)
        expect(response.body).to.have.property('_id')
        expect(response.body.estado).to.equal('asignada')
        expect(response.body.prioridad).to.equal('alta')
    })

    it('debería responder 400 si el usuario asignado no tiene rol de repartidor', async () => {
        const response = await request(app)
            .post('/api/deliveries')
            .send({
                pedido: pedidoId,
                repartidor: clienteId
            })

        expect(response.status).to.equal(400)
        expect(response.body.status).to.equal('error')
        expect(response.body.error).to.equal('INVALID_DRIVER_ROLE')
    })

    it('debería responder 404 si el pedido no existe', async () => {
        const response = await request(app)
            .post('/api/deliveries')
            .send({
                pedido: '000000000000000000000000',
                repartidor: repartidorId
            })

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('ORDER_NOT_FOUND')
    })

    it('debería obtener la lista de entregas', async () => {
        const response = await request(app).get('/api/deliveries')

        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
    })

    it('debería responder 404 si la entrega consultada no existe', async () => {
        const response = await request(app).get('/api/deliveries/000000000000000000000000')

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('DELIVERY_NOT_FOUND')
    })
})
