'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDoctorAvailability, addDoctorAvailability } from '@/services/api';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  clinicName: string;
  isBooked: boolean;
}

interface DayAvailability {
  [key: string]: TimeSlot[];
}

export default function DoctorAvailability() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<DayAvailability>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedClinic, setSelectedClinic] = useState<string>('');

  const clinics = ['Clinic 1', 'Clinic 2', 'Clinic 3'];
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  useEffect(() => {
    fetchAvailability();
  }, [currentDate]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const data = await getDoctorAvailability(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      setAvailability(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeSlot = async () => {
    if (!selectedDate || !selectedTime || !selectedClinic) {
      return;
    }

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      await addDoctorAvailability(dateStr, selectedTime, selectedClinic);
      await fetchAvailability(); // Refresh the calendar
      setIsAddingSlot(false);
      setSelectedTime('');
      setSelectedClinic('');
      // Add a success toast or message here if you want
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add time slot';
      setError(errorMessage);
      // Keep the dialog open when there's an error
      setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Navigation functions
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: JSX.Element[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-32 border border-gray-100"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = formatDate(date);
      const daySlots = availability[dateString] || [];
      const isPast = isDateInPast(date);

      days.push(
        <div
          key={`day-${day}`}
          className={`h-32 border border-gray-100 p-2 relative hover:bg-gray-50 ${
            isPast ? 'bg-gray-50' : ''
          }`}
          onClick={() => !isPast && setSelectedDate(date)}
        >
          <div className={`font-semibold mb-2 ${isPast ? 'text-gray-400' : ''}`}>
            {day}
          </div>
          <div className="space-y-1">
            {daySlots.map((slot) => (
              <div
                key={slot.id}
                className={`text-xs px-2 py-1 rounded ${
                  slot.isBooked
                    ? 'bg-red-100 text-red-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {slot.startTime} - {slot.clinicName}
              </div>
            ))}
          </div>
          {selectedDate && 
           formatDate(selectedDate) === dateString && 
           !isPast && (
            <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute bottom-2 right-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Availability</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Select onValueChange={setSelectedTime} value={selectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Clinic</label>
                    <Select onValueChange={setSelectedClinic} value={selectedClinic}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select clinic" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinics.map((clinic) => (
                          <SelectItem key={clinic} value={clinic}>
                            {clinic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleAddTimeSlot}
                    disabled={!selectedTime || !selectedClinic}
                  >
                    Add Time Slot
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      );
    }

    return days;
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading availability...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => fetchAvailability()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Availability</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="outline" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-px">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center py-2 bg-gray-50 font-medium">
              {day}
            </div>
          ))}
          {generateCalendar()}
        </div>
      </div>
    </div>
  );
}
