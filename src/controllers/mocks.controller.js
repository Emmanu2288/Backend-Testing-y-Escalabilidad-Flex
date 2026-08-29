import { mocksService } from '../services/mocks.service.js';

export const getMockUsers = (req, res, next) => {
    try {
        const count = Number(req.query.count) || 10;
        const users = mocksService.getMockUser(count)
        res.status(200).json(users);
        } catch (error) {
            next(error);
        }
}

export const getMockProducts = (req, res, next) => {
  try {
    const count = Number(req.query.count) || 10
    const products = mocksService.getMockProduct(count)
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}

export const getMockOrders = (req, res, next) => {
  try {
    const count = Number(req.query.count) || 10
    const orders = mocksService.getMockOrder(count)
    res.status(200).json(orders)
  } catch (error) {
    next(error)
  }
}

export const getMockDeliveries = (req, res, next) => {
  try {
    const count = Number(req.query.count) || 10
    const deliveries = mocksService.getMockDelivery(count)
    res.status(200).json(deliveries)
  } catch (error) {
    next(error)
  }
}

export const generateData = async (req, res, next) => {
    try {
        const result = await mocksService.generateData(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}