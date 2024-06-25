// index.js
import express from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes/routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// User routes
app.use('/orders', routes);

app.listen(port, () => {
  console.log(`User service running at http://localhost:${port}`);
});
