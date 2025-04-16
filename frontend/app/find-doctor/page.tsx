'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  const [availability, setAvailability] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filter, setFilter] = useState('');

  return (
    <div className="container mx-auto p-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
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
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="tomorrow">Tomorrow</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="specialty">Specialty</SelectItem>
            <SelectItem value="hospital">Hospital</SelectItem>
            <SelectItem value="experience">Experience</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="experience">Experience</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
        <h1 className="text-xl font-semibold">55 doctors available in Beirut</h1>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <span>•</span>
          <span>Book appointments with minimum wait-time & verified doctor details</span>
        </div>
      </div>

      {/* Doctor Cards */}
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
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Doctor Image */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#003B6E] mb-1">
              {doctor.name}
            </h3>
            <p className="text-gray-600 mb-1">{doctor.specialty}</p>
            <p className="text-gray-500 text-sm mb-2">
              {doctor.yearsExperience} years experience overall
            </p>
            
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <MapPin className="h-4 w-4" />
              <span>{doctor.location}</span>
              <span className="mx-1">•</span>
              <span>{doctor.hospital}</span>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  {doctor.availability.days}
                </span>
                <span className="text-xs text-gray-500">
                  {doctor.availability.hours}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  ${doctor.price}
                </span>
                <span className="text-xs text-gray-500">Starting</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-sm">
                {doctor.rating}%
              </div>
              <span className="text-sm text-gray-600">
                {doctor.patientStories} Patient Stories
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-32">
              View Profile
            </Button>
            <Button className="w-32 bg-[#003B6E] hover:bg-[#002D54]">
              Book Appointment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}