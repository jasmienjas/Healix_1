import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDoctorAppointments } from '@/services/api';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface PatientProfile {
  id: number;
  user: User;
}

interface DoctorProfile {
  id: number;
  user: User;
  specialty: string;
}

interface Appointment {
  id: string;
  patient: PatientProfile;
  doctor: DoctorProfile;
  appointment_datetime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'postponed';
  reason: string;
  created_at: string;
  updated_at: string;
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/login');
      return;
    }

    const fetchAppointments = async () => {
      try {
        console.log('Starting to fetch appointments...');
        const data = await getDoctorAppointments();
        console.log('Raw API response:', data);
        if (Array.isArray(data)) {
          console.log('First appointment:', data[0]);
        }
        setAppointments(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError(error instanceof Error ? error.message : 'Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  console.log('Current appointments state:', appointments);
  if (appointments.length > 0) {
    console.log('First appointment structure:', JSON.stringify(appointments[0], null, 2));
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
        <p className="text-gray-600">
          {appointments.length} upcoming appointment{appointments.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-600 rounded-lg p-3 text-center min-w-[60px]">
                        <div className="text-sm font-semibold">
                          {new Date(appointment.appointment_datetime).getDate()}
                        </div>
                        <div className="text-xs">
                          {new Date(appointment.appointment_datetime).toLocaleString("default", { month: "short" })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          Patient: {`${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Email: {appointment.patient.user.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          Time: {new Date(appointment.appointment_datetime).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {appointment.status}
                        </p>
                        {appointment.reason && (
                          <p className="text-sm text-gray-600">
                            Reason: {appointment.reason}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log('Postpone clicked for appointment:', appointment.id);
                            // TODO: Implement postpone
                          }}
                        >
                          Postpone
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => {
                            console.log('Cancel clicked for appointment:', appointment.id);
                            // TODO: Implement cancel
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 