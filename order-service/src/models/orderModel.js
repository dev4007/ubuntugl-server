// userModel.js
import pool from "../config/db.js";

const create = async (user_id, product_id, quantity) => {
    const result = await pool.query(
        'INSERT INTO orders (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
        [user_id, product_id, quantity]
    );
    return result.rows[0];
};

const get = async () => {
    const result = await pool.query('SELECT * FROM orders');
    return result.rows;
};

export { create, get };
