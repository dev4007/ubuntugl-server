// src/config/nodemailerConfig.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider here
    auth: {
        user: process.env.NODEMAILER_USER!, // Your email address
        pass: process.env.NODEMAILER_PASS!, // Your password
    },
});

export default transporter;
