// API configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8000';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('access_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  // Ensure endpoint starts with a slash and remove any duplicate slashes
  const cleanEndpoint = `/${endpoint.replace(/^\/+/, '')}`;
  
  console.log('Making API call to:', `${API_URL}${cleanEndpoint}`);
  
  const response = await fetch(`${API_URL}${cleanEndpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('API Error:', error);
    throw new Error(error.detail || error.error || 'API call failed');
  }

  return response.json();
}

// Auth API functions
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiCall('api/accounts/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    console.log('Login response:', response);
    
    if (!response.access || !response.user) {
      throw new Error('Invalid response format from server');
    }
    
    return response;
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

  updateProfile: (profileData: any) =>
    apiCall('api/accounts/doctor/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  searchDoctors: (query: string) =>
    apiCall(`api/accounts/doctors/search/?query=${encodeURIComponent(query)}`),
};

// Appointments API functions
export const appointmentsApi = {
  getDoctorAppointments: () =>
    apiCall('api/accounts/appointments/doctor-schedule/'),

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