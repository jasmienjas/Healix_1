from rest_framework import generics, status
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404, render, redirect
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.models import User
from django.urls import reverse
from datetime import datetime, timedelta
from django.db.models import Q
from django.db.utils import IntegrityError

import logging
import os
import json

from .models import CustomUser, DoctorProfile, PatientProfile, Appointment, DoctorAvailability
from .serializers import (
    UserSerializer,
    PatientRegisterSerializer,
    DoctorRegisterSerializer,
    AppointmentSerializer,
    DoctorProfileSerializer
)
from .token_serializers import CustomTokenObtainPairSerializer

logger = logging.getLogger('accounts')

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class PatientRegisterView(generics.CreateAPIView):
    serializer_class = PatientRegisterSerializer
    
    def create(self, request, *args, **kwargs):
        # Log the incoming request data
        print("Received data:", request.data)
        
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            # Log validation errors
            print("Validation errors:", serializer.errors)
            return Response({
                'success': False,
                'message': 'Validation failed',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = serializer.save()
            return Response({
                'success': True,
                'message': 'Registration successful',
                'data': {
                    'id': user.id,
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'user_type': 'patient'
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error during registration:", str(e))
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
class DoctorRegisterView(APIView):
    """
    View for doctor registration.
    """
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        try:
            print("Received doctor registration request")
            print(f"Request data: {request.data}")
            
            serializer = DoctorRegisterSerializer(data=request.data)
            if serializer.is_valid():
                print("Serializer is valid")
                user = serializer.save()
                print(f"User created: {user.id}")
                return Response({
                    'success': True,
                    'message': 'Registration successful. Please wait for admin approval.',
                    'data': {
                        'id': user.id,
                        'email': user.email,
                        'firstName': user.first_name,
                        'lastName': user.last_name,
                        'user_type': 'doctor'
                    }
                }, status=status.HTTP_201_CREATED)
            else:
                print(f"Serializer errors: {serializer.errors}")
                return Response({
                    'success': False,
                    'message': 'Registration failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Error in register_doctor: {str(e)}")
            return Response({
                'success': False,
                'message': 'Registration failed',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DoctorListView(APIView):
    def get(self, request):
        doctors = CustomUser.objects.filter(user_type='doctor')
        doctor_data = []

        for doctor in doctors:
            try:
                profile = doctor.doctorprofile
                doctor_data.append({
                    "id": doctor.id,
                    "full_name": f"{doctor.first_name} {doctor.last_name}".strip() or doctor.username,
                    "specialty": profile.specialty,
                })
            except DoctorProfile.DoesNotExist:
                pass

        return Response(doctor_data)

class PostponeAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        appointment = get_object_or_404(Appointment, pk=pk)
        
        # Ensure that only doctors can postpone appointments
        if request.user.user_type != 'doctor':
            return Response({
                'success': False,
                'message': 'Only doctors can postpone appointments.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        new_datetime_str = request.data.get('appointment_datetime')
        postpone_reason = request.data.get('postpone_reason')

        if not new_datetime_str:
            return Response({
                'success': False,
                'message': 'New appointment datetime is required.'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if not postpone_reason:
            return Response({
                'success': False,
                'message': 'A postpone reason is required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            new_datetime = datetime.fromisoformat(new_datetime_str)
        except Exception:
            return Response({
                'success': False,
                'message': 'Invalid datetime format. Use ISO format (YYYY-MM-DDTHH:MM:SS).'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        appointment.appointment_datetime = new_datetime
        appointment.status = 'postponed'
        appointment.reason = postpone_reason
        appointment.reason = postpone_reason
        appointment.save()
        
        # Send email notification to patient
        try:
            subject = "Appointment Postponed"
            message = (
                f"Dear {appointment.patient.user.first_name},\n\n"
                f"Your appointment with Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name} "
                f"has been postponed to {new_datetime}.\n\n"
                f"Reason: {postpone_reason}\n\n"
                f"Best regards,\nHealix Team"
            )
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [appointment.patient.user.email]
            )
        except Exception as e:
            logger.error(f"Failed to send postponement email: {e}")
        
        serializer = AppointmentSerializer(appointment)
        return Response({
            'success': True,
            'message': 'Appointment postponed successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

class CancelAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        appointment = get_object_or_404(Appointment, pk=pk)
        
        if request.user.user_type != 'doctor':
            return Response({
                'success': False,
                'message': 'Only doctors can cancel appointments.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        cancellation_message = request.data.get('cancellation_message')
        if not cancellation_message:
            return Response({
                'success': False,
                'message': 'Cancellation message is required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        appointment.status = 'cancelled'
        appointment.reason = cancellation_message
        appointment.reason = cancellation_message
        appointment.save()
        
        # Send email notification
        try:
            subject = "Appointment Cancellation Notice"
            message = (
                f"Dear {appointment.patient.user.first_name},\n\n"
                f"Your appointment scheduled on {appointment.appointment_datetime} "
                f"has been cancelled by Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}.\n\n"
                f"Message from doctor: {cancellation_message}\n\n"
                f"Best regards,\nHealix Team"
            )
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [appointment.patient.user.email]
            )
        except Exception as e:
            logger.error(f"Failed to send cancellation email: {e}")
        
        serializer = AppointmentSerializer(appointment)
        return Response({
            'success': True,
            'message': 'Appointment cancelled successfully',
            'data': serializer.data
        }, status=status.HTTP_200_OK)

class PatientScheduleView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(patient__user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Appointments retrieved successfully',
            'data': serializer.data
        })

class DoctorApprovalStatusView(APIView):
    """
    View to check doctor approval status
    """
    def get(self, request, email):
        try:
            doctor = DoctorProfile.objects.get(user__email=email)
            return Response({
                'success': True,
                'status': 'approved' if doctor.is_approved else 'pending'
            })
        except DoctorProfile.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Doctor not found'
            }, status=status.HTTP_404_NOT_FOUND)

class DoctorScheduleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            if request.user.user_type != 'doctor':
                return Response({
                    'success': False,
                    'message': 'Only doctors can access this endpoint'
                }, status=status.HTTP_403_FORBIDDEN)

            print(f"Fetching appointments for doctor: {request.user.id}")  # Debug log
            
            doctor_profile = request.user.doctor_profile
            appointments = Appointment.objects.filter(
                doctor=doctor_profile
            ).select_related(
                'patient__user',
                'doctor__user'
            )
            
            print(f"Found {appointments.count()} appointments")  # Debug log
            
            serializer = AppointmentSerializer(appointments, many=True)
            serialized_data = serializer.data
            print(f"Serialized data: {serialized_data}")  # Debug log
            
            return Response({
                'success': True,
                'message': 'Appointments retrieved successfully',
                'data': serialized_data
            })
        except Exception as e:
            print(f"Error in DoctorScheduleView: {str(e)}")  # Debug log
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DoctorSearchView(generics.ListAPIView):
    serializer_class = DoctorProfileSerializer
    permission_classes = []  # Allow public access

    def get_queryset(self):
        queryset = DoctorProfile.objects.filter(is_approved=True)
        
        name = self.request.query_params.get('name', None)
        specialty = self.request.query_params.get('specialty', None)
        location = self.request.query_params.get('location', None)

        if name:
            queryset = queryset.filter(
                Q(user__first_name__icontains=name) |
                Q(user__last_name__icontains=name)
            )
        
        if specialty:
            queryset = queryset.filter(specialty__icontains=specialty)
            
        if location:
            queryset = queryset.filter(office_address__icontains=location)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'message': 'Doctors retrieved successfully',
            'data': serializer.data
        })

class DoctorProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        try:
            if request.user.user_type != 'doctor':
                return Response({
                    'success': False,
                    'message': 'Only doctors can access this endpoint'
                }, status=status.HTTP_403_FORBIDDEN)

            doctor_profile = request.user.doctor_profile
            serializer = DoctorProfileSerializer(doctor_profile, context={'request': request})
            
            logger.info(f"Profile data: {serializer.data}")
            
            return Response({
                'success': True,
                'message': 'Profile retrieved successfully',
                'data': serializer.data
            })
        except Exception as e:
            logger.error(f"Error in get profile: {str(e)}", exc_info=True)
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            # Test logging
            logger.info("=== START OF PROFILE UPDATE REQUEST ===")
            logger.info("Test log message to verify logging is working")
            
            logger.info("Received profile update request")
            logger.info(f"Request data: {request.data}")
            logger.info(f"Request files: {request.FILES}")

            if request.user.user_type != 'doctor':
                return Response({
                    'success': False,
                    'message': 'Only doctors can update their profile'
                }, status=status.HTTP_403_FORBIDDEN)

            doctor_profile = request.user.doctor_profile
            data = request.data.copy()

            # Handle profile picture update
            if 'profile_picture' in request.FILES:
                logger.info("Updating profile picture")
                profile_picture = request.FILES['profile_picture']
                logger.info(f"Profile picture name: {profile_picture.name}")
                logger.info(f"Profile picture size: {profile_picture.size}")
                logger.info(f"Profile picture content type: {profile_picture.content_type}")
                
                # Save the profile picture
                doctor_profile.profile_picture = profile_picture
                logger.info(f"Profile picture saved to: {doctor_profile.profile_picture.name}")
                logger.info(f"Profile picture URL: {doctor_profile.profile_picture.url}")
                logger.info(f"Profile picture storage: {doctor_profile.profile_picture.storage}")
                logger.info(f"Profile picture storage class: {doctor_profile.profile_picture.storage.__class__.__name__}")
                logger.info(f"Profile picture storage bucket: {getattr(doctor_profile.profile_picture.storage, 'bucket_name', 'No bucket')}")

            # Update all available fields
            fields_to_update = [
                'specialty',
                'bio',
                'appointment_cost',
                'office_hours_start',
                'office_hours_end',
                'phone_number',
                'office_number',
                'office_address',
                'years_of_experience',
                'education'
            ]

            # Fields that should not be set to None
            required_fields = ['office_address', 'phone_number', 'office_number']

            for field in fields_to_update:
                if field in data:
                    value = data[field]
                    logger.info(f"Updating field {field} with value: {value}")
                    # Only update required fields if a non-empty value is provided
                    if field in required_fields:
                        if value and value.strip():  # Only update if value is non-empty
                            setattr(doctor_profile, field, value)
                    else:
                        # For optional fields, convert empty strings to None
                        if value == '':
                            value = None
                        setattr(doctor_profile, field, value)

            doctor_profile.save()
            logger.info("Profile saved successfully")
            logger.info(f"Profile picture after save: {doctor_profile.profile_picture}")
            logger.info(f"Profile picture URL after save: {doctor_profile.profile_picture.url if doctor_profile.profile_picture else None}")

            serializer = DoctorProfileSerializer(doctor_profile, context={'request': request})
            logger.info(f"Updated profile data: {serializer.data}")

            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'data': serializer.data
            })

        except Exception as e:
            logger.error(f"Error in update profile: {str(e)}", exc_info=True)
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request):
        # For backward compatibility, redirect to POST
        return self.post(request)

class DoctorAvailabilityView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            logger.info(f"DoctorAvailabilityView accessed by user: {request.user.id}")
            
            if request.user.user_type != 'doctor':
                logger.warning(f"Non-doctor user {request.user.id} attempted to access availability")
                return Response({
                    'success': False,
                    'message': 'Only doctors can access this endpoint'
                }, status=status.HTTP_403_FORBIDDEN)

            # Get query parameters
            year = int(request.query_params.get('year', datetime.now().year))
            month = int(request.query_params.get('month', datetime.now().month))
            
            logger.info(f"Fetching availability for {year}-{month}")

            # Get doctor's availability for the month
            availability = DoctorAvailability.objects.filter(
                doctor=request.user.doctor_profile,
                date__year=year,
                date__month=month,
                is_deleted=False
            )
            
            logger.info(f"Found {availability.count()} availability slots")

            # Get booked appointments
            appointments = Appointment.objects.filter(
                doctor=request.user.doctor_profile,
                appointment_datetime__year=year,
                appointment_datetime__month=month
            )
            
            logger.info(f"Found {appointments.count()} booked appointments")

            # Format the response
            availability_data = {}
            for slot in availability:
                date_str = slot.date.isoformat()
                if date_str not in availability_data:
                    availability_data[date_str] = []

                # Check if this slot is booked
                is_booked = appointments.filter(
                    appointment_datetime__date=slot.date,
                    appointment_datetime__time=slot.start_time
                ).exists()

                availability_data[date_str].append({
                    'id': str(slot.id),
                    'startTime': slot.start_time.strftime('%H:%M'),
                    'endTime': slot.end_time.strftime('%H:%M'),
                    'clinicName': slot.clinic_name,
                    'isBooked': is_booked
                })

            logger.info(f"Returning availability data: {availability_data}")
            return Response({
                'success': True,
                'data': availability_data
            })

        except Exception as e:
            logger.error(f"Error in DoctorAvailabilityView: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            logger.info(f"Received availability data: {request.data}")
            
            if request.user.user_type != 'doctor':
                return Response({
                    'success': False,
                    'message': 'Only doctors can access this endpoint'
                }, status=status.HTTP_403_FORBIDDEN)

            # Parse the request data
            data = request.data
            if isinstance(data, str):
                try:
                    data = json.loads(data)
                except json.JSONDecodeError:
                    return Response({
                        'success': False,
                        'message': 'Invalid JSON data'
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Handle delete action
            if data.get('action') == 'delete':
                try:
                    slot = DoctorAvailability.objects.get(
                        id=data.get('id'),
                        doctor=request.user.doctor_profile
                    )
                    slot.is_deleted = True
                    slot.save()
                    return Response({'success': True})
                except DoctorAvailability.DoesNotExist:
                    return Response({
                        'success': False,
                        'message': 'Availability slot not found'
                    }, status=status.HTTP_404_NOT_FOUND)

            # Handle add action
            date = data.get('date')
            start_time = data.get('startTime')
            clinic_name = data.get('clinicName')

            logger.info(f"Processing: date={date}, start_time={start_time}, clinic_name={clinic_name}")

            if not all([date, start_time, clinic_name]):
                return Response({
                    'success': False,
                    'message': 'Missing required fields'
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Calculate end time (1 hour after start time)
                start_time_obj = datetime.strptime(start_time, '%H:%M').time()
                end_time_obj = (datetime.combine(datetime.min, start_time_obj) + timedelta(hours=1)).time()

                # Check for overlapping slots
                existing_slots = DoctorAvailability.objects.filter(
                    doctor=request.user.doctor_profile,
                    date=date,
                    is_deleted=False
                ).filter(
                    Q(start_time__lt=end_time_obj) & Q(end_time__gt=start_time_obj)
                )

                if existing_slots.exists():
                    return Response({
                        'success': False,
                        'message': 'This time slot overlaps with an existing slot'
                    }, status=status.HTTP_400_BAD_REQUEST)

                # Create availability slot
                slot = DoctorAvailability.objects.create(
                    doctor=request.user.doctor_profile,
                    date=date,
                    start_time=start_time_obj,
                    end_time=end_time_obj,
                    clinic_name=clinic_name
                )

                return Response({
                    'success': True,
                    'data': {
                        'id': str(slot.id),
                        'startTime': start_time,
                        'endTime': end_time_obj.strftime('%H:%M'),
                        'clinicName': clinic_name,
                        'isBooked': False
                    }
                })

            except Exception as e:
                logger.error(f"Error creating availability: {str(e)}")
                return Response({
                    'success': False,
                    'message': f'Error creating availability: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Outer error in availability creation: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DoctorAvailabilityDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            if request.user.user_type != 'doctor':
                return Response({
                    'success': False,
                    'message': 'Only doctors can delete availability'
                }, status=status.HTTP_403_FORBIDDEN)

            slot_id = request.data.get('id')
            if not slot_id:
                return Response({
                    'success': False,
                    'message': 'Slot ID is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                availability = DoctorAvailability.objects.get(
                    id=slot_id,
                    doctor=request.user.doctor_profile
                )
                availability.delete()
                return Response({
                    'success': True,
                    'message': 'Availability deleted successfully'
                })
            except DoctorAvailability.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Availability not found'
                }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print(f"Error deleting availability: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminRegisterView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            user = CustomUser.objects.create_user(
                email=data.get('email'),
                password=data.get('password'),
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
                user_type='admin',
                is_staff=True,
                is_superuser=True
            )
            
            return Response({
                'success': True,
                'message': 'Admin user created successfully',
                'data': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'user_type': user.user_type
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        