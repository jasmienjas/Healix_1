import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MapPin, Clock, User, Calendar, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { searchDoctors } from '@/services/doctor';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  location: string;
  appointmentTime: string;
  appointmentDate: string;
  duration: string;
  fee: string | number;
}

export function BookingDialog({
  isOpen,
  onClose,
  doctorName,
  location,
  appointmentTime,
  appointmentDate,
  duration,
  fee
}: BookingDialogProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      console.log('Booking appointment with details:', {
        email,
        phone,
        problem,
        doctorName,
        appointmentTime,
        appointmentDate
      });

      // Parse the appointment time
      const [startTime, endTime] = appointmentTime.split(' - ').map(time => time.trim());
      
      // Format the date to YYYY-MM-DD
      const dateParts = appointmentDate.split(', ')[1].split(' ');
      const monthMap = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04',
        'May': '05', 'June': '06', 'July': '07', 'August': '08',
        'September': '09', 'October': '10', 'November': '11', 'December': '12'
      };
      const day = dateParts[1].replace(/\D/g, '');
      const month = monthMap[dateParts[0]];
      const year = new Date().getFullYear();
      const formattedDate = `${year}-${month}-${day.padStart(2, '0')}`;

      // Get doctor ID from the name
      console.log('Searching for doctor:', doctorName);
      const doctors = await searchDoctors({ name: doctorName });
      console.log('Search results:', doctors);

      if (!doctors || doctors.length === 0) {
        // Try searching with just the first name
        const firstName = doctorName.split(' ')[1]; // Assuming format is "Dr. FirstName LastName"
        console.log('Trying search with first name:', firstName);
        const doctorsByFirstName = await searchDoctors({ name: firstName });
        console.log('Search results by first name:', doctorsByFirstName);

        if (!doctorsByFirstName || doctorsByFirstName.length === 0) {
          throw new Error(`Doctor "${doctorName}" not found. Please try again with the correct name.`);
        }
        const doctorId = doctorsByFirstName[0].id;
        console.log('Found doctor with ID:', doctorId);

        // Create the appointment
        const response = await api.appointments.createAppointment({
          doctor: doctorId,
          appointment_date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          reason: problem
        });

        if (response.success) {
          toast.success('Appointment booked successfully!');
          onClose();
        } else {
          throw new Error(response.message || 'Failed to book appointment');
        }
      } else {
        const doctorId = doctors[0].id;
        console.log('Found doctor with ID:', doctorId);

        // Create the appointment
        const response = await api.appointments.createAppointment({
          doctor: doctorId,
          appointment_date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          reason: problem
        });

        if (response.success) {
          toast.success('Appointment booked successfully!');
          onClose();
        } else {
          throw new Error(response.message || 'Failed to book appointment');
        }
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Section - Appointment Details */}
          <div className="w-1/3 bg-gray-50 p-6 space-y-6">
            <button
              onClick={onClose}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">{doctorName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">{duration}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">{location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">Fees: ${fee}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium">
                    {appointmentTime}, {appointmentDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Patient Details Form */}
          <div className="w-2/3 p-6">
            <h2 className="text-xl font-semibold mb-6">Enter Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient's email
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                <PhoneInput
                  country={'lb'}
                  value={phone}
                  onChange={setPhone}
                  inputStyle={{
                    width: '100%',
                    height: '40px',
                    fontSize: '16px',
                    paddingLeft: '48px'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Problem Description
                </label>
                <Textarea
                  placeholder="Describe your medical concern"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Booking...' : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 