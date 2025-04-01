export async function sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
  try {
    const response = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, verificationToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send verification email');
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}