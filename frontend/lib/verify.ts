import nodemailer from 'nodemailer';

// Create a transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: '879965001@smtp-brevo.com',
    pass: 'bT1AmhO7PD3RKEFf', // Replace with the actual SMTP password
  },
  debug: true, // Enable debug logging
  logger: true, // Enable built-in logger
});

// Function to send email verification
export async function sendVerificationEmail(email: string, verificationToken: string): Promise<nodemailer.SentMessageInfo> {
  console.log('Starting email send process...');
  console.log('Sending to:', email);
  console.log('Verification token:', verificationToken);

  // Verify SMTP connection configuration
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
  } catch (error) {
    console.error('SMTP Verification Error:', error);
    throw new Error('Failed to verify SMTP connection');
  }

  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

  const mailOptions: nodemailer.SendMailOptions = {
    from: {
      name: 'HEALIX Support',
      address: 'ghrissyasmine@gmail.com', // Replace with your valid email address
    },
    to: email,
    subject: 'Verify Your Email - HEALIX',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Thank you for registering with HEALIX. Please click the link below to verify your email address:</p>
        <p>
          <a href="${verificationLink}" style="background-color: #023664; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't register for an account, please ignore this email.</p>
        <p>Best regards,<br>HEALIX Team</p>
      </div>
    `,
    text: `Verify your email by clicking this link: ${verificationLink}`, // Plain text version
  };

  try {
    console.log('Attempting to send email with options:', mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error: any) {
    console.error('Detailed send error:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
