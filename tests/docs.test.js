import { expect } from 'chai'
import request from 'supertest'
import app from '../src/app.js'

describe('Docs API', () => {
    it('debería servir la documentación de Swagger', async () => {
        const response = await request(app).get('/api/docs/')

        expect(response.status).to.be.oneOf([200, 301, 302])
    })
})
