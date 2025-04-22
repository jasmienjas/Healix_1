export const sendVerificationEmail = async (email: string, verificationToken: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accounts/send-verification/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        verificationToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send verification email');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};