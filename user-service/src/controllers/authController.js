// controller/userController.js

import User from "../models/userModel.js";
import fs from "fs";
import EmailService from "../services/emailService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import otpService from "../services/otpService.js";

dotenv.config();
// let otpAttempts = {}; // In-memory storage for tracking OTP attempts

const usedTokens = {};

const Registration = async (req, res) => {
  try {
    const {
      sponsorById,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      address,
      address2,
      city,
      state,
      zipCode,
      country,
      website,
      mobile,
      email,
      password,
      wallet,
    } = req.body;

    // Simulate dummy payment success
    const requiredPaymentAmount = "125";
    if (wallet !== requiredPaymentAmount) {
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    // Check if sponsorById is valid
    if (sponsorById) {
      const sponsor = await User.findOne({ where: { referralCode: sponsorById } });
      if (!sponsor) {
        return res.status(400).json({ error: "Invalid sponsorById" });
      }
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email address already exists" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Profile picture is required" });
    }

    // Extract file name from the path
    const profileFileName = req.file.path.split("\\").pop();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      sponsorById,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      profile: profileFileName,
      address,
      address2,
      city,
      state,
      zipCode,
      country,
      website,
      mobile,
      email,
      password: hashedPassword,
      wallet: requiredPaymentAmount, // Add 125 INR to the wallet
      isRegistered: true, // Set isRegistered to true
    });

    try {
      await EmailService.sendRegistrationEmail(email, firstName);
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error sending email" });
    }
    
  } catch (err) {
    console.log(err);
    if (req.file) {
      fs.unlinkSync(req.file.path); // Delete the file if an error occurs
    }
    res.status(500).json({ error: "Server error" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid email" });
    if (!user.isRegistered)
      return res
        .status(400)
        .json({
          error:
            "You are registered. Please complete the registration process.",
        });

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Password" });
    }

    // Generate JWT
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "20s", // Short-lived access token
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_JWT_SECRET,
      {
        expiresIn: "30d", // Long-lived refresh token
      }
    );

    res.status(200).json({
      message: "Login successful",
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
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

const RefreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: "Refresh token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "30s",
      }
    );
    res.status(200).json({ accessToken });
  } catch (err) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }
};

// const forgotPassword = async (req, res) => {
//   const { email, mobile } = req.body;
//   const otp = otpService.generateOTP();
//   const otpToken = otpService.generateOtpToken(otp);

//   try {
//     if (email) {
//       await otpService.sendEmail(email, otp);
//       res.status(200).json({ message: "OTP sent to email", otpToken });
//     } else if (mobile) {
//       await otpService.sendSMS(mobile, otp);
//       res.status(200).json({ message: "OTP sent to mobile", otpToken });
//     } else {
//       res.status(400).json({ error: "Email or mobile is required" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// };

// const verifyOtp = (req, res) => {
//   const { otp, otpToken } = req.body;

//   if (!otpAttempts[otpToken]) {
//     otpAttempts[otpToken] = 0;
//   }

//   if (otpAttempts[otpToken] >= 3) {
//     return res
//       .status(429)
//       .json({ error: "Too many attempts. Please try again after 10 minutes." });
//   }

//   try {
//     const decoded = jwt.verify(otpToken, process.env.OTP_SECRET);

//     if (decoded.otp === otp) {
//       otpAttempts[otpToken] = 0; // Reset attempts on successful verification
//       res.status(200).json({ message: "OTP verified successfully" });
//     } else {
//       otpAttempts[otpToken]++;
//       res.status(400).json({ error: "Invalid OTP" });
//     }
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// };

// const resetPassword = async (req, res) => {
//   const { email,mobile, newPassword } = req.body;

//   try {
//     // Find user by email or mobile
//     const user = await User.findOne({ where: { email } }) || await User.findOne({ where: { mobile } });

//     if (!user) {
//       return res.status(400).json({ error: "User not found" });
//     }
//     // Generate hashed password
//     const saltRounds = 10; // Define salt rounds
//     const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

//     // Update user's password
//     user.password = hashedPassword;
//     await user.save();

//     // Send response
//     return res.status(200).json({ message: "Password reset successfully" });
//   } catch (error) {
//     // Enhance error handling to provide more insight
//     console.error('Error resetting password:', error);

//     // Check if it's a Sequelize validation error
//     if (error.name === 'SequelizeValidationError') {
//       console.error('Validation error details:', error.errors.map(err => err.message));
//       return res.status(400).json({ error: 'Validation error. Please check your input.' });
//     }

//     // Check for other potential errors
//     return res.status(500).json({ error });
//   }
// };

//email with reset password==========================================================

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Include user ID in the token payload
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "20m",
    });

    await EmailService.sendPasswordResetEmail(email, token);

    res
      .status(200)
      .json({ message: "Password reset instructions sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Check if token exists in the usedTokens object
    if (usedTokens[token]) {
      return res.status(400).json({ error: "Token already used" });
    }

    const resetToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!resetToken) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Verify both email and user ID from the token payload
    const user = await User.findOne({ where: { id: resetToken.userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Add token to the usedTokens object
    usedTokens[token] = true;

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
//====================================================================

export {
  Registration,
  Login,
  RefreshToken,
  // forgotPassword,
  // verifyOtp,
  resetPassword,
  requestPasswordReset,
};
