import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create a transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: '879965001@smtp-brevo.com',
    pass: 'bT1AmhO7PD3RKEFf', // Replace with your actual Brevo API key
  },
});

export async function POST(request: Request) {
  try {
    const { email, verificationToken } = await request.json();

    if (!email || !verificationToken) {
      return NextResponse.json(
        { error: 'Email and verification token are required' },
        { status: 400 }
      );
    }

    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: {
        name: 'HEALIX Support',
        address: 'ghrissyasmine@gmail.com',
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

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 });
  }
}