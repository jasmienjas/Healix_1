'use client';

import DoctorAvailability from '../components/DoctorAvailability';
import { useAuth } from '../context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AvailabilityPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.user_type !== 'doctor') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.user_type !== 'doctor') {
    return null;
  }

  return <DoctorAvailability />;
}
