import { faker } from '@faker-js/faker'

export const generateMockOrder = (clienteId = faker.database.mongodbObjectId()) => {
    const cantidadItems = faker.number.int({ min: 1, max: 3 })
    const items = Array.from({ length: cantidadItems }, () => ({
        nombre: faker.commerce.productName(),
        cantidad: faker.number.int({ min: 1, max: 5 }),
        precio: parseFloat(faker.commerce.price({ min: 1, max: 500, dec: 2 }))
    }))

    return {
        cliente: clienteId,
        items
    }
}