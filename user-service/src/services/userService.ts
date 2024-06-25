// userService.ts
import { User, UserAttributes } from '../models/userModel';

// Get Users
const getAllUsers = async (): Promise<UserAttributes[]> => {
    try {
        const users = await User.findAll(); // Assuming User.findAll() fetches all users from the database
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Throw the error to be handled by the caller
    }
};

// Function to get user by ID
const getUserById = async (userId: number): Promise<UserAttributes | null> => {
    try {
        const user = await User.findByPk(userId); // Assuming findByPk is used to find a user by primary key (ID)
        return user;
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        throw error; // Throw the error to be handled by the caller
    }
};

// Function to delete user by ID
const deleteUserById = async (userId: number): Promise<void> => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }
        await user.destroy();
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        throw error; // Throw the error to be handled by the caller
    }
};


export {
    getAllUsers, getUserById, deleteUserById
};
