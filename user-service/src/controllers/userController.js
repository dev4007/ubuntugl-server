// userController.js
import User from "../models/userModel.js";

const getUser = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

export {  getUser };
