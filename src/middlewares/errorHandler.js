import logger from '../utils/logger.js'

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR'
    const message = err.message || 'Ocurrió un error interno en el servidor'

    if (statusCode >= 500) {
        logger.error(`${errorCode} - ${message} - ${req.method} ${req.originalUrl}`)
    } else {
        logger.warning(`${errorCode} - ${message} - ${req.method} ${req.originalUrl}`)
    }

    res.status(statusCode).json({
        status: 'error',
        error: errorCode,
        message
    })
}