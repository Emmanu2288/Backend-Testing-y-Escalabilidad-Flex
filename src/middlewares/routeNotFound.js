import { AppError } from '../errors/AppError.js'

export const routeNotFound = (req, res, next) => {
    next(new AppError('ROUTE_NOT_FOUND'))
}