// productRoutes.js
import express from 'express';
import { createProduct, getProduct, getById} from '../controllers/ProductController.js';

const router = express.Router();

// Define routes
router.post('/create', createProduct);
router.get('/get', getProduct);
router.get('/:id', getById);



export default router;
