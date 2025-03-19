import { NextResponse } from 'next/server';
import { sendResetPasswordEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a reset token and save it to the database
    const resetToken = crypto.randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Send reset password email
    await sendResetPasswordEmail(email, resetToken);

    return NextResponse.json({
      message: 'Password reset link sent successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset' },
      { status: 500 }
    );
  }
} 