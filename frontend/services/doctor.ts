import { API_BASE_URL } from '@/config';

interface DoctorSignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    officeNumber: string;
    officeAddress: string;
    birthDate: string;
    licenseNumber: string;
    medicalLicense: File | null;
    phdCertificate: File | null;
}

export async function signupDoctor(data: DoctorSignupData) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/register/doctor/`;
    
    console.log('Making API call to:', url);

    try {
        // Create FormData object to handle file uploads
        const formData = new FormData();
        
        // Add all text fields
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('officeNumber', data.officeNumber);
        formData.append('officeAddress', data.officeAddress);
        formData.append('birthDate', data.birthDate);
        formData.append('licenseNumber', data.licenseNumber);

        // Add files if they exist
        if (data.medicalLicense) {
            formData.append('medicalLicense', data.medicalLicense);
        }
        if (data.phdCertificate) {
            formData.append('phdCertificate', data.phdCertificate);
        }

        console.log('Sending data:', {
            ...data,
            password: '***',
            medicalLicense: data.medicalLicense ? `File: ${data.medicalLicense.name}` : null,
            phdCertificate: data.phdCertificate ? `File: ${data.phdCertificate.name}` : null,
            licenseNumber: data.licenseNumber
        });

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header, let the browser set it with the boundary
            headers: {
                'Accept': 'application/json',
            },
        });

        console.log('Response status:', response.status);
        
        // Get the raw response text first
        const responseText = await response.text();
        console.log('Raw response text:', responseText);

        // Try to parse the response as JSON
        let result;
        try {
            result = JSON.parse(responseText);
            console.log('Parsed response:', result);
        } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            throw new Error('Server returned invalid JSON');
        }

        if (!response.ok) {
            const errorMessage = result.message || result.error || 'Registration failed';
            throw new Error(errorMessage);
        }

        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export async function checkDoctorApprovalStatus(email: string) {
    const url = `http://127.0.0.1:8000/api/accounts/doctor/approval-status/${email}/`;
    
    try {
        const response = await fetch(url);
        console.log('Status check response:', response.status);

        const result = await response.json();
        console.log('Status check result:', result);

        if (!response.ok) {
            throw new Error(result.message || 'Failed to check status');
        }

        return result.status;
    } catch (error) {
        console.error('Status check error:', error);
        throw error;
    }
}

interface SearchDoctorParams {
  name?: string;
  location?: string;
  specialty?: string;
  min_experience?: number;
  max_experience?: number;
  sort_by?: 'name' | 'experience' | 'fee';
  sort_order?: 'asc' | 'desc';
}

export async function searchDoctors(params: SearchDoctorParams) {
  try {
    const queryParams = new URLSearchParams();
    
    // Add all non-empty parameters to the query
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const url = `${API_BASE_URL}/api/accounts/doctors/search/?${queryParams.toString()}`;
    console.log('Searching doctors with URL:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Server response:', text);
      throw new Error(`Failed to search doctors: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Search results:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to search doctors');
    }

    return result.data || [];
  } catch (error) {
    console.error('Error searching doctors:', error);
    throw error;
  }
}