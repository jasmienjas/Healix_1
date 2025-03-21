import nodemailer from 'nodemailer';

// Create a transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: '879965001@smtp-brevo.com',
    pass: 'bT1AmhO7PD3RKEFf',
  },
  debug: true, // Enable debug logging
  logger: true // Enable built-in logger
});

export async function sendResetPasswordEmail(email: string, resetToken: string) {
  console.log('Starting email send process...');
  console.log('Sending to:', email);
  console.log('Reset token:', resetToken);

  // Verify SMTP connection configuration
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
  } catch (error) {
    console.error('SMTP Verification Error:', error);
    throw new Error('Failed to verify SMTP connection');
  }

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: {
      name: 'HEALIX Support',
      address: 'ghrissyasmine@gmail.com'
    },
    to: email,
    subject: 'Reset Your Password - HEALIX',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You requested to reset your password. Click the link below to set a new password:</p>
        <p>
          <a href="${resetLink}" style="background-color: #023664; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>HEALIX Team</p>
      </div>
    `,
    text: `Reset your password by clicking this link: ${resetLink}`, // Plain text version
  };

  try {
    console.log('Attempting to send email with options:', mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Detailed send error:', error);
    throw new Error(`Failed to send reset password email: ${error.message}`);
  }
} 