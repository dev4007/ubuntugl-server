import express from 'express';
import bodyParser from 'body-parser';
import router from '../src/routes/routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// User routes
app.use('/user', router);

app.listen(port, () => {
    console.log(`User service running at http://localhost:${port}`);
});
