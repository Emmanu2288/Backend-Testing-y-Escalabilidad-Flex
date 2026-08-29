import { generateMockUser } from '../mocks/users.mock.js'
import { generateMockProduct } from '../mocks/products.mock.js'
import { generateMockOrder } from '../mocks/orders.mock.js'
import { generateMockDelivery } from '../mocks/deliveries.mock.js'
import { usersService } from './users.service.js'
import { productService } from './products.service.js'
import { ordersService } from './orders.service.js'
import { deliveriesService } from './deliveries.service.js'
import { USER_ROLES } from '../constants/index.js'
import { AppError } from '../errors/AppError.js'

export const mocksService = {
    getMockUser: (count) => {
        return Array.from({ length: count }, () => generateMockUser())
    },
    getMockProduct: (count) => {
        return Array.from({ length: count }, () => generateMockProduct())
    },
    getMockOrder: (count) => {
        return Array.from({ length: count }, () => generateMockOrder())
    },
    getMockDelivery: (count) => {
        return Array.from({ length: count }, () => generateMockDelivery())
    },

    generateData: async ({ users = 0, products = 0, orders = 0, deliveries = 0 }) => {
        const cantidades = [users, products, orders, deliveries]
        if (cantidades.some((valor) => typeof valor !== 'number' || valor < 0)) {
            throw new AppError('INVALID_MOCK_AMOUNT', 'Las cantidades deben ser números positivos')
        }
        if (cantidades.every((valor) => valor === 0)) {
            throw new AppError('INVALID_MOCK_AMOUNT', 'Debe especificar al menos una cantidad a generar')
        }

        // 1. Usuarios: 1 de cada 3 se genera como repartidor, el resto como cliente
        const createdUsers = []
        for (let i = 0; i < users; i++) {
            const rol = i % 3 === 0 ? USER_ROLES.DRIVER : USER_ROLES.CUSTOMER
            const mockUser = generateMockUser(rol)
            const createdUser = await usersService.createUser(mockUser)
            createdUsers.push(createdUser)
        }

        // 2. Productos
        const createdProducts = []
        for (let i = 0; i < products; i++) {
            const mockProduct = generateMockProduct()
            const createdProduct = await productService.createProduct(mockProduct)
            createdProducts.push(createdProduct)
        }

        const clientes = createdUsers.filter((user) => user.rol === USER_ROLES.CUSTOMER)
        const repartidores = createdUsers.filter((user) => user.rol === USER_ROLES.DRIVER)

        // 3. Pedidos: cada uno necesita un cliente real ya creado
        const createdOrders = []
        if (orders > 0 && clientes.length === 0) {
            throw new AppError('VALIDATION_ERROR', 'No se pueden generar pedidos sin al menos un usuario con rol cliente')
        }
        for (let i = 0; i < orders; i++) {
            const clienteAleatorio = clientes[Math.floor(Math.random() * clientes.length)]
            const mockOrder = generateMockOrder(clienteAleatorio._id)
            const createdOrder = await ordersService.createOrder(mockOrder)
            createdOrders.push(createdOrder)
        }

        // 4. Entregas: cada una necesita un pedido y un repartidor reales ya creados
        const createdDeliveries = []
        if (deliveries > 0 && (createdOrders.length === 0 || repartidores.length === 0)) {
            throw new AppError('VALIDATION_ERROR', 'No se pueden generar entregas sin pedidos y repartidores disponibles')
        }
        for (let i = 0; i < deliveries; i++) {
            const pedidoAleatorio = createdOrders[Math.floor(Math.random() * createdOrders.length)]
            const repartidorAleatorio = repartidores[Math.floor(Math.random() * repartidores.length)]
            const mockDelivery = generateMockDelivery(pedidoAleatorio._id, repartidorAleatorio._id)
            const createdDelivery = await deliveriesService.createDelivery(mockDelivery)
            createdDeliveries.push(createdDelivery)
        }

        return {
            usersCreated: createdUsers.length,
            productsCreated: createdProducts.length,
            ordersCreated: createdOrders.length,
            deliveriesCreated: createdDeliveries.length
        }
    }
}