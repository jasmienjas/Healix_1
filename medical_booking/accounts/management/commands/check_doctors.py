from django.core.management.base import BaseCommand
from accounts.models import DoctorProfile

class Command(BaseCommand):
    help = 'Check doctor profiles and their approval status'

    def handle(self, *args, **options):
        doctors = DoctorProfile.objects.all()
        
        if not doctors.exists():
            self.stdout.write(self.style.WARNING('No doctors found in the database'))
            return
            
        self.stdout.write(self.style.SUCCESS(f'Found {doctors.count()} doctors:'))
        
        for doctor in doctors:
            status = 'Approved' if doctor.is_approved else 'Pending Approval'
            self.stdout.write(f'- Dr. {doctor.user.first_name} {doctor.user.last_name} ({doctor.user.email})')
            self.stdout.write(f'  Specialty: {doctor.specialty}')
            self.stdout.write(f'  Status: {status}')
            self.stdout.write(f'  Created: {doctor.created_at}')
            self.stdout.write('') 