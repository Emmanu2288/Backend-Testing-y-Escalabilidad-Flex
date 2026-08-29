import { faker } from '@faker-js/faker'
import { PRODUCT_STATUS }  from '../constants/index.js'

export const generateMockProduct = () => {
    const productName = faker.commerce.productName()
    const descriptionProduct = faker.commerce.productDescription()
    const priceProduct = parseFloat(faker.commerce.price({ min: 1, max: 1000, dec: 2 }))
    const stockProduct = faker.number.int({ min: 0, max: 100 })

    return {
        nombre: productName,
        descripcion: descriptionProduct,
        precio: priceProduct,
        estado: PRODUCT_STATUS.AVAILABLE,
        stock: stockProduct
    }
}