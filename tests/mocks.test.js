import { expect } from 'chai'
import request from 'supertest'
import app from '../src/app.js'
import User from '../src/models/user.model.js'
import Product from '../src/models/product.model.js'

describe('Mocks API', () => {
    afterEach(async () => {
        await User.deleteMany({ email: /@test\.com$/ })
        await Product.deleteMany({})
    })

    it('debería devolver usuarios falsos sin guardarlos en la base', async () => {
        const response = await request(app).get('/api/mocks/mockingusers?count=5')

        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.lengthOf(5)
        expect(response.body[0]).to.have.property('nombre')
        expect(response.body[0]).to.have.property('rol')

        const usersInDb = await User.countDocuments({ email: /@test\.com$/ })
        expect(usersInDb).to.equal(0)
    })

    it('debería responder 400 si la cantidad es inválida', async () => {
        const response = await request(app)
            .post('/api/mocks/generateData')
            .send({ users: -1 })

        expect(response.status).to.equal(400)
        expect(response.body.status).to.equal('error')
        expect(response.body.error).to.equal('INVALID_MOCK_AMOUNT')
    })

    it('debería generar e insertar datos de prueba en MongoDB', async () => {
        const response = await request(app)
            .post('/api/mocks/generateData')
            .send({ users: 3, products: 2 })

        expect(response.status).to.equal(201)
        expect(response.body.usersCreated).to.equal(3)
        expect(response.body.productsCreated).to.equal(2)

        const usersInDb = await User.countDocuments({ email: /@test\.com$/ })
        expect(usersInDb).to.equal(3)
    })
})
