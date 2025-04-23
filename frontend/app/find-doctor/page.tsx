'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Layout from '../components/layout';
import { searchDoctors } from '@/services/doctor';
import { useRouter } from 'next/navigation';

interface Doctor {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    user_type: string;
  };
  specialty: string;
  office_address: string;
  office_number: string;
  phone_number: string;
  profile_picture: string | null;
  profile_picture_url: string | null;
  appointment_cost: string | number;
  office_hours_start: string;
  office_hours_end: string;
  bio: string;
  years_of_experience: number;
  education: string;
}

interface SearchFilters {
  name: string;
  location: string;
  specialty: string;
  minExperience: number;
  maxExperience: number;
  sortBy: 'name' | 'experience' | 'fee';
  sortOrder: 'asc' | 'desc';
}

export default function FindDoctorPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    location: '',
    specialty: '',
    minExperience: 0,
    maxExperience: 50,
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const doctors = await searchDoctors({
        name: filters.name,
        location: filters.location,
        specialty: filters.specialty,
        min_experience: filters.minExperience,
        max_experience: filters.maxExperience,
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder
      });
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
              <div className="flex flex-col gap-4">
                {/* Main Search Bar */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search by name or specialty"
                      value={filters.name}
                      onChange={(e) => setFilters({...filters, name: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Set your location"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
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

                {/* Filter Toggle */}
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </Button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* Specialty Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Specialty</label>
                      <Input
                        placeholder="Enter specialty"
                        value={filters.specialty}
                        onChange={(e) => setFilters({...filters, specialty: e.target.value})}
                      />
                    </div>

                    {/* Experience Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Years of Experience</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          value={filters.minExperience}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value >= 0 && value <= 50) {
                              setFilters({...filters, minExperience: value});
                            }
                          }}
                          className="w-20"
                        />
                        <span>to</span>
                        <Input
                          type="number"
                          min="0"
                          max="50"
                          value={filters.maxExperience}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value >= 0 && value <= 50) {
                              setFilters({...filters, maxExperience: value});
                            }
                          }}
                          className="w-20"
                        />
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort By</label>
                      <div className="flex gap-2">
                        <Select
                          value={filters.sortBy}
                          onValueChange={(value) => setFilters({...filters, sortBy: value as SearchFilters['sortBy']})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="experience">Experience</SelectItem>
                            <SelectItem value="fee">Fee</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setFilters({...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'})}
                        >
                          {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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
  const router = useRouter();
  console.log('Doctor data received:', doctor);
  
  // Extract name from username (e.g., 'dr_rami_khouri' -> 'Rami Khouri')
  const nameParts = doctor.user.username.replace('dr_', '').split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1));
  const fullName = nameParts.join(' ');
  const initials = nameParts.map(part => part[0]).join('');
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden flex-shrink-0 border-2 border-blue-100">
            {doctor.profile_picture ? (
              <img
                src={doctor.profile_picture}
                alt={`Dr. ${fullName}`}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
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
              Dr. {fullName}
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
          <Button 
            className="w-full bg-[#002B5B] hover:bg-[#002B5B]/90 text-white"
            onClick={() => router.push(`/doctor/${doctor.id}`)}
          >
            Book Appointment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}