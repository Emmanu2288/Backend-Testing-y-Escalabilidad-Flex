import { expect } from 'chai'
import request from 'supertest'
import fs from 'fs'
import app from '../src/app.js'
import User from '../src/models/user.model.js'
import Order from '../src/models/order.model.js'

const validFile = 'tests/fixtures/test-document.png'
const invalidFile = 'tests/fixtures/test-invalido.txt'

const uploadedPaths = []

const trackUploadedFile = (response, field) => {
    const path = response.body[field]?.path ?? response.body.documents?.at(-1)?.path
    if (path) uploadedPaths.push(path)
}

after(() => {
    for (const filePath of uploadedPaths) {
        fs.rmSync(filePath, { force: true })
    }
})

describe('Uploads - User documents', () => {
    let userId

    before(async () => {
        const user = await User.create({
            nombre: 'Usuario Documentos Test',
            email: `test-uploads-${Date.now()}@mail.com`,
            password: 'coder123',
            rol: 'cliente'
        })
        userId = user._id.toString()
    })

    after(async () => {
        await User.deleteMany({ email: /test-uploads-/ })
    })

    it('debería subir un documento correctamente y asociarlo al usuario', async () => {
        const response = await request(app)
            .post(`/api/users/${userId}/documents`)
            .field('type', 'documento_usuario')
            .attach('document', validFile)

        expect(response.status).to.equal(200)
        expect(response.body.documents).to.have.lengthOf(1)
        expect(response.body.documents[0]).to.have.property('originalName', 'test-document.png')
        expect(response.body.documents[0].type).to.equal('documento_usuario')
        trackUploadedFile(response, 'documents')
    })

    it('debería responder 400 si falta el archivo', async () => {
        const response = await request(app)
            .post(`/api/users/${userId}/documents`)
            .field('type', 'documento_usuario')

        expect(response.status).to.equal(400)
        expect(response.body.status).to.equal('error')
        expect(response.body.error).to.equal('FILE_REQUIRED')
    })

    it('debería responder 400 si el tipo de documento es inválido', async () => {
        const response = await request(app)
            .post(`/api/users/${userId}/documents`)
            .field('type', 'tipo_que_no_existe')
            .attach('document', validFile)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('INVALID_DOCUMENT_TYPE')
    })

    it('debería responder 400 si el tipo de archivo no está permitido', async () => {
        const response = await request(app)
            .post(`/api/users/${userId}/documents`)
            .field('type', 'documento_usuario')
            .attach('document', invalidFile)

        expect(response.status).to.equal(400)
        expect(response.body.error).to.equal('INVALID_FILE_TYPE')
    })

    it('debería responder 404 si el usuario no existe', async () => {
        const response = await request(app)
            .post('/api/users/000000000000000000000000/documents')
            .field('type', 'documento_usuario')
            .attach('document', validFile)

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('USER_NOT_FOUND')
    })
})

describe('Uploads - Order proof', () => {
    let clienteId
    let orderId

    before(async () => {
        const user = await User.create({
            nombre: 'Cliente Proof Test',
            email: `test-uploads-proof-${Date.now()}@mail.com`,
            password: 'coder123',
            rol: 'cliente'
        })
        clienteId = user._id.toString()

        const order = await Order.create({
            cliente: clienteId,
            items: [{ nombre: 'Item', cantidad: 1, precio: 500 }],
            total: 500
        })
        orderId = order._id.toString()
    })

    after(async () => {
        await Order.deleteMany({ cliente: clienteId })
        await User.deleteMany({ email: /test-uploads-proof-/ })
    })

    it('debería subir un comprobante correctamente y asociarlo al pedido', async () => {
        const response = await request(app)
            .post(`/api/orders/${orderId}/proof`)
            .attach('proof', validFile)

        expect(response.status).to.equal(200)
        expect(response.body.proof).to.have.property('originalName', 'test-document.png')
        trackUploadedFile(response, 'proof')
    })

    it('debería responder 404 si el pedido no existe', async () => {
        const response = await request(app)
            .post('/api/orders/000000000000000000000000/proof')
            .attach('proof', validFile)

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('ORDER_NOT_FOUND')
    })
})
