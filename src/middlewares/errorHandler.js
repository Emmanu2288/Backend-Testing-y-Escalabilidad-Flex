import multer from 'multer'
import logger from '../utils/logger.js'
import { ERRORS } from '../errors/errorDictionary.js'

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR'
    let message = err.message || 'Ocurrió un error interno en el servidor'

    if (err.name === 'ValidationError') {
        statusCode = 400
        errorCode = 'VALIDATION_ERROR'
        message = Object.values(err.errors).map((fieldError) => fieldError.message).join(', ')
    }

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            errorCode = 'FILE_TOO_LARGE'
        } else {
            errorCode = 'UPLOAD_ERROR'
        }
        statusCode = ERRORS[errorCode].statusCode
        message = ERRORS[errorCode].message
    } else if (err.message === 'INVALID_FILE_TYPE') {
        errorCode = 'INVALID_FILE_TYPE'
        statusCode = ERRORS[errorCode].statusCode
        message = ERRORS[errorCode].message
    }

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