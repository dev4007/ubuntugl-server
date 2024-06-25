import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// Define a custom type for the JWT payload if needed
interface JwtPayload {
    [key: string]: any; // Adjust this based on your actual JWT payload structure
    // For example, if your JWT payload has an `id` and `email` field, you can specify it as:
    // id: string;
    // email: string;
}
// Extend Express Request interface to include user property
declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }


    const token = authHeader.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: "Invalid token." });
    }
};

export default authMiddleware;