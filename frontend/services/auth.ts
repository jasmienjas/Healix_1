import { API_BASE_URL } from '@/config';

export async function login(email: string, password: string) {
    const url = `${API_BASE_URL}/api/accounts/login/`;
    
    console.log('Making login API call to:', url);
    const credentials = { email, password };
    console.log('With credentials:', credentials);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        const data = await response.json();
        console.log('Login API Response:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        if (data.success) {
            // Store user data and tokens
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.access);
            localStorage.setItem('user_type', data.user.user_type);
            
            // Also set the token as a cookie
            document.cookie = `healix_auth_token=${data.access}; path=/; SameSite=Lax`;
            document.cookie = `user_type=${data.user.user_type}; path=/; SameSite=Lax`;
        }

        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function logout() {
    try {
        // Clear all cookies
        document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.split('=');
            document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        });

        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('user_type');

        // Make a logout request to the backend if needed
        // await fetch(`${API_BASE_URL}/api/accounts/logout/`, {
        //     method: 'POST',
        //     credentials: 'include',
        // });

        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
}

export function isEmailVerified(email: string): boolean {
    return !localStorage.getItem(`healix_unverified_${email}`);
}

export async function requestPasswordReset(email: string) {
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
} 