// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  
  // Don't set Content-Type for FormData
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  // Ensure endpoint starts with a slash and remove any duplicate slashes
  const cleanEndpoint = `/${endpoint.replace(/^\/+/, '')}`;
  const fullUrl = `${API_URL}${cleanEndpoint}`;
  
  console.log('API Call Details:', {
    url: fullUrl,
    method: options.method || 'GET',
    headers: headers,
    body: options.body instanceof FormData 
      ? Object.fromEntries((options.body as FormData).entries())
      : options.body 
        ? JSON.parse(options.body as string) 
        : null
  });
  
  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      credentials: 'include',
      mode: 'cors',
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText,
        requestDetails: {
          url: fullUrl,
          method: options.method || 'GET',
          headers: headers,
          body: options.body instanceof FormData 
            ? Object.fromEntries((options.body as FormData).entries())
            : options.body
        }
      });
      
      let error;
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        error = { detail: errorText };
      }
      
      throw new Error(error.detail || error.message || error.error || 'API call failed');
    }

    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  } catch (error) {
    console.error('Network error:', error);
    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please check if the server is running and try again.');
      } else if (error.message.includes('SSL')) {
        throw new Error('SSL connection error. Please check your connection settings.');
      }
    }
    throw error;
  }
}

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await apiCall('api/accounts/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Login response:', response);
      
      if (!response.access || !response.user) {
        throw new Error('Invalid response format from server');
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: (userData: any) =>
    apiCall('/api/accounts/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  verifyEmail: (token: string) =>
    apiCall('/api/accounts/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),

  forgotPassword: (email: string) =>
    apiCall('/api/accounts/forgot-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    apiCall('/api/accounts/reset-password/', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
};

// Doctor API functions
export const doctorApi = {
  getAvailability: () =>
    apiCall('api/accounts/doctor/availability/'),

  updateAvailability: (availabilityData: any) =>
    apiCall('api/accounts/doctor/availability/', {
      method: 'POST',
      body: JSON.stringify(availabilityData),
    }),

  getProfile: () =>
    apiCall('api/accounts/doctor/profile/'),

  updateProfile: (profileData: any) => {
    // If it's already FormData, use it directly
    if (profileData instanceof FormData) {
      return apiCall('api/accounts/doctor/profile/', {
        method: 'POST',
        body: profileData,
      });
    }

    // Convert regular object to FormData
    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // Convert numbers to strings
        formData.append(key, value.toString());
      }
    });

    return apiCall('api/accounts/doctor/profile/', {
      method: 'POST',
      body: formData,
    });
  },

  searchDoctors: (query: string) =>
    apiCall(`api/accounts/doctors/search/?query=${encodeURIComponent(query)}`),
};

// Appointments API functions
export const appointmentsApi = {
  getDoctorAppointments: async () => {
    const response = await apiCall('api/accounts/appointments/doctor-schedule/');
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch appointments');
    }
    return response.data;  // Return just the appointments array
  },

  getPatientAppointments: () =>
    apiCall('api/accounts/appointments/schedule/'),

  createAppointment: (appointmentData: any) =>
    apiCall('api/accounts/appointments/', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),

  postponeAppointment: (appointmentId: number, data: any) =>
    apiCall(`api/accounts/appointments/${appointmentId}/postpone/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  cancelAppointment: (appointmentId: number, data: any) =>
    apiCall(`api/accounts/appointments/${appointmentId}/cancel/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const api = {
  auth: authApi,
  appointments: appointmentsApi,
  doctor: doctorApi,
};