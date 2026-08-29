import { ERRORS } from './errorDictionary.js'

export class AppError extends Error {
    constructor(errorCode, customMessage) {
        const errorInfo = ERRORS[errorCode]
        super(customMessage || errorInfo.message)
        this.errorCode = errorCode
        this.statusCode = errorInfo.statusCode
    }
}