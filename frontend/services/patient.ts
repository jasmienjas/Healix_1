import { API_BASE_URL } from '@/config';

interface PatientSignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    birthDate: string;
}

export async function signupPatient(data: PatientSignupData) {
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
    const url = `${baseUrl}api/accounts/register/patient/`;
    
    console.log('Making API call to:', url);
    console.log('With data:', data);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                phoneNumber: data.phoneNumber,
                birthDate: data.birthDate,
                user_type: 'patient'
            }),
            mode: 'cors',
        });

        const result = await response.json();
        console.log('Raw API Response:', result);

        if (!response.ok) {
            // Convert the error message object to a string if necessary
            const errorMessage = typeof result.message === 'object' 
                ? JSON.stringify(result.message) 
                : result.message || 'Registration failed';
            throw new Error(errorMessage);
        }

        return result;
    } catch (error) {
        console.error('Detailed API Error:', error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error('An unexpected error occurred');
    }
} 