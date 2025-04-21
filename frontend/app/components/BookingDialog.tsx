import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, MapPin, Clock, User, Calendar, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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

  const handleSubmit = async () => {
    // TODO: Implement appointment booking logic
    console.log('Booking appointment with details:', {
      email,
      phone,
      problem,
      doctorName,
      appointmentTime,
      appointmentDate
    });
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
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 