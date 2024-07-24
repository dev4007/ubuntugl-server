// userController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, UserAttributes } from '../models/userModel';
import { createUser, findUserByEmail, generateAccessToken, generateRefreshToken, referralCodeUser } from '../services/authService'
import { sendPasswordResetEmail, sendRegistrationEmail } from '../services/emailService';

// Define usedTokens object for storing used reset tokens
const usedTokens: { [key: string]: boolean } = {};

const Registration = async (req: Request, res: Response) => {
    try {
        const { sponsorById, firstName, lastName, dateOfBirth, gender, address, address2, city, state, zipCode, country, website, mobile, email, password, wallet } = req.body;

        // Simulate dummy payment success
        const requiredPaymentAmount = 125;
        if (Number(wallet) !== requiredPaymentAmount) {
            return res.status(400).json({ error: 'Invalid payment amount' });
        }
        // Check if sponsorById is valid
        if (sponsorById) {
            const sponsor = await referralCodeUser(sponsorById);
            if (!sponsor) {
                return res.status(400).json({ error: 'Invalid sponsorById' });
            }
        }
        //find email
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email address already exists' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Profile picture is required' });
        }

        // Extract file name from the path
        const profileFileName = req.file.path.split('\\').pop() || '';

        // Generate referral code
        let referralCode = '';
        const lastUser = await User.findOne({
            order: [['createdAt', 'DESC']],
        });

        if (!lastUser || !lastUser.referralCode) {
            // If no last user or referral code is empty, set referral code to '1'
            referralCode = '1';
        } else {
            const lastReferralCode = parseInt(lastUser.referralCode);
            if (lastReferralCode < 9999999) {
                // Increment referral code by 1
                referralCode = (lastReferralCode + 1).toString();
            } else {
                // Set referral code to '9999999' if it reaches the maximum
                referralCode = '9999999';
            }
        }

        const userData: UserAttributes = {
            sponsorById, firstName, lastName, dateOfBirth, gender, profile: profileFileName, address, address2,
            city, state, zipCode, country, website, mobile, email, password, wallet: requiredPaymentAmount, isRegistered: true, referralCode, // Assign the generated referral code
        };

        const user = await createUser(userData);
        try {
            await sendRegistrationEmail(email, firstName);
            res.status(201).json({ message: "User created successfully", user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error sending email" });
        }
    } catch (err) {
        console.error(err);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: 'Server error' });
    }
};

const Login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({ error: 'Invalid email' });
        if (!user.isRegistered)
            return res
                .status(400)
                .json({ error: 'Please complete the registration process.' });


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Password' });
        }

        const accessToken = await generateAccessToken(user.id, user.email);
        const refreshToken = await generateRefreshToken(user.id, user.email);

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
            token: accessToken,
            refreshToken: refreshToken,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const RefreshToken = (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ error: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET!) as JwtPayload;
   
        if (!decoded || typeof decoded !== 'object' || !decoded.hasOwnProperty('id')) {
            throw new Error('Invalid token payload');
        }
        const accessToken = jwt.sign(
            { id: decoded.id, email: decoded.email },
            process.env.JWT_SECRET!,
            {
                expiresIn: '30s',
            }
        );
        res.status(200).json({ accessToken });
    } catch (err) {
        return res.status(403).json({ error: 'Invalid refresh token' });
    }
};

const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: '20m',
        });
        await sendPasswordResetEmail(req.body.email, token);
        res.status(200).json({ message: 'Password reset instructions sent to your email' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    try {
        if (usedTokens[token]) {
            return res.status(400).json({ error: 'Token already used' });
        }

        const resetToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

        if (!resetToken) { return res.status(400).json({ error: 'Invalid or expired token' }) }

        const user = await User.findByPk(resetToken.userId);
        if (!user) { return res.status(404).json({ error: 'User not found' }) }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Add token to the usedTokens object
        usedTokens[token] = true;
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

export { Registration, Login, RefreshToken, requestPasswordReset, resetPassword };