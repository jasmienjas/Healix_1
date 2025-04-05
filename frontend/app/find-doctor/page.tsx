'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchDoctors } from '@/services/doctor';

interface Doctor {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  specialty: string;
  officeAddress: string;
  officeNumber: string;
}

export default function FindDoctorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchDoctors({
        name: searchTerm,
        specialty,
        location,
      });
      setDoctors(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search doctors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find a Doctor</h1>
      
      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Input
          placeholder="Specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        />
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={handleSearch} 
        disabled={loading}
        className="mb-6"
      >
        {loading ? 'Searching...' : 'Search'}
      </Button>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id}>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">
                Dr. {doctor.user.firstName} {doctor.user.lastName}
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                Specialty: {doctor.specialty}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Office: {doctor.officeAddress}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Contact: {doctor.officeNumber}
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href={`/book-appointment/${doctor.id}`}>Book Appointment</a>
              </Button>
            </CardContent>
          </Card>
        ))}
        {doctors.length === 0 && !loading && (
          <p className="text-gray-500 col-span-full text-center">
            No doctors found. Try adjusting your search criteria.
          </p>
        )}
      </div>
    </div>
  );
}