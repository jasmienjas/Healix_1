'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import Layout from '@/app/components/layout';
import { format } from 'date-fns';
import { MapPin, Clock, Phone, Mail, Calendar as CalendarIcon } from 'lucide-react';
import Image from 'next/image';

interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface Doctor {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    user_type: string;
  };
  specialty: string;
  office_address: string;
  office_number: string;
  phone_number: string;
  profile_picture: string | null;
  profile_picture_url: string | null;
  appointment_cost: string | number;
  office_hours_start: string;
  office_hours_end: string;
  bio: string;
  years_of_experience: number;
  education: string;
}

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract name from username
  const getDoctorName = (username: string) => {
    const nameParts = username.replace('dr_', '').split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1));
    return nameParts.join(' ');
  };

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/doctors/${params.id}`);
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.message || 'Failed to fetch doctor details');
        }

        if (!responseData) {
          throw new Error('No data received from server');
        }

        setDoctor(responseData);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError(err instanceof Error ? err.message : 'Failed to load doctor information');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [params.id]);

  // Fetch available slots when date is selected
  useEffect(() => {
    if (!selectedDate || !doctor) return;

    const fetchAvailability = async () => {
      try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        console.log(`Fetching availability for date: ${formattedDate}`);
        
        const response = await fetch(`/api/doctors/${doctor.id}/availability/${formattedDate}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch availability');
        }

        console.log('Received availability data:', data);
        setAvailableSlots(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching availability:', err);
        setAvailableSlots([]);
      }
    };

    fetchAvailability();
  }, [selectedDate, doctor]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500">{error || 'Doctor not found'}</p>
          <Button 
            onClick={() => router.back()} 
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }

  const doctorName = getDoctorName(doctor.user.username);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Doctor Info Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden flex-shrink-0 border-2 border-blue-100">
                {doctor.profile_picture ? (
                  <Image
                    src={doctor.profile_picture}
                    alt={`Dr. ${doctorName}`}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const imgElement = e.currentTarget;
                      const parentElement = imgElement.parentElement;
                      if (parentElement) {
                        imgElement.style.display = 'none';
                        const fallbackElement = parentElement.querySelector('.fallback-initials');
                        if (fallbackElement instanceof HTMLElement) {
                          fallbackElement.style.display = 'flex';
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="fallback-initials w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-semibold text-blue-500">
                      {doctorName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>

              {/* Doctor Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Dr. {doctorName}
                </h1>
                <p className="text-xl text-blue-600 font-medium mb-4">
                  {doctor.specialty}
                </p>
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    {doctor.office_address}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5 text-gray-400" />
                    Office Hours: {doctor.office_hours_start} - {doctor.office_hours_end}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-5 w-5 text-gray-400" />
                    {doctor.phone_number}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-5 w-5 text-gray-400" />
                    {doctor.user.email}
                  </p>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-lg font-semibold text-gray-900">
                    Consultation Fee: ${doctor.appointment_cost}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">About</h2>
                <p className="text-gray-600">{doctor.bio}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-3">Education & Experience</h2>
                <p className="text-gray-600 mb-2">{doctor.education}</p>
                <p className="text-gray-600">{doctor.years_of_experience} years of experience</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-blue-500" />
              Book Appointment
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Date</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
                {selectedDate ? (
                  <>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={slot.is_available ? "outline" : "ghost"}
                            disabled={!slot.is_available}
                            onClick={() => {
                              router.push(`/book-appointment/${doctor.id}/${format(selectedDate, 'yyyy-MM-dd')}/${slot.id}`);
                            }}
                            className="w-full"
                          >
                            {slot.start_time} - {slot.end_time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">No available slots for this date</p>
                        <p className="text-sm text-gray-400 mt-2">Please try selecting a different date</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">Please select a date to view available slots</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
} 