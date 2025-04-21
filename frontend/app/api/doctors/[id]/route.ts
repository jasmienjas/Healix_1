import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Fetching doctor details for ID: ${params.id}`);
    const response = await fetch(`${API_BASE_URL}/api/accounts/doctors/${params.id}/`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.message || `Failed to fetch doctor: ${response.status}`);
    }

    const data = await response.json();
    console.log('Doctor details response:', data);

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch doctor details');
    }

    return NextResponse.json(data.data);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch doctor details',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 