// emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider here
    auth: {
      user: process.env.NODEMAILER_USER, // Your email address
      pass: process.env.NODEMAILER_PASS, // Your password
    },
  })

const sendRegistrationEmail = async (email, firstName) => {
  try {
    // Send registration email logic
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: 'Welcome to Our App! ',
      text: `Dear ${firstName}, Welcome to Our App! you are successfully registered`,
    });
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (email, token) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  const mailOptions = {
   from: process.env.NODEMAILER_USER,
    to: email,
    subject: 'Password Reset',
    html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};


export default { sendRegistrationEmail,sendPasswordResetEmail };
