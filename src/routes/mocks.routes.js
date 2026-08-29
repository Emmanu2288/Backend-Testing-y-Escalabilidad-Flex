import { Router } from 'express';
import {
    getMockUsers,
    getMockProducts,
    getMockOrders,
    getMockDeliveries,
    generateData
} from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingusers', getMockUsers);
router.get('/mockingproducts', getMockProducts);
router.get('/mockingorders', getMockOrders)
router.get('/mockingdeliveries', getMockDeliveries)
router.post('/generateData', generateData);

export default router;