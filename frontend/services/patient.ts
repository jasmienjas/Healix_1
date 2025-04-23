import { API_BASE_URL } from '@/config';

interface PatientSignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    birthDate: string;
    verificationToken: string;
}

export async function signupPatient(data: PatientSignupData) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/register/patient/`;
    
    console.log('Making API call to:', url);

    try {
        const requestData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            phoneNumber: data.phoneNumber,
            birthDate: data.birthDate,
            verificationToken: data.verificationToken
        };

        console.log('Sending data:', { ...requestData, password: '***', verificationToken: '***' });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestData)
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