import React, { useState } from 'react';

function Doctors() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const doctors = [
    {
      name: 'Dr. Fatima Hassan',
      specialty: 'Cardiologist',
      image: 'https://i.postimg.cc/KYznk1k0/doctor-photo-3.jpg',
      universities: ['USJ', 'AUBMC'],
      experience: 5,
    },
    {
      name: 'Dr. Mohamad Younes',
      specialty: 'Family Medicine',
      image: 'https://i.postimg.cc/mr24Wszx/dr-ahmad.jpg',
      universities: ['Hotel Dieu', 'Saint George Hospital'],
      experience: 3,
    },
    {
      name: 'Dr. Lamia Mansour',
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
      image: 'https://i.postimg.cc/KjyFVgtf/dr-mustafa.avif',
      universities: ['AUBMC', 'Saint George Hospital'],
      experience: 7,
    },
    {
      name: 'Dr. May Abdala',
      specialty: 'Emergency Medicine',
      image: 'https://i.postimg.cc/YCj6j4mb/may-doctors.webp',
      universities: ['Hotel Dieu', 'Al Rasoul Hospital'],
      experience: 4,
    },
    {
      name: 'Dr. Jessica Azzi',
      specialty: 'Oncologist',
      image: 'https://i.postimg.cc/3NRR9Ghq/jessicab-azzi.avif',
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
    <div className="bg-[#001F3F] min-h-screen p-10 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Our Esteemed Doctors</h1>
      <p className="text-center text-gray-300 mb-12 max-w-3xl mx-auto">
        Meet our highly qualified doctors, each with extensive experience and a passion for patient care.
      </p>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doctor) => (
          <div key={doctor.name} className="bg-white text-black rounded-lg shadow-lg overflow-hidden">
            <img src={doctor.image} alt={doctor.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p className="text-gray-600">{doctor.specialty}</p>
              <p className="mt-2 text-sm"><strong>Universities:</strong> {doctor.universities.join(', ')}</p>
              <p className="text-sm"><strong>Experience:</strong> {doctor.experience} years</p>
              <div className="mt-4 flex justify-between">
                <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">Call</button>
                <button className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700">Email</button>
                <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700">Appointment</button>
                <button className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700">Web</button>
                <button onClick={() => handleKnowMore(doctor)} className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600">Know More</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-lg w-96 relative">
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
