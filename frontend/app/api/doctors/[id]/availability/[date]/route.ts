import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config';

export async function GET(
  request: Request,
  { params }: { params: { id: string; date: string } }
) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/appointments/availability/${params.id}/${params.date}/`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch availability: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data into time slots
    const timeSlots = data.slots.map((slot: any) => ({
      id: slot.id,
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_available: slot.is_available
    }));

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
} 