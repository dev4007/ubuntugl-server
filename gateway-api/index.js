import dotenv from 'dotenv';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT 

const app = express();

app.use('/api-auth', createProxyMiddleware({ target: process.env.USER_URL, changeOrigin: true }));
app.use('/api-product', createProxyMiddleware({ target:  process.env.PRODUCT_URL, changeOrigin: true }));
app.use('/api-order', createProxyMiddleware({ target:  process.env.ORDER_URL, changeOrigin: true }));

app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});
