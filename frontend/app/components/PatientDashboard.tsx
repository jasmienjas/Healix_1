import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';
import { ConfirmDialog } from './ConfirmDialog';
import { toast } from 'sonner';
import { cancelAppointment } from "@/services/api";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Doctor {
  id: number;
  user: User;
  specialty: string;
  office_address: string;
}

interface Patient {
  id: number;
  user: User;
}

interface Appointment {
  id: number;
  patient: Patient;
  doctor: Doctor;
  appointment_datetime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'postponed';
  reason: string;
  created_at: string;
  updated_at: string;
}

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const fetchAppointments = async () => {
    try {
      console.log('Fetching patient appointments...');
      const data = await api.appointments.getPatientAppointments();
      console.log('Raw API response:', data);
      
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Failed to fetch appointments');
      }
      
      setAppointments(data.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error instanceof Error ? error.message : 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await cancelAppointment(selectedAppointment);
      
      setAppointments(appointments.map(appointment => 
        appointment.id === Number(selectedAppointment)
          ? { ...appointment, status: 'cancelled' }
          : appointment
      ));

      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
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
      {/* Quick Actions Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Book Appointment</h3>
            <p className="text-sm text-gray-600">Schedule a new appointment with a doctor</p>
            <Button className="mt-4" variant="outline" asChild>
              <a href="/book-appointment">Book Now</a>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Medical Records</h3>
            <p className="text-sm text-gray-600">View your medical history and records</p>
            <Button className="mt-4" variant="outline" asChild>
              <a href="/medical-records">View Records</a>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Find Doctor</h3>
            <p className="text-sm text-gray-600">Search for doctors by specialty</p>
            <Button className="mt-4" variant="outline" asChild>
              <a href="/find-doctor">Search</a>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Appointments Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => {
              const { date, time } = formatDateTime(appointment.appointment_datetime);
              const isPastAppointment = new Date(appointment.appointment_datetime) < new Date();

              return (
                <Card key={appointment.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      {/* Left: Date display */}
                      <div className="bg-blue-50 text-blue-600 rounded-xl p-4 text-center min-w-[100px] shadow-sm">
                        <div className="text-2xl font-bold">
                          {new Date(appointment.appointment_datetime).getDate()}
                        </div>
                        <div className="text-sm font-medium">
                          {new Date(appointment.appointment_datetime).toLocaleString("default", { month: "short" })}
                        </div>
                        <div className="text-xs mt-1 text-blue-500">
                          {new Date(appointment.appointment_datetime).toLocaleString("default", { weekday: "short" })}
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
                        
                        <div className="text-sm text-gray-600 space-y-1">
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
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/appointments/${appointment.id}`}>View Details</a>
                        </Button>
                        
                        {/* Cancel button - only show for non-cancelled, future appointments */}
                        {!isPastAppointment && appointment.status !== 'cancelled' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(String(appointment.id));
                              setIsConfirmDialogOpen(true);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          )}
        </div>
      </section>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleCancelAppointment}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This action cannot be undone."
      />
    </div>
  );
} 