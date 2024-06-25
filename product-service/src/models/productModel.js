// userModel.js
import pool from "../config/db.js";

const create = async (product) => {
  const { name, price } = product;
  const query =
    "INSERT INTO products (name, price) VALUES ($1, $2 ) RETURNING *";
  const values = [name, price];

  try {
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error) {
    throw error;
  }
};

const get = async () => {
  try {
    const result = await pool.query("SELECT * FROM products");
    const { rows } = result;
    return rows; // Return the first row of the result
  } catch (error) {
    console.error(error);
    throw new Error("Database query failed"); // Throw an error to be caught by the controller
  }
};

const getProductById = async (id) => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows.length === 0 ? null : result.rows[0];
};

export { create, get, getProductById };
