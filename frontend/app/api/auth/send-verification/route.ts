import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate verification token on server side
    const verificationToken = crypto.randomUUID();
    const verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Update user with verification token
    await prisma.user.update({
      where: { email },
      data: {
        verificationToken,
        verificationTokenExpiry,
        emailVerified: false,
      },
    });

    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: {
        name: 'HEALIX Support',
        address: process.env.SMTP_FROM_EMAIL || 'ghrissyasmine@gmail.com',
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
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
} 