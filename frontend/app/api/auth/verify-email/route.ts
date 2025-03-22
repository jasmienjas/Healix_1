import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface VerifyEmailRequest {
  token: string;
}

export async function POST(request: Request) {
  try {
    const body: VerifyEmailRequest = await request.json();
    console.log('Received email verification request with data:', { token: body.token });

    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find the user with this verification token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    console.log('Found user:', user ? 'yes' : 'no');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid verification token' },
        { status: 400 }
      );
    }

    // Update the user's email as verified and clear the verification token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    console.log('Email verified successfully for user:', updatedUser.email);

    return NextResponse.json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}