import { expect } from 'chai'
import request from 'supertest'
import app from '../src/app.js'

describe('Logger API', () => {
    it('debería generar logs en todos los niveles y responder success', async () => {
        const response = await request(app).get('/api/loggerTest')

        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal('success')
        expect(response.body.message).to.equal('Logs generados correctamente')
    })
})

describe('Not found routes', () => {
    it('debería responder 404 con formato de error para una ruta inexistente', async () => {
        const response = await request(app).get('/api/ruta-que-no-existe')

        expect(response.status).to.equal(404)
        expect(response.body.status).to.equal('error')
        expect(response.body.error).to.equal('ROUTE_NOT_FOUND')
        expect(response.body).to.have.property('message')
    })
})
