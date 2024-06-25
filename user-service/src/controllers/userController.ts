// userController.ts
import { Request, Response } from 'express';
import { getAllUsers, getUserById, deleteUserById } from '../services/userService'; // Adjust the import path

const getListUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getListUsers:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUserByIdController = async (req: Request, res: Response) => {
    const userId = Number(req.params.id); // Assuming ID is passed as a route parameter
    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: `User with ID ${userId} not found` });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(`Error in getUserByIdController for ID ${userId}:`, error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteUserByIdController = async (req: Request, res: Response) => {
    const userId = Number(req.params.id); // Assuming ID is passed as a route parameter
    try {
        await deleteUserById(userId);
        res.status(200).json({ message: `User with ID ${userId} deleted successfully` });
    } catch (error) {
        console.error(`Error in deleteUserByIdController for ID ${userId}:`, error);
        res.status(500).json({ error: 'Server error' });
    }
};


export { getListUsers, getUserByIdController, deleteUserByIdController };
