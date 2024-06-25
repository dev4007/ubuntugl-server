// src/services/emailService.ts

import transporter from '../config/nodemailerConfig';

const sendRegistrationEmail = async (email: string, firstName: string) => {
  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: 'Welcome to Our App!',
      text: `Dear ${firstName}, Welcome to Our App! you are successfully registered`,
    });
  } catch (error) {
    console.error('Error sending registration email:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: 'Password Reset',
    html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export { sendRegistrationEmail, sendPasswordResetEmail };
