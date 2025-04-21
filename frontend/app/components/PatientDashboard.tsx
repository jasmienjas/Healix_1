import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { ConfirmDialog } from './ConfirmDialog';
import { toast } from 'sonner';
import { cancelAppointment } from "@/services/api";
import { searchDoctors } from '@/services/doctor';
import { format } from 'date-fns';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Doctor {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  specialty: string;
  office_address: string;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Appointment {
  id: number;
  patient: Patient;
  doctor: Doctor;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'postponed';
  reason: string;
  created_at: string;
  updated_at: string;
}

interface DoctorSearchResult {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  specialty: string;
  office_address: string;
  office_number: string;
}

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // New state for doctor search
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DoctorSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const response = await api.appointments.getPatientAppointments();
      if (!response.success) {
        throw new Error(response.message);
      }
      console.log('Appointments data:', JSON.stringify(response.data, null, 2));
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch appointments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await cancelAppointment(selectedAppointment, "Cancelled by patient");
      
      setAppointments(appointments.map(appointment => 
        appointment.id === Number(selectedAppointment)
          ? { ...appointment, status: 'cancelled' }
          : appointment
      ));

      setIsConfirmDialogOpen(false);
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchDoctors({
        name: searchTerm,
        specialty: '',
        location: ''
      });
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to search doctors');
      toast.error('Failed to search doctors');
    } finally {
      setIsSearching(false);
    }
  };

  const formatAppointmentDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    return {
      date: format(dateObj, 'MMMM d, yyyy'),
      time: format(dateObj, 'h:mm a')
    };
  };

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

  return (
    <div className="space-y-6 p-6">
      {/* Greeting */}
      <section>
        <h1 className="text-3xl font-bold mb-2">
          Hello, {appointments.length > 0 ? appointments[0].patient.first_name : 'there'}
        </h1>
      </section>

      {/* Appointments Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => {
              console.log('Individual appointment data:', JSON.stringify(appointment, null, 2));
              const { date, time } = formatAppointmentDateTime(appointment.appointment_date, appointment.start_time);
              const isPastAppointment = new Date(`${appointment.appointment_date}T${appointment.end_time}`) < new Date();

              return (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Left: Date display */}
                      <div className="bg-blue-50 text-blue-600 rounded-xl p-4 text-center min-w-[100px] shadow-sm">
                        <div className="text-2xl font-bold">
                          {new Date(appointment.appointment_date).getDate()}
                        </div>
                        <div className="text-sm font-medium">
                          {new Date(appointment.appointment_date).toLocaleString("default", { month: "short" })}
                        </div>
                        <div className="text-xs mt-1 text-blue-500">
                          {new Date(appointment.appointment_date).toLocaleString("default", { weekday: "short" })}
                        </div>
                      </div>

                      {/* Middle: Doctor and appointment details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold">
                            Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {/* Time */}
                          <p className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {time}
                          </p>
                          
                          {/* Location */}
                          <p className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {appointment.doctor.office_address}
                          </p>

                          {/* Reason */}
                          {appointment.reason && (
                            <p className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {appointment.reason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Action buttons */}
                      {!isPastAppointment && appointment.status !== 'cancelled' && (
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedAppointment(appointment.id.toString());
                              setIsConfirmDialogOpen(true);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-gray-500 text-center py-4">No appointments scheduled</p>
          )}
        </div>
      </section>

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleCancelAppointment}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment?"
      />
    </div>
  );
} 