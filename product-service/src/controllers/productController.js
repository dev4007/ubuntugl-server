// productController.js
import { create, get,getProductById } from "../models/productModel.js";

const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await create(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProduct = async (req, res) => {
  try {
    const result = await get(); // Call the get function from the model
    res.status(200).json(result); // Send the result as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    if (!product) {
      res.status(404).send("product not found");
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
};

export { createProduct, getProduct, getById };
