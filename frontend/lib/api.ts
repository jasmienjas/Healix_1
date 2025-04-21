// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

console.log('Environment Variables:', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_URL,
});

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
      
      if (response.access) {
        localStorage.setItem('access_token', response.access);
        return {
          ...response,
          access_token: response.access
        };
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: any) => {
    try {
      console.log('Attempting registration with:', userData);
      const response = await apiCall('api/accounts/register/', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      console.log('Registration response:', response);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
  },
};

// Doctor API functions
export const doctorApi = {
  getProfile: async () => {
    try {
      console.log('Fetching doctor profile...');
      const response = await apiCall('api/accounts/doctor/profile/');
      console.log('Doctor profile response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      throw error;
    }
  },
  
  updateProfile: async (data: FormData | any) => {
    try {
      console.log('Updating doctor profile with:', data);
      const response = await apiCall('api/accounts/doctor/profile/', {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data),
      });
      console.log('Profile update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      throw error;
    }
  },
};

// Patient API functions
export const patientApi = {
  getProfile: async () => {
    try {
      console.log('Fetching patient profile...');
      const response = await apiCall('api/accounts/patient/profile/');
      console.log('Patient profile response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      throw error;
    }
  },
  
  updateProfile: async (data: any) => {
    try {
      console.log('Updating patient profile with:', data);
      const response = await apiCall('api/accounts/patient/profile/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('Profile update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating patient profile:', error);
      throw error;
    }
  },
};

// Appointments API functions
export const appointmentsApi = {
  getDoctorAppointments: async () => {
    const response = await apiCall('api/accounts/appointments/doctor-schedule/');
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch appointments');
    }
    return response.data || [];  // Return empty array if no data
  },

  getPatientAppointments: async () => {
    const response = await apiCall('api/accounts/appointments/schedule/');
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch appointments');
    }
    return response;  // Return the entire response object
  },

  createAppointment: async (appointmentData: FormData | {
    doctor: number;
    appointment_date: string;
    start_time: string;
    end_time: string;
    reason?: string;
  }) => {
    const isFormData = appointmentData instanceof FormData;
    return apiCall('api/accounts/appointments/create/', {
      method: 'POST',
      body: isFormData ? appointmentData : JSON.stringify(appointmentData),
    });
  },

  postponeAppointment: (appointmentId: number, data: {
    appointment_date: string;
    start_time: string;
    end_time: string;
    postpone_reason: string;
  }) =>
    apiCall(`api/accounts/appointments/${appointmentId}/postpone/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  cancelAppointment: (appointmentId: number, data: {
    cancellation_message: string;
  }) =>
    apiCall(`api/accounts/appointments/${appointmentId}/cancel/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Export the API object
export const api = {
  auth: authApi,
  appointments: appointmentsApi,
  doctor: doctorApi,
  patient: patientApi,
};