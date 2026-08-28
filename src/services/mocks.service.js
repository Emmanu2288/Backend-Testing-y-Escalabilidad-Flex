import { generateMockUser } from '../mocks/users.mock.js'
import { generateMockProduct } from '../mocks/products.mock.js'
import { usersService } from './users.service.js'
import { productService } from './products.service.js'

export const mocksService = {
    getMockUser: (count) => {
        return Array.from({ length: count }, () => generateMockUser())
    },
    getMockProduct: (count) => {
        return Array.from({ length: count }, () => generateMockProduct())
    },

    generateData: async ({users = 0, products = 0}) => {
        if (typeof users !== 'number' || typeof products !== 'number') {
        throw new Error('Las cantidades deben ser números')
    }
    if (users < 0 || products < 0) {
        throw new Error('Las cantidades no pueden ser negativas')
    }

        if (users === 0 && products === 0) {
            throw new Error('Debe especificar al menos una cantidad de usuarios o productos a generar')
        }

        const createdUsers = []
        for (let i = 0; i < users; i++) {
        const mockUser = generateMockUser()
        const createdUser = await usersService.createUser(mockUser)
        createdUsers.push(createdUser)
        }

        const createdProducts = []
        for (let i = 0; i < products; i++) {
            const mockProduct = generateMockProduct()
            const createdProduct = await productService.createProduct(mockProduct)
            createdProducts.push(createdProduct)
        }

        return { 
            usersCreated: createdUsers.length, productsCreated: createdProducts.length }
    },

}