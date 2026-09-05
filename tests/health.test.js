import { expect } from 'chai'
import request from 'supertest'
import app from '../src/app.js'

describe('Health API', () => {
    it('debería responder que la API está activa, sin exponer datos sensibles', async () => {
        const response = await request(app).get('/health')

        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal('ok')
        expect(response.body).to.have.property('environment')
        expect(response.body).to.have.property('uptime')
        expect(response.body).to.have.property('timestamp')
        expect(response.body).to.not.have.property('mongoUri')
        expect(response.body).to.not.have.property('password')
    })
})
