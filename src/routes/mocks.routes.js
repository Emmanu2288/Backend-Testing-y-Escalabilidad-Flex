import { Router } from 'express';
import {
    getMockUsers,
    getMockProducts,
    generateData
} from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingusers', getMockUsers);
router.get('/mockingproducts', getMockProducts);
router.post('/generateData', generateData);

export default router;