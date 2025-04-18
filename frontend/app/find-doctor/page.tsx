'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '../components/layout';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  yearsExperience: number;
  location: string;
  hospital: string;
  availability: {
    days: string;
    hours: string;
  };
  price: number;
  rating: number;
  patientStories: number;
  imageUrl: string;
}

export default function FindDoctorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

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
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Set your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Ex: Doctor, Hospital"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="w-full md:w-24 bg-[#003B6E] hover:bg-[#002D54]">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Results Section */}
        <section>
          <div className="space-y-4">
            <DoctorCard
              doctor={{
                id: 1,
                name: "Dr. Karim Mansour",
                specialty: "Psychiatrist",
                yearsExperience: 16,
                location: "Beirut",
                hospital: "AUBMC",
                availability: {
                  days: "Tue, Thu",
                  hours: "10:00 AM-01:00 PM"
                },
                price: 35,
                rating: 99,
                patientStories: 93,
                imageUrl: "/doctors/karim-mansour.jpg"
              }}
            />
            {/* Add more doctor cards as needed */}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          {/* Doctor Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold">
                {doctor.name}
              </h4>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {doctor.specialty}
              </span>
            </div>
            
            <div className="space-y-2">
              {/* Experience */}
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {doctor.yearsExperience} years experience
              </p>
              
              {/* Location */}
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {doctor.location} • {doctor.hospital}
              </p>

              {/* Availability */}
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {doctor.availability.days} • {doctor.availability.hours}
              </p>

              {/* Price */}
              <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ${doctor.price} Starting
              </p>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-32">
              View Profile
            </Button>
            <Button className="w-32 bg-[#003B6E] hover:bg-[#002D54]">
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}