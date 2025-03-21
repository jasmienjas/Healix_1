import { NextResponse } from 'next/server';
import { sendResetPasswordEmail } from '@/lib/email';

export async function POST(request: Request) {
  console.log('Password reset endpoint hit!'); // Basic verification log

  try {
    const body = await request.json();
    console.log('Request body:', body); // Log the request body

    const { email } = body;
    console.log('Processing reset for email:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate a reset token and save it to the database
    const resetToken = crypto.randomUUID();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    console.log('About to send email...'); // Log before email send attempt

    try {
      // Send reset password email
      await sendResetPasswordEmail(email, resetToken);
      console.log('Reset email sent successfully');

      return NextResponse.json({
        message: 'Password reset link sent successfully'
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email', details: emailError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset', details: error.message },
      { status: 500 }
    );
  }
} 