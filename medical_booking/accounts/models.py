from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils import timezone

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

    # Avoid conflicts with Django auth system
    groups = models.ManyToManyField(Group, related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="customuser_permissions", blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

class DoctorProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='doctor_profile')
    phone_number = models.CharField(max_length=15)
    office_number = models.CharField(max_length=15)
    office_address = models.CharField(max_length=255)
    specialty = models.CharField(max_length=100)
    license_number = models.CharField(max_length=50)
    medical_license = models.FileField(upload_to='licenses/')
    certificate = models.FileField(upload_to='certificates/')
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
    doctor = models.ForeignKey('accounts.DoctorProfile', on_delete=models.CASCADE, related_name='appointments')
    patient = models.ForeignKey('accounts.PatientProfile', on_delete=models.CASCADE, related_name='appointments')
    appointment_datetime = models.DateTimeField(help_text="Date and time for the appointment")
    status = models.CharField(max_length=10, choices=APPOINTMENT_STATUS_CHOICES, default='pending')
    reason = models.TextField(blank=True, null=True, help_text="Reason for the appointment (optional)")
    created_at = models.DateTimeField (default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment on {self.appointment_datetime} ({self.status})"

    class Meta:
        ordering = ['-appointment_datetime']
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"

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