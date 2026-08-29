import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ShipNow API',
            version: '1.0.0',
            description: 'Documentación de la API ShipNow: gestión de usuarios, productos, pedidos, entregas, generación de datos de prueba (mocks) y logging.'
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Servidor local'
            }
        ]
    },
    apis: ['./src/docs/**/*.yaml']
}

export const swaggerSpecs = swaggerJSDoc(swaggerOptions)