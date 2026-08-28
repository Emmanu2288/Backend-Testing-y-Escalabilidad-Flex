import { mocksService } from '../services/mocks.service.js';

export const getMockUsers = (req, res) => {
    try {
        const count = Number(req.query.count) || 10;
        const users = mocksService.getMockUser(count)
        res.status(200).json(users);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
}

export const getMockProducts = (req, res) => {
  try {
    const count = Number(req.query.count) || 10
    const products = mocksService.getMockProduct(count)
    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const generateData = async (req, res) => {
    try {
        const result = await mocksService.generateData(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}