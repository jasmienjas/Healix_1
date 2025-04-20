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
      const response = await searchDoctors({
        name: searchTerm,
        location: location,
        specialty: searchTerm // Using searchTerm for specialty as well
      });
      setDoctors(response.data || []);
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
        <section>
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
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading doctors...</p>
          </div>
        )}

        {/* No Results Message */}
        {!loading && doctors.length === 0 && !error && (
          <div className="text-center py-8">
            <p className="text-gray-600">No doctors found. Try adjusting your search criteria.</p>
          </div>
        )}

        {/* Doctors Grid */}
        {!loading && doctors.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            {doctor.profile_picture_url ? (
              <img
                src={doctor.profile_picture_url}
                alt={`${doctor.user.first_name} ${doctor.user.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-2xl">
                  {doctor.user.first_name[0]}{doctor.user.last_name[0]}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              Dr. {doctor.user.first_name} {doctor.user.last_name}
            </h3>
            <p className="text-gray-600">{doctor.specialty}</p>
            <p className="text-sm text-gray-500 mt-1">
              {doctor.years_of_experience} years of experience
            </p>
            <p className="text-sm text-gray-500">
              {doctor.office_address}
            </p>
            <p className="text-sm text-gray-500">
              Office Hours: {doctor.office_hours_start} - {doctor.office_hours_end}
            </p>
            <p className="text-sm font-medium mt-2">
              Consultation Fee: ${doctor.appointment_cost}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button className="w-full">Book Appointment</Button>
        </div>
      </CardContent>
    </Card>
  );
}