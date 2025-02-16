import React, { useState } from 'react';

function Doctors() {
  // State to manage modal visibility
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      name: 'Fatima Hassan',
      specialty: 'Cardiologist',
      image: 'https://i.postimg.cc/KYznk1k0/doctor-photo-3.jpg',
      universities: ['USJ', 'AUBMC'],
      experience: 5,
    },
    {
      name: 'Mohamad Younes',
      specialty: 'Family Medicine',
      image: 'https://i.postimg.cc/mr24Wszx/dr-ahmad.jpg',
      universities: ['Hotel Dieu', 'Saint George Hospital'],
      experience: 3,
    },
    {
      name: 'Lamia Mansour',
      specialty: 'Neurologist',
      image: 'https://i.postimg.cc/L8m55GYD/dr-may.webp',
      universities: ['AUBMC', 'Al Rasoul Hospital'],
      experience: 4,
    },
    {
      name: 'Dr. Ahmad Abdala',
      specialty: 'Pediatrician',
      image: 'https://i.postimg.cc/6qQzBMVp/hassan-dr.jpg',
      universities: ['USJ', 'LAU'],
      experience: 6,
    },
    {
      name: 'Dr. Mustafa Khcheich',
      specialty: 'Neurologist',
      image: 'https://i.postimg.cc/KjyFVgtf/dr-mustafa.avif', // Add the correct image for Dr. Mustafa
      universities: ['AUBMC', 'Saint George Hospital'],
      experience: 7,
    },
    {
      name: 'Dr. May Abdala',
      specialty: 'Emergency Medicine',
      image: 'https://i.postimg.cc/YCj6j4mb/may-doctors.webp', // Add the correct image for Dr. May
      universities: ['Hotel Dieu', 'Al Rasoul Hospital'],
      experience: 4,
    },
    {
      name: 'Dr. Jessica Azzi',
      specialty: 'Oncologist',
      image: 'https://i.postimg.cc/3NRR9Ghq/jessicab-azzi.avif', // Add the correct image for Dr. Jessica
      universities: ['LAU', 'AUBMC'],
      experience: 8,
    },
  ];

  const handleKnowMore = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleCloseModal = () => {
    setSelectedDoctor(null);
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold">Doctors</h1>
      <div className="mt-8 grid grid-cols-3 gap-8">
        {doctors.map((doctor) => (
          <div key={doctor.name} className="doctor-card bg-blue-500 p-5 rounded-lg shadow-md">
            <button onClick={() => handleKnowMore(doctor)} className="text-blue-200 hover:text-blue-500">
              Know More
            </button>
            <img src={doctor.image} alt={doctor.name} className="w-40 h-40 rounded-full mx-auto my-3" />
            <p className="text-xl font-semibold">{doctor.name} - {doctor.specialty}</p>
            <div className="mt-4">
              <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for "Know More" */}
      {selectedDoctor && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-lg w-96">
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-xl text-gray-700">X</button>
            <h2 className="text-2xl font-semibold mb-4">{selectedDoctor.name} - {selectedDoctor.specialty}</h2>
            <p><strong>Universities:</strong> {selectedDoctor.universities.join(', ')}</p>
            <p><strong>Years of Experience:</strong> {selectedDoctor.experience} years</p>
            <div className="mt-4">
              <button onClick={handleCloseModal} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;
