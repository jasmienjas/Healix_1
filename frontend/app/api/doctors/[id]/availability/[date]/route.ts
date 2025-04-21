import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config';

export async function GET(
  request: Request,
  { params }: { params: { id: string; date: string } }
) {
  try {
    console.log(`Fetching availability for doctor ${params.id} on date ${params.date}`);
    
    const response = await fetch(
      `${API_BASE_URL}/api/accounts/appointments/availability/${params.id}/${params.date}/`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.message || `Failed to fetch availability: ${response.status}`);
    }

    const data = await response.json();
    console.log('Availability data:', data);

    return NextResponse.json(data.slots || []);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch availability',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 