'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '../components/layout';
import { searchDoctors } from '@/services/doctor';

interface Doctor {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  specialty: string;
  office_address: string;
  office_number: string;
  phone_number: string;
  profile_picture_url: string | null;
  appointment_cost: number;
  office_hours_start: string;
  office_hours_end: string;
  bio: string;
  years_of_experience: number;
  education: string;
}

export default function FindDoctorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const doctors = await searchDoctors({
        name: searchTerm,
        location: location,
        specialty: searchTerm // Using searchTerm for specialty as well
      });
      console.log('Search results:', doctors);
      setDoctors(doctors || []);
    } catch (err) {
      setError('Failed to fetch doctors. Please try again.');
      console.error('Error fetching doctors:', err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load of doctors
    handleSearch();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold mb-2">Find a Doctor</h1>
        </section>

        {/* Search Section */}
        <section className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search by name or specialty"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Set your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="bg-[#002B5B] hover:bg-[#002B5B]/90 text-white"
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center max-w-7xl mx-auto">{error}</div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 max-w-7xl mx-auto">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading doctors...</p>
          </div>
        )}

        {/* No Results Message */}
        {!loading && doctors.length === 0 && !error && (
          <div className="text-center py-8 max-w-7xl mx-auto">
            <p className="text-gray-600">No doctors found. Try adjusting your search criteria.</p>
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && doctors.length > 0 && (
          <section className="grid grid-cols-1 gap-6 max-w-7xl mx-auto">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </section>
        )}
      </div>
    </Layout>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const initials = `${doctor.user?.first_name?.[0] || ''}${doctor.user?.last_name?.[0] || ''}`;
  const fullName = `${doctor.user?.first_name || ''} ${doctor.user?.last_name || ''}`.trim();
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden flex-shrink-0 border-2 border-blue-100">
            {doctor.profile_picture_url ? (
              <img
                src={doctor.profile_picture_url}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-3xl font-semibold text-blue-500">
                  {initials}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {fullName ? `Dr. ${fullName}` : 'Doctor'}
            </h3>
            <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
            <div className="space-y-2">
              <p className="text-gray-600">
                {doctor.years_of_experience} years of experience
              </p>
              <p className="text-gray-600">
                {doctor.office_address}
              </p>
              <p className="text-gray-600">
                Office Hours: {doctor.office_hours_start} - {doctor.office_hours_end}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                Consultation Fee: ${doctor.appointment_cost}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button className="w-full bg-[#002B5B] hover:bg-[#002B5B]/90 text-white">
            Book Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}