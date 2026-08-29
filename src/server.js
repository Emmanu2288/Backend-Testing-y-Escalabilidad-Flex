import mongoose from 'mongoose'
import app from './app.js'
import { config } from './config/index.js'
import logger from './utils/logger.js'

mongoose.connect(config.mongoUri)
    .then(() => logger.info('Conectado a la base de datos'))
    .catch((error) => logger.fatal(`Error al conectar a la base de datos: ${error}`))

app.listen(config.port, () => {
    logger.info(`Servidor escuchando en el puerto ${config.port}`)
})
