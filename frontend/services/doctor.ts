import { API_BASE_URL } from '@/config';  

interface DoctorSignupData {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
  officeNumber: string
  officeAddress: string
  birthDate: string
  medicalLicense: File | null
  phdCertificate: File | null
}

export async function signupDoctor(data: DoctorSignupData) {
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  const url = `${baseUrl}api/accounts/register/`;
  console.log('API Base URL:', API_BASE_URL);
  console.log('Full URL:', url);

  // Create a valid username from email (before the @ symbol)
  const username = data.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');

  const formData = new FormData()
  
  // Map frontend field names to backend field names
  formData.append("username", username);
  formData.append("first_name", data.firstName);
  formData.append("last_name", data.lastName);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("dob", data.birthDate);
  formData.append("phone_number", data.phoneNumber);
  formData.append("office_number", data.officeNumber);
  formData.append("office_address", data.officeAddress);
  formData.append("user_type", "doctor");

  if (data.medicalLicense) {
    formData.append("medical_license", data.medicalLicense);
  }
  if (data.phdCertificate) {
    formData.append("phd_certificate", data.phdCertificate);
  }

  console.log('Form Data:', Object.fromEntries(formData.entries()));

  try {
    console.log('Attempting fetch...');
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      mode: 'cors',
    })

    console.log('Response status:', response.status);
    const result = await response.json()
    console.log('Response data:', result);

    if (!response.ok) {
      // Log the full error response
      console.error('Server error response:', result);
      throw new Error(result.detail || result.error || JSON.stringify(result));
    }

    return result
  } catch (error) {
    console.error('Detailed error:', error);
    throw error
  }
}

export async function checkDoctorApprovalStatus(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/doctors/approval-status?email=${email}`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to check status')
    }

    return result.status
  } catch (error) {
    throw error
  }
} 