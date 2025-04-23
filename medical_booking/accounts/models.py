from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('admin', 'Admin'),
    )
    is_verified = models.BooleanField(default=False)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='patient')
    dob = models.DateField(null=True, blank=True)  # Date of Birth field
    first_name = models.CharField(max_length=30)  # Override first_name to make it required
    last_name = models.CharField(max_length=30)   # Override last_name to make it required
    email = models.EmailField(unique=True)        # Override email to make it unique
    verification_token = models.CharField(max_length=100, null=True, blank=True, default=None)  # Make it nullable with default None

    # Avoid conflicts with Django auth system
    groups = models.ManyToManyField(Group, related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions", blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

def doctor_profile_picture_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/doctor_profile_pictures/user_<id>/<filename>
    return f'doctor_profile_pictures/user_{instance.user.id}/{filename}'

class DoctorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='doctor_profile')
    specialty = models.CharField(max_length=100)
    office_address = models.CharField(max_length=200)
    office_number = models.CharField(max_length=20)
    phone_number = models.CharField(max_length=20)
    profile_picture = models.ImageField(upload_to=doctor_profile_picture_path, null=True, blank=True)
    appointment_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    office_hours_start = models.TimeField(default='09:00:00')
    office_hours_end = models.TimeField(default='17:00:00')
    bio = models.TextField(default='No bio provided')
    years_of_experience = models.IntegerField(default=0)
    education = models.TextField(default='Not specified')
    medical_license = models.FileField(upload_to='medical_licenses/', null=True, blank=True)
    certificate = models.FileField(upload_to='certificates/', null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name}"

    class Meta:
        verbose_name = "Doctor Profile"
        verbose_name_plural = "Doctor Profiles"

class PatientProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='patient_profile')
    phone_number = models.CharField(max_length=15)
    medical_history = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

    class Meta:
        verbose_name = "Patient Profile"
        verbose_name_plural = "Patient Profiles"
    phone_number = models.CharField(max_length=15, null=True, blank=True)

APPOINTMENT_STATUS_CHOICES = (
    ('pending', 'Pending'),
    ('confirmed', 'Confirmed'),
    ('cancelled', 'Cancelled'),
    ('postponed', 'Postponed'),
)

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('postponed', 'Postponed'),
    ]

    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='doctor_appointments')
    appointment_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    document = models.FileField(upload_to='appointment_documents/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.get_full_name()} - {self.doctor.user.get_full_name()} - {self.appointment_date} {self.start_time}"

class DoctorAvailability(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='availability_slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    clinic_name = models.CharField(max_length=100)
    is_booked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        ordering = ['date', 'start_time']
        constraints = [
            models.UniqueConstraint(
                fields=['doctor', 'date', 'start_time'],
                condition=models.Q(is_deleted=False),
                name='unique_active_availability'
            )
        ]

    def __str__(self):
        return f"{self.doctor} - {self.date} {self.start_time}-{self.end_time}"

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()    