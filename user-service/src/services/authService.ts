// authService.ts

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserAttributes } from '../models/userModel';

async function createUser(userData: UserAttributes): Promise<User> {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const user = await User.create({
            ...userData,
            password: hashedPassword
        });

        return user;
    } catch (error) {
        throw new Error('Error creating user');
    }
}

async function referralCodeUser(referralCode: string): Promise<User | null> {
    try {
        const user = await User.findOne({ where: { referralCode } });
        return user;
    } catch (error) {
        throw new Error('Error finding user by referralCode');
    }
}


async function findUserByEmail(email: string): Promise<User | null> {
    try {
        const user = await User.findOne({ where: { email } });
        return user;
    } catch (error) {
        throw new Error('Error finding user by email');
    }
}


async function generateAccessToken(userId: number, email: string): Promise<string> {
    const accessToken = jwt.sign({ id: userId, email }, process.env.JWT_SECRET!, {
        expiresIn: '20s',
    });
    return accessToken;
}

async function generateRefreshToken(userId: number, email: string): Promise<string> {
    const refreshToken = jwt.sign({ id: userId, email }, process.env.REFRESH_JWT_SECRET!, {
        expiresIn: '30d',
    });
    return refreshToken;
}


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


export {
    createUser,
    referralCodeUser,
    findUserByEmail,
    generateAccessToken,
    generateRefreshToken, getAllUsers
};
