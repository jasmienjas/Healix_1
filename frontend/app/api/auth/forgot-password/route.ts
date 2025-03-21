import { NextResponse } from 'next/server';
import { sendResetPasswordEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  console.log('Password reset endpoint hit!');

  try {
    const { email } = await request.json();
    console.log('Processing reset for email:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find or create user (since we're testing)
    let user = await prisma.user.findUnique({
      where: { email },
    });

    console.log('Found existing user:', user);

    if (!user) {
      // For testing purposes, create a user if they don't exist
      user = await prisma.user.create({
        data: {
          email,
          password: 'placeholder', // This will be updated when they reset
        },
      });
      console.log('Created new user:', user);
    }

    // Generate and save reset token
    const resetToken = crypto.randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    console.log('Generated token:', resetToken);
    console.log('Token expiry:', resetTokenExpiry);
    
    // Save the reset token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    console.log('Updated user with token:', {
      id: updatedUser.id,
      email: updatedUser.email,
      resetToken: updatedUser.resetToken,
      resetTokenExpiry: updatedUser.resetTokenExpiry
    });

    // Send reset password email
    await sendResetPasswordEmail(email, resetToken);
    console.log('Reset email sent successfully');

    return NextResponse.json({
      message: 'Password reset link sent successfully'
    });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset', details: error.message },
      { status: 500 }
    );
  }
} 