import { expect } from 'chai'
import request from 'supertest'
import app from '../src/app.js'
import Product from '../src/models/product.model.js'

describe('Products API', () => {
    afterEach(async () => {
        await Product.deleteMany({ nombre: /Test-/ })
    })

    it('debería crear un producto correctamente', async () => {
        const response = await request(app)
            .post('/api/products')
            .send({
                nombre: 'Test-Producto',
                descripcion: 'Producto de prueba',
                precio: 1000,
                stock: 5
            })

        expect(response.status).to.equal(201)
        expect(response.body).to.have.property('_id')
        expect(response.body.nombre).to.equal('Test-Producto')
    })

    it('debería responder 400 si el precio es menor o igual a cero', async () => {
        const response = await request(app)
            .post('/api/products')
            .send({
                nombre: 'Test-Producto Inválido',
                descripcion: 'Producto de prueba',
                precio: -10,
                stock: 5
            })

        expect(response.status).to.equal(400)
        expect(response.body.status).to.equal('error')
        expect(response.body.error).to.equal('VALIDATION_ERROR')
    })

    it('debería obtener la lista de productos paginada', async () => {
        const response = await request(app).get('/api/products')

        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('products')
        expect(response.body.products).to.be.an('array')
        expect(response.body).to.have.property('total')
        expect(response.body).to.have.property('totalPages')
    })

    it('debería responder 404 si el producto consultado no existe', async () => {
        const response = await request(app).get('/api/products/000000000000000000000000')

        expect(response.status).to.equal(404)
        expect(response.body.error).to.equal('PRODUCT_NOT_FOUND')
    })
})