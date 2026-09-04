import { expect } from 'chai'
import request from 'supertest'
import app from '../src/app.js'
import User from '../src/models/user.model.js'
import Order from '../src/models/order.model.js'

describe('Orders API', () => {
    let clienteId

    before(async () => {
        const user = await User.create({
            nombre: 'Cliente Test',
            email: `test-orders-${Date.now()}@mail.com`,
            password: 'coder123',
            rol: 'cliente'
        })
        clienteId = user._id.toString()
    })

    after(async () => {
        await Order.deleteMany({ cliente: clienteId })
        await User.deleteMany({ email: /test-orders-/ })
    })

    it('debería crear un pedido correctamente y calcular el total', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                cliente: clienteId,
                items: [
                    { nombre: 'Caja mediana', cantidad: 2, precio: 1500 }
                ]
            })

        expect(response.status).to.equal(201)
        expect(response.body).to.have.property('_id')
        expect(response.body.estado).to.equal('creado')
        expect(response.body.total).to.equal(3000)
    })

    it('debería responder 404 si el cliente no existe', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                cliente: '000000000000000000000000',
                items: [{ nombre: 'Item', cantidad: 1, precio: 100 }]
            })

        expect(response.status).to.equal(404)
        expect(response.body.status).to.equal('error')
        expect(response.body.error).to.equal('USER_NOT_FOUND')
    })

    it('debería responder 400 si faltan items', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({ cliente: clienteId })

        expect(response.status).to.equal(400)
        expect(response.body.status).to.equal('error')
        expect(response.body.error).to.equal('VALIDATION_ERROR')
    })

    it('debería obtener un pedido por ID', async () => {
        const created = await Order.create({
            cliente: clienteId,
            items: [{ nombre: 'Item', cantidad: 1, precio: 500 }],
            total: 500
        })

        const response = await request(app).get(`/api/orders/${created._id}`)

        expect(response.status).to.equal(200)
        expect(response.body._id).to.equal(created._id.toString())
        expect(response.body.total).to.equal(500)
    })

    it('debería responder 404 si el pedido consultado no existe', async () => {
        const response = await request(app).get('/api/orders/000000000000000000000000')

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('ORDER_NOT_FOUND')
    })

    it('debería actualizar el estado de un pedido', async () => {
        const created = await Order.create({
            cliente: clienteId,
            items: [{ nombre: 'Item', cantidad: 1, precio: 500 }],
            total: 500
        })

        const response = await request(app)
            .put(`/api/orders/${created._id}`)
            .send({ estado: 'asignado' })

        expect(response.status).to.equal(200)
        expect(response.body.estado).to.equal('asignado')
    })

    it('debería obtener la lista de pedidos paginada', async () => {
        const response = await request(app).get('/api/orders')

        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('orders')
        expect(response.body.orders).to.be.an('array')
        expect(response.body).to.have.property('total')
        expect(response.body).to.have.property('totalPages')
    })
})
