import { API_BASE_URL } from '../config'

// Helper function to get token
function getToken() {
  return localStorage.getItem('access_token')
}

export async function getPatientAppointments() {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/api/appointments/schedule/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch appointments')
    }
    
    const data = await response.json()
    console.log('Patient appointments:', data)
    return data
  } catch (error) {
    console.error('Error fetching patient appointments:', error)
    throw error
  }
}

export async function getDoctorAppointments() {
  try {
    const token = getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    console.log('Fetching doctor appointments...')
    const response = await fetch(`${API_BASE_URL}/api/accounts/appointments/doctor-schedule/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      const text = await response.text()
      console.error('Server response:', text)
      throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('Raw API response:', result)
    
    // Check if the response has the expected structure
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch appointments')
    }
    
    // Ensure we're returning the data array and it's properly formatted
    const appointments = result.data || []
    console.log('Processed appointments:', appointments)
    return appointments
  } catch (error) {
    console.error('Error fetching doctor appointments:', error)
    throw error
  }
}

export async function getDoctorProfile() {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/accounts/doctor/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch doctor profile');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch doctor profile');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error;
  }
} 