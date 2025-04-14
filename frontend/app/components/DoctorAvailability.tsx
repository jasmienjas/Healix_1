'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getDoctorAvailability, addDoctorAvailability, deleteDoctorAvailability } from '@/services/api';

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
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [clinicName, setClinicName] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

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
      console.log('Availability data:', data);
      setAvailability(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const validateTimeRange = (start: string, end: string): boolean => {
    const startDate = new Date(`1970-01-01T${start}`);
    const endDate = new Date(`1970-01-01T${end}`);
    return startDate < endDate;
  };

  const handleAddTimeSlot = async () => {
    if (!selectedDate || !startTime || !endTime || !clinicName.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateTimeRange(startTime, endTime)) {
      setError('End time must be after start time');
      return;
    }

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Make sure we're sending the correct data structure
      await addDoctorAvailability(
        dateStr,
        startTime,
        endTime,
        clinicName.trim() // This should be the actual clinic name, not a time
      );
      
      await fetchAvailability();
      setIsAddingSlot(false);
      setStartTime('');
      setEndTime('');
      setClinicName('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add time slot';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      await deleteDoctorAvailability(slotId);
      await fetchAvailability();
      setSelectedSlot(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete time slot');
      setTimeout(() => setError(null), 3000);
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
          } ${formatDate(date) === formatDate(selectedDate || new Date()) ? 'ring-2 ring-blue-200' : ''}`}
          onClick={() => {
            if (!isPast) {
              setSelectedDate(date);  // Set the selected date when clicking a cell
              setSelectedSlot(null);  // Clear any selected slot
            }
          }}
        >
          <div className={`font-semibold mb-2 ${isPast ? 'text-gray-400' : ''}`}>
            {day}
          </div>
          <div className="space-y-1">
            {daySlots.map((slot) => (
              <div
                key={slot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSlot(selectedSlot === slot.id ? null : slot.id);
                }}
                className={`
                  bg-blue-50 rounded p-1.5 cursor-pointer
                  transition-colors duration-200
                  ${selectedSlot === slot.id ? 'ring-2 ring-blue-500' : ''}
                  ${slot.isBooked ? 'bg-gray-100' : 'hover:bg-blue-100'}
                  relative group
                `}
              >
                <div className="text-blue-600 text-sm">
                  {slot.startTime} - {slot.endTime}
                </div>
                <div className="text-blue-500 text-xs">
                  {slot.clinicName}
                </div>
                
                {/* Delete button - only show when slot is selected and not booked */}
                {selectedSlot === slot.id && !slot.isBooked && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSlot(slot.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {/* Add button - show when date is selected and not in past */}
          {!isPast && formatDate(date) === formatDate(selectedDate || new Date()) && (
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
              <DialogContent className="..." aria-describedby="dialog-description">
                <DialogHeader>
                  <DialogTitle>Add Availability</DialogTitle>
                  <DialogDescription id="dialog-description">
                    Select a time slot to add your availability.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Clinic Name</label>
                    <Input
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="Enter clinic name"
                      className="w-full"
                    />
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                  )}
                  <Button onClick={handleAddTimeSlot} className="w-full">
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
