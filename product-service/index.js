// index.js
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import router from './src/routes/router.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5002;

app.use(bodyParser.json());

// User routes
app.use('/product', router);

app.listen(port, () => {
  console.log(`User service running at http://localhost:${port}`);
});
