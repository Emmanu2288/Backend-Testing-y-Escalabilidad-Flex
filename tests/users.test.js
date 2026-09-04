import { expect } from 'chai'
import request from 'supertest'
import app from '../src/app.js'
import User from '../src/models/user.model.js'

describe('Users API', () => {
    afterEach(async () => {
        await User.deleteMany({ email: /test-/ })
    })

    it('debería crear un usuario correctamente', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                nombre: 'Usuario Test',
                email: `test-${Date.now()}@mail.com`,
                password: 'coder123'
            })

        expect(response.status).to.equal(201)
        expect(response.body).to.have.property('_id')
        expect(response.body.nombre).to.equal('Usuario Test')
        expect(response.body.rol).to.equal('cliente')
    })

    it('debería responder 400 si el email es inválido', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                nombre: 'Usuario Test',
                email: 'email-invalido',
                password: 'coder123'
            })

        expect(response.status).to.equal(400)
        expect(response.body.status).to.equal('error')
        expect(response.body.error).to.equal('VALIDATION_ERROR')
    })

    it('debería obtener la lista de usuarios paginada', async () => {
        const response = await request(app).get('/api/users')

        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('users')
        expect(response.body.users).to.be.an('array')
        expect(response.body).to.have.property('total')
        expect(response.body).to.have.property('totalPages')
    })
})