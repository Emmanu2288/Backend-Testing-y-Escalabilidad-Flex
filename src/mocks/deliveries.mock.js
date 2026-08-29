import { faker } from '@faker-js/faker'
import { PRIORIDAD_ENTREGA } from '../constants/index.js'

export const generateMockDelivery = (
    pedidoId = faker.database.mongodbObjectId(),
    repartidorId = faker.database.mongodbObjectId()
) => {
    return {
        pedido: pedidoId,
        repartidor: repartidorId,
        prioridad: faker.helpers.arrayElement(Object.values(PRIORIDAD_ENTREGA))
    }
}