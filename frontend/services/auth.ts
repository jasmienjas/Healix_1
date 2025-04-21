import { API_BASE_URL } from '@/config';
import { sendVerificationEmail } from '@/lib/verify';
import { JWT_STORAGE_KEY, REFRESH_TOKEN_KEY, USER_STORAGE_KEY } from '@/lib/constants';
import crypto from 'crypto';

interface LoginResponse {
  success: boolean;
  user: {
    id: number;
    username: string;
    email: string;
    user_type: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export const auth = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('Starting login process for:', email);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store auth data
      localStorage.setItem(JWT_STORAGE_KEY, data.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      
      console.log('Stored user data:', data.user);
      console.log('User type:', data.user.user_type);

      return {
        success: true,
        user: data.user,
        tokens: {
          access: data.access,
          refresh: data.refresh,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(JWT_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  getUser: () => {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isEmailVerified: (email: string): boolean => {
    return !localStorage.getItem(`healix_unverified_${email}`);
  },

  requestPasswordReset: async (email: string) => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset password link');
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Failed to send reset password link',
      };
    }
  },

  signupWithVerification: async (userData: any) => {
    try {
      // Generate verification token
      const verificationToken = crypto.randomUUID();
      const verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Add verification data to user data
      const userWithVerification = {
        ...userData,
        emailVerified: false,
        verificationToken,
        verificationTokenExpiry,
      };

      // Make the signup API call
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userWithVerification),
      });

      const data = await response.json();

      if (response.ok) {
        // Send verification email
        await sendVerificationEmail(userData.email, verificationToken);
        return { success: true, message: 'Verification email sent' };
      } else {
        throw new Error(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: error.message };
    }
  },
};

export default auth; 