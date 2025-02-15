import React, { useState } from 'react';

// Sample Data (You can replace this with real data fetched from a backend API)
const appointmentsData = [
  {
    id: 1,
    doctor: 'Dr. Ahmad',
    specialty: 'Pediatrician',
    date: '2025-02-20',
    time: '3:00 PM',
    location: 'Saint George Hospital, Room 101',
    status: 'Upcoming',
  },
  {
    id: 2,
    doctor: 'Dr. Jessica',
    specialty: 'Oncologist',
    date: '2025-02-22',
    time: '10:00 AM',
    location: 'AUBMC, Oncology Clinic',
    status: 'Upcoming',
  },
  {
    id: 3,
    doctor: 'Dr. Fatima',
    specialty: 'Cardiologist',
    date: '2025-02-24',
    time: '12:30 PM',
    location: 'Hotel Dieu Hospital, Cardiology Department',
    status: 'Completed',
  },
];

function Appointments() {
  const [appointments, setAppointments] = useState(appointmentsData);

  // Function to cancel an appointment
  const cancelAppointment = (id) => {
    const updatedAppointments = appointments.filter((appointment) => appointment.id !== id);
    setAppointments(updatedAppointments);
  };

  // Function to delete an appointment
  const deleteAppointment = (id) => {
    // In a real app, you'd likely call an API here to delete the appointment
    const updatedAppointments = appointments.filter((appointment) => appointment.id !== id);
    setAppointments(updatedAppointments);
  };

  // Function to handle rescheduling an appointment (you can implement further logic to reschedule)
  const rescheduleAppointment = (id) => {
    // Placeholder for rescheduling logic (you can integrate with a calendar API)
    alert(`Appointment with ID ${id} has been rescheduled.`);
  };

  return (
    <div className="appointments-container">
      <h1 className="text-4xl font-bold mb-6">Your Appointments</h1>
      <div className="appointments-list space-y-4">
        {appointments.length === 0 ? (
          <p>No appointments booked yet.</p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="appointment-card p-4 rounded-lg border-2 border-gray-300 shadow-md"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p className="text-xl font-semibold">
                    {appointment.doctor} - {appointment.specialty}
                  </p>
                  <p className="text-sm text-gray-600">{appointment.date} at {appointment.time}</p>
                  <p className="text-sm text-gray-600">{appointment.location}</p>
                </div>
                <div className="text-sm text-gray-600">{appointment.status}</div>
              </div>
              <div className="mt-3 flex space-x-4">
                {appointment.status === 'Upcoming' && (
                  <>
                    <button
                      onClick={() => rescheduleAppointment(appointment.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => cancelAppointment(appointment.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteAppointment(appointment.id)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-800"
                    >
                      Delete
                    </button>
                  </>
                )}
                {appointment.status === 'Completed' && (
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-not-allowed"
                    disabled
                  >
                    Completed
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Appointments;
