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

export async function getDoctorAvailability(year: number, month: number) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log(`Fetching availability for ${year}-${month}`);
    const response = await fetch(
      `${API_BASE_URL}/api/accounts/doctor/availability/?year=${year}&month=${month}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }
    );

    const responseText = await response.text();
    console.log('Raw server response:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to fetch availability: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    console.log('Parsed response:', result);

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch availability');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    throw error;
  }
}

export async function updateDoctorAvailability(slots: any[]) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/accounts/doctor/availability/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slots }),
    });

    if (!response.ok) {
      throw new Error('Failed to update availability');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to update availability');
    }

    return result.data;
  } catch (error) {
    console.error('Error updating doctor availability:', error);
    throw error;
  }
}

export async function addDoctorAvailability(
  date: string,
  startTime: string,
  endTime: string,
  clinicName: string
) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Adding availability with data:', { date, startTime, endTime, clinicName });

    const response = await fetch(`${API_BASE_URL}/api/accounts/doctor/availability/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: date,
        startTime: startTime,
        endTime: endTime,
        clinicName: clinicName,
        action: 'add'  // Explicitly specify this is an add operation
      }),
    });

    const responseText = await response.text();
    console.log('Raw server response:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to add availability: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    if (!result.success) {
      throw new Error(result.message || 'Failed to add availability');
    }

    console.log('Successfully added availability:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error adding doctor availability:', error);
    throw error;
  }
}

export async function deleteDoctorAvailability(slotId: string) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Attempting to delete slot:', slotId);

    const response = await fetch(`${API_BASE_URL}/api/accounts/doctor/availability/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000'
      },
      credentials: 'include',
      body: JSON.stringify({
        id: slotId,
        action: 'delete'
      })
    });

    if (response.status === 502) {
      throw new Error('Backend service is temporarily unavailable. Please try again in a moment.');
    }

    const text = await response.text();
    console.log('Server response:', text);
    
    if (!response.ok) {
      throw new Error(`Failed to delete availability: ${response.status} ${text}`);
    }

    try {
      const result = JSON.parse(text);
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete availability');
      }
    } catch (e) {
      console.error('Error parsing response:', e);
      throw new Error(`Invalid response from server: ${text}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting doctor availability:', error);
    throw error;
  }
}