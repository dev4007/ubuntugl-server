//Routes.js
import express from 'express';
import { createOrder,getOrder } from '../controllers/orderController.js';

const router = express.Router();

// Define routes
router.post('/create', createOrder);
router.get('/get', getOrder);

export default router;
