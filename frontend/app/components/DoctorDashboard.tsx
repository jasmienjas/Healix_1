import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDoctorAppointments, getDoctorProfile } from '@/services/api';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DoctorAvailability from './DoctorAvailability';
import { api } from '@/lib/api';
import { PostponeDialog } from './PostponeDialog';
import { CancelDialog } from './CancelDialog';
import { toast } from 'sonner';
import Link from 'next/link';
import { format } from 'date-fns';
import { ConfirmDialog } from './ConfirmDialog';

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
  patient: number;
  patient_name: string;
  patient_email: string;
  doctor: number;
  doctor_name: string;
  doctor_email: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'postponed';
  reason: string;
  created_at: string;
  updated_at: string;
}

interface DoctorInfo {
  first_name: string;
  last_name: string;
}

function formatAppointmentDateTime(date: string, time: string) {
  const dateObj = new Date(`${date}T${time}`);
  return {
    date: format(dateObj, 'MMMM d, yyyy'),
    time: format(dateObj, 'h:mm a')
  };
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState<DoctorInfo | null>(null);
  const router = useRouter();
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [isPostponeDialogOpen, setIsPostponeDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Profile link section
  const profileLink = (
    <div className="mb-6 flex justify-end">
      <Link
        href="/profile"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        View Profile
      </Link>
    </div>
  );

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/login');
      return;
    }

    const fetchAppointments = async () => {
      try {
        console.log('Fetching doctor appointments...');
        const response = await api.appointments.getDoctorAppointments();
        console.log('Raw API response:', response);
        
        if (!Array.isArray(response)) {
          console.error('Unexpected response format:', response);
          throw new Error('Invalid response format');
        }
        
        if (response.length > 0) {
          console.log('First appointment:', response[0]);
          const [firstName, lastName] = response[0].doctor_name.split(' ');
          setDoctorName({
            first_name: firstName,
            last_name: lastName
          });
        }
        
        setAppointments(response);
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

  const handlePostpone = async (datetime: string, reason: string) => {
    try {
      if (!selectedAppointment) return;
      
      const [date, time] = datetime.split('T');
      // Add 30 minutes to the start time for end_time
      const startTime = new Date(`2000-01-01T${time}`);
      const endTime = new Date(startTime.getTime() + 30 * 60000);
      const formattedEndTime = endTime.toTimeString().slice(0, 5);
      
      await api.appointments.postponeAppointment(
        parseInt(selectedAppointment),
        date,
        time,
        formattedEndTime
      );
      
      toast.success('Appointment postponed successfully');
      setIsPostponeDialogOpen(false);
      // Refresh appointments
      const newAppointments = await api.appointments.getDoctorAppointments();
      setAppointments(newAppointments);
    } catch (error) {
      console.error('Error postponing appointment:', error);
      toast.error('Failed to postpone appointment');
    }
  };

  const handleCancel = async (reason: string) => {
    try {
      if (!selectedAppointment) return;
      
      await api.appointments.cancelAppointment(parseInt(selectedAppointment));
      
      toast.success('Appointment cancelled successfully');
      setIsCancelDialogOpen(false);
      // Refresh appointments
      const newAppointments = await api.appointments.getDoctorAppointments();
      setAppointments(newAppointments);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleConfirm = async (appointmentId: string) => {
    try {
      await api.appointments.confirmAppointment(parseInt(appointmentId));
      toast.success('Appointment confirmed successfully');
      // Refresh appointments
      const newAppointments = await api.appointments.getDoctorAppointments();
      setAppointments(newAppointments);
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error('Failed to confirm appointment');
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await api.appointments.deleteAppointment(parseInt(selectedAppointment));
      toast.success('Appointment deleted successfully');
      // Refresh appointments
      const newAppointments = await api.appointments.getDoctorAppointments();
      setAppointments(newAppointments);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
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

  console.log('Current appointments state:', appointments);
  if (appointments.length > 0) {
    console.log('First appointment structure:', JSON.stringify(appointments[0], null, 2));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {profileLink}
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="availability">My Availability</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Hello, Dr. {doctorName ? `${doctorName.last_name}` : ''}
            </h1>
            <p className="text-gray-600">
              {appointments.length} upcoming appointment{appointments.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => {
                    const { date, time } = formatAppointmentDateTime(appointment.appointment_date, appointment.start_time);
                    return (
                      <Card key={appointment.id} className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-6">
                            {/* Date display */}
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

                            {/* Appointment details */}
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-semibold">
                                  Patient: {appointment.patient_name}
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
                                <p className="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                  {appointment.patient_email}
                                </p>
                                <p className="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {time}
                                </p>
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

                            {/* Action buttons */}
                            <div className="flex flex-col gap-2">
                              {appointment.status === 'pending' && (
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedAppointment(appointment.id.toString());
                                    setIsConfirmDialogOpen(true);
                                  }}
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                >
                                  Confirm
                                </Button>
                              )}
                              {appointment.status === 'cancelled' && (
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedAppointment(appointment.id.toString());
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600 border-red-600 hover:bg-red-50"
                                >
                                  Delete
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
            </div>
          </div>
        </TabsContent>
        <TabsContent value="availability">
          <DoctorAvailability />
        </TabsContent>
      </Tabs>

      <PostponeDialog
        isOpen={isPostponeDialogOpen}
        onClose={() => setIsPostponeDialogOpen(false)}
        onConfirm={handlePostpone}
        appointmentId={selectedAppointment || ''}
      />
      <CancelDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancel}
        appointmentId={selectedAppointment || ''}
      />
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={() => selectedAppointment && handleConfirm(selectedAppointment)}
        title="Confirm Appointment"
        description="Are you sure you want to confirm this appointment?"
      />
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAppointment}
        title="Delete Appointment"
        description="Are you sure you want to delete this cancelled appointment? This action cannot be undone."
      />
    </div>
  );
} 