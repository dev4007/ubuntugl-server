// orderController.js
import { create, get } from "../models/orderModel.js";
import  axios from 'axios'

const createOrder = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  try {
      // Verify user exists
      const userResponse = await axios.get(`http://localhost:5001/users/${user_id}`);
      if (!userResponse.data) {
          return res.status(404).send('User not found');
      }

      // Verify product exists
      const productResponse = await axios.get(`http://localhost:5002/product/${product_id}`);
      if (!productResponse.data) {
          return res.status(404).send('Product not found');
      }
      const order = await create(user_id, product_id, quantity);
      res.status(201).json(order);
  } catch (error) {
      res.status(500).send(error.message);
  }
};

const getOrder = async (req, res) => {
  try {
      const orders = await get();
      res.json(orders);
  } catch (error) {
      res.status(500).send(error.message);
  }
};

export { createOrder, getOrder };
