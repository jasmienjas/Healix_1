import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPatientAppointments } from '@/services/api';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  image: string;
  location: string;
  address: string;
  availability: {
    days: string;
    hours: string;
  };
  fee: number;
}

interface Appointment {
  id: string;
  doctorName: string;
  time: string;
  date: Date;
  status: string;
}

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getPatientAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
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
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-600 rounded-lg p-3 text-center min-w-[60px]">
                    <div className="text-sm font-semibold">
                      {new Date(appointment.date).getDate()}
                    </div>
                    <div className="text-xs">
                      {new Date(appointment.date).toLocaleString("default", { month: "short" })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{appointment.doctorName}</h4>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                    <p className="text-sm text-gray-600">Status: {appointment.status}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/appointments/${appointment.id}`}>View Details</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {appointments.length === 0 && (
            <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
          )}
        </div>
      </section>
    </div>
  );
} 