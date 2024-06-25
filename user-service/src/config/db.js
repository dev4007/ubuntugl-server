//config/db.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  logging: false, // Disable logging of SQL queries
});

// Synchronize all defined models to the DB
// const syncDatabase = async () => {
//   try {
//     await sequelize.sync({ alter: true }); // Use { force: true } to drop & recreate the table each time, or { alter: true } to update the table structure
//     console.log("Database & tables created!");
//   } catch (error) {
//     console.error("Error syncing database:", error);
//   }
// };

// syncDatabase();

export default sequelize;
