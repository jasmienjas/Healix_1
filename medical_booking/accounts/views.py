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
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

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
            logger.info("Received doctor registration request")
            logger.info(f"Request data: {request.data}")
            
            # Validate required fields
            required_fields = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 
                             'officeNumber', 'officeAddress', 'birthDate', 'licenseNumber']
            missing_fields = [field for field in required_fields if field not in request.data]
            if missing_fields:
                logger.error(f"Missing required fields: {missing_fields}")
                return Response({
                    'success': False,
                    'message': 'Missing required fields',
                    'errors': {field: 'This field is required' for field in missing_fields}
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = DoctorRegisterSerializer(data=request.data)
            if serializer.is_valid():
                logger.info("Serializer is valid")
                user = serializer.save()
                logger.info(f"User created: {user.id}")
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
                logger.error(f"Serializer errors: {serializer.errors}")
                return Response({
                    'success': False,
                    'message': 'Registration failed',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error in register_doctor: {str(e)}")
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
        
        appointment_date = request.data.get('appointment_date')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')
        postpone_reason = request.data.get('postpone_reason')

        if not all([appointment_date, start_time, end_time, postpone_reason]):
            return Response({
                'success': False,
                'message': 'All fields (appointment_date, start_time, end_time, postpone_reason) are required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Parse the date
            new_date = datetime.strptime(appointment_date, '%Y-%m-%d').date()
            # Parse the times
            new_start_time = datetime.strptime(start_time, '%H:%M').time()
            new_end_time = datetime.strptime(end_time, '%H:%M').time()
        except ValueError:
            return Response({
                'success': False,
                'message': 'Invalid date/time format. Use YYYY-MM-DD for date and HH:MM for time.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        appointment.appointment_date = new_date
        appointment.start_time = new_start_time
        appointment.end_time = new_end_time
        appointment.status = 'postponed'
        appointment.reason = postpone_reason
        appointment.save()
        
        # Send email notification to patient
        try:
            subject = "Appointment Postponed"
            message = (
                f"Dear {appointment.patient.first_name},\n\n"
                f"Your appointment with Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name} "
                f"has been postponed to {appointment_date} at {start_time}.\n\n"
                f"Reason: {postpone_reason}\n\n"
                f"Best regards,\nHealix Team"
            )
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [appointment.patient.email]
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
        
        # Check if the user is either the doctor or the patient of the appointment
        is_doctor = request.user.user_type == 'doctor' and appointment.doctor.user == request.user
        is_patient = request.user == appointment.patient
        
        if not (is_doctor or is_patient):
            return Response({
                'success': False,
                'message': 'You can only cancel your own appointments.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        cancellation_message = request.data.get('cancellation_message')
        if not cancellation_message:
            return Response({
                'success': False,
                'message': 'Cancellation message is required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        appointment.status = 'cancelled'
        appointment.reason = cancellation_message
        appointment.save()
        
        # Send email notification
        try:
            if is_doctor:
                # Doctor cancelled the appointment
                subject = "Appointment Cancellation Notice"
                message = (
                    f"Dear {appointment.patient.first_name},\n\n"
                    f"Your appointment scheduled on {appointment.appointment_date} at {appointment.start_time} "
                    f"has been cancelled by Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}.\n\n"
                    f"Message: {cancellation_message}\n\n"
                    f"Best regards,\nHealix Team"
                )
                recipient = appointment.patient.email
            else:
                # Patient cancelled the appointment
                subject = "Appointment Cancellation Notice"
                message = (
                    f"Dear Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name},\n\n"
                    f"The appointment scheduled on {appointment.appointment_date} at {appointment.start_time} "
                    f"has been cancelled by the patient {appointment.patient.first_name} {appointment.patient.last_name}.\n\n"
                    f"Message: {cancellation_message}\n\n"
                    f"Best regards,\nHealix Team"
                )
                recipient = appointment.doctor.user.email

            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [recipient]
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
        try:
            logger.info("=== START OF PATIENT SCHEDULE FETCH ===")
            logger.info(f"Fetching appointments for patient: {self.request.user.id}")
            appointments = Appointment.objects.filter(
                patient=self.request.user
            ).select_related(
                'patient',
                'doctor__user'
            )
            logger.info(f"Found {appointments.count()} appointments")
            
            # Log details of each appointment
            for appointment in appointments:
                logger.info(f"Appointment {appointment.id}:")
                logger.info(f"- Document: {appointment.document if appointment.document else 'None'}")
                if appointment.document:
                    logger.info(f"- Document name: {appointment.document.name}")
                    logger.info(f"- Document URL: {appointment.document.url}")
                    logger.info(f"- Document storage: {appointment.document.storage}")
            
            return appointments
        except Exception as e:
            logger.error(f"Error fetching patient appointments: {str(e)}", exc_info=True)
            raise

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            logger.info(f"Found {queryset.count()} appointments")
            serializer = self.get_serializer(queryset, many=True)
            logger.info("Successfully serialized appointments")
            logger.info(f"Serialized data: {serializer.data}")
            return Response({
                'success': True,
                'message': 'Appointments retrieved successfully',
                'data': serializer.data
            })
        except Exception as e:
            logger.error(f"Error in PatientScheduleView.list: {str(e)}", exc_info=True)
            return Response({
                'success': False,
                'message': f'Error retrieving appointments: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

            logger.info(f"Fetching appointments for doctor: {request.user.id}")
            
            doctor_profile = request.user.doctor_profile
            appointments = Appointment.objects.filter(
                doctor=doctor_profile
            ).select_related(
                'patient',
                'doctor'
            )
            
            logger.info(f"Found {appointments.count()} appointments")
            
            serializer = AppointmentSerializer(appointments, many=True)
            serialized_data = serializer.data
            logger.info(f"Serialized data: {serialized_data}")
            
            return Response({
                'success': True,
                'message': 'Appointments retrieved successfully',
                'data': serialized_data
            })
        except Exception as e:
            logger.error(f"Error in DoctorScheduleView: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DoctorSearchView(generics.ListAPIView):
    serializer_class = DoctorProfileSerializer
    permission_classes = []  # Allow public access

    def get_queryset(self):
        queryset = DoctorProfile.objects.filter(is_approved=True)
        
        # Basic filters
        name = self.request.query_params.get('name', None)
        specialty = self.request.query_params.get('specialty', None)
        location = self.request.query_params.get('location', None)
        
        # Experience range
        min_experience = self.request.query_params.get('min_experience', None)
        max_experience = self.request.query_params.get('max_experience', None)
        
        # Rating range
        min_rating = self.request.query_params.get('min_rating', None)
        max_rating = self.request.query_params.get('max_rating', None)
        
        # Sorting
        sort_by = self.request.query_params.get('sort_by', 'name')
        sort_order = self.request.query_params.get('sort_order', 'asc')

        # Apply name filter
        if name:
            name_parts = [part.strip() for part in name.split() if part.strip()]
            if len(name_parts) >= 2:
                first_name = name_parts[0]
                last_name = name_parts[-1]
                queryset = queryset.filter(
                    Q(user__first_name__icontains=first_name) &
                    Q(user__last_name__icontains=last_name)
                )
            else:
                queryset = queryset.filter(
                    Q(user__first_name__icontains=name) |
                    Q(user__last_name__icontains=name)
                )
        
        # Apply specialty filter
        if specialty:
            queryset = queryset.filter(specialty__icontains=specialty)
            
        # Apply location filter
        if location:
            queryset = queryset.filter(office_address__icontains=location)

        # Apply experience range filter
        if min_experience:
            try:
                min_exp = int(min_experience)
                if min_exp >= 0:
                    queryset = queryset.filter(years_of_experience__gte=min_exp)
            except (ValueError, TypeError):
                pass

        if max_experience:
            try:
                max_exp = int(max_experience)
                if max_exp >= 0:
                    queryset = queryset.filter(years_of_experience__lte=max_exp)
            except (ValueError, TypeError):
                pass

        # Apply rating range filter
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
        if max_rating:
            queryset = queryset.filter(rating__lte=max_rating)

        # Apply sorting
        sort_field = {
            'name': 'user__first_name',
            'experience': 'years_of_experience',
            'rating': 'rating',
            'fee': 'appointment_cost'
        }.get(sort_by, 'user__first_name')

        if sort_order == 'desc':
            sort_field = f'-{sort_field}'

        queryset = queryset.order_by(sort_field)

        return queryset

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            
            logger.info(f"Found {queryset.count()} doctors matching search criteria")
            
            return Response({
                'success': True,
                'message': 'Doctors retrieved successfully',
                'data': serializer.data
            })
        except Exception as e:
            logger.error(f"Error in doctor search: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
                appointment_date__year=year,
                appointment_date__month=month
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
                    appointment_date=slot.date,
                    start_time=slot.start_time
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
            logger.info(f"Received admin registration request with data: {request.data}")
            
            # Validate required fields
            required_fields = ['email', 'password', 'first_name', 'last_name']
            for field in required_fields:
                if field not in request.data:
                    logger.error(f"Missing required field: {field}")
                    return Response({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }, status=status.HTTP_400_BAD_REQUEST)

            # Validate email format
            if not '@' in request.data['email']:
                logger.error(f"Invalid email format: {request.data['email']}")
                return Response({
                    'success': False,
                    'message': 'Invalid email format'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Check if user already exists
            if CustomUser.objects.filter(email=request.data['email']).exists():
                logger.error(f"User with email {request.data['email']} already exists")
                return Response({
                    'success': False,
                    'message': 'User with this email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create the user
            try:
                user = CustomUser.objects.create_user(
                    username=request.data['email'],  # Use email as username
                    email=request.data['email'],
                    password=request.data['password'],
                    first_name=request.data['first_name'],
                    last_name=request.data['last_name'],
                    user_type='admin',
                    is_staff=True,
                    is_superuser=True
                )
                logger.info(f"Admin user created successfully: {user.email}")
            except Exception as e:
                logger.error(f"Error creating user: {str(e)}")
                return Response({
                    'success': False,
                    'message': f'Error creating user: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
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
            logger.error(f"Unexpected error in admin registration: {str(e)}")
            return Response({
                'success': False,
                'message': f'Unexpected error: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_doctor_details(request, doctor_id):
    try:
        logger.info(f"Fetching details for doctor ID: {doctor_id}")
        logger.info(f"Checking if doctor exists in database...")
        
        # First check if the doctor exists
        try:
            # Get all doctors and log their IDs
            all_doctors = DoctorProfile.objects.all()
            logger.info(f"Available doctor IDs: {list(all_doctors.values_list('id', flat=True))}")
            
            doctor = DoctorProfile.objects.get(id=doctor_id)
            logger.info(f"Found doctor: {doctor}")
            logger.info(f"Doctor data: user={doctor.user}, specialty={doctor.specialty}, office_hours={doctor.office_hours_start}-{doctor.office_hours_end}")
            
        except DoctorProfile.DoesNotExist:
            logger.warning(f"Doctor with ID {doctor_id} not found")
            return Response(
                {
                    'success': False,
                    'error': 'Doctor not found',
                    'message': f'No doctor found with ID {doctor_id}'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if required fields are present
        if not doctor.office_hours_start or not doctor.office_hours_end:
            logger.warning(f"Doctor {doctor_id} has missing office hours")
            return Response(
                {
                    'success': False,
                    'error': 'Incomplete doctor profile',
                    'message': 'Doctor profile is incomplete (missing office hours)'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        logger.info("Serializing doctor data...")
        serializer = DoctorProfileSerializer(doctor, context={'request': request})
        logger.info(f"Serialized data: {serializer.data}")
        logger.info(f"Successfully retrieved doctor details for ID: {doctor_id}")
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    except Exception as e:
        logger.error(f"Error fetching doctor details for ID {doctor_id}: {str(e)}", exc_info=True)
        return Response(
            {
                'success': False,
                'error': 'Failed to fetch doctor details',
                'message': str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def get_doctor_availability(request, doctor_id, date):
    try:
        logger.info(f"Fetching availability for doctor {doctor_id} on date {date}")
        
        # Get the doctor
        try:
            doctor = DoctorProfile.objects.get(id=doctor_id)
        except DoctorProfile.DoesNotExist:
            logger.warning(f"Doctor with ID {doctor_id} not found")
            return Response(
                {
                    'success': False,
                    'error': 'Doctor not found',
                    'message': f'No doctor found with ID {doctor_id}'
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Parse the date
        try:
            selected_date = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            logger.error(f"Invalid date format: {date}")
            return Response(
                {
                    'success': False,
                    'error': 'Invalid date',
                    'message': 'Date must be in YYYY-MM-DD format'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if office hours are set
        if not doctor.office_hours_start or not doctor.office_hours_end:
            logger.warning(f"Doctor {doctor_id} has no office hours set")
            return Response(
                {
                    'success': False,
                    'error': 'No office hours',
                    'message': 'Doctor has not set their office hours'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate 1-hour slots
        slots = []
        current_time = datetime.combine(selected_date, doctor.office_hours_start)
        end_datetime = datetime.combine(selected_date, doctor.office_hours_end)
        
        while current_time < end_datetime:
            slot_end = current_time + timedelta(hours=1)
            if slot_end > end_datetime:
                break
                
            # Check if slot is already booked
            is_available = not Appointment.objects.filter(
                doctor=doctor,
                appointment_date=selected_date,
                start_time=current_time.time(),
                end_time=slot_end.time()
            ).exists()
            
            slots.append({
                'id': len(slots) + 1,
                'start_time': current_time.strftime('%H:%M'),
                'end_time': slot_end.strftime('%H:%M'),
                'is_available': is_available
            })
            
            current_time = slot_end
        
        logger.info(f"Generated {len(slots)} slots for doctor {doctor_id} on {date}")
        return Response({
            'success': True,
            'slots': slots
        })
        
    except Exception as e:
        logger.error(f"Error generating availability for doctor {doctor_id} on {date}: {str(e)}", exc_info=True)
        return Response(
            {
                'success': False,
                'error': 'Failed to get availability',
                'message': str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class CreateAppointmentView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            logger.info("=== START OF APPOINTMENT CREATION ===")
            logger.info(f"Request data: {request.data}")
            logger.info(f"Request files: {request.FILES}")
            
            # Get patient (CustomUser)
            patient = request.user
            
            # Get doctor
            doctor_id = request.data.get('doctor')
            if not doctor_id:
                return Response(
                    {'error': 'Doctor ID is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                # Convert doctor_id to integer since it comes as a string from FormData
                doctor = DoctorProfile.objects.get(id=int(doctor_id))
            except (DoctorProfile.DoesNotExist, ValueError):
                return Response(
                    {'error': 'Doctor not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Validate appointment date and time
            appointment_date = request.data.get('appointment_date')
            start_time = request.data.get('start_time')
            end_time = request.data.get('end_time')

            if not all([appointment_date, start_time, end_time]):
                return Response(
                    {'error': 'Appointment date, start time, and end time are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if the time slot is available
            existing_appointment = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=appointment_date,
                start_time=start_time,
                end_time=end_time,
                status__in=['pending', 'confirmed']
            ).exists()

            if existing_appointment:
                return Response(
                    {'error': 'This time slot is already booked'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create appointment
            appointment_data = {
                'patient': patient.id,
                'doctor': doctor.id,
                'appointment_date': appointment_date,
                'start_time': start_time,
                'end_time': end_time,
                'status': 'pending',
                'reason': request.data.get('reason', ''),
                'notes': request.data.get('notes', ''),
            }

            # Handle document upload
            if 'document' in request.FILES:
                logger.info("Document found in request.FILES")
                document = request.FILES['document']
                logger.info(f"Document name: {document.name}")
                logger.info(f"Document size: {document.size}")
                logger.info(f"Document content type: {document.content_type}")
                appointment_data['document'] = document
            else:
                logger.info("No document found in request.FILES")

            logger.info(f"Final appointment data: {appointment_data}")
            serializer = AppointmentSerializer(data=appointment_data, context={'request': request})
            
            if serializer.is_valid():
                logger.info("Serializer is valid")
                appointment = serializer.save()
                logger.info(f"Appointment saved with ID: {appointment.id}")
                if appointment.document:
                    logger.info(f"Document saved: {appointment.document.name}")
                    logger.info(f"Document URL: {appointment.document.url}")
                
                # Try to send confirmation emails, but don't fail if they don't send
                try:
                    # Send confirmation email to patient
                    send_mail(
                        'Appointment Confirmation',
                        f'Your appointment with Dr. {doctor.user.get_full_name()} has been scheduled for {appointment_date} at {start_time}.',
                        settings.DEFAULT_FROM_EMAIL,
                        [patient.email],
                        fail_silently=True,  # Set to True to prevent email errors from affecting the appointment creation
                    )
                    
                    # Send notification to doctor
                    send_mail(
                        'New Appointment Request',
                        f'You have a new appointment request from {patient.get_full_name()} for {appointment_date} at {start_time}.',
                        settings.DEFAULT_FROM_EMAIL,
                        [doctor.user.email],
                        fail_silently=True,  # Set to True to prevent email errors from affecting the appointment creation
                    )
                except Exception as e:
                    # Log the email error but don't let it affect the appointment creation
                    logger.error(f"Failed to send confirmation emails: {str(e)}")
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                logger.error(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            logger.error(f"Error creating appointment: {str(e)}", exc_info=True)
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ConfirmAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            # Get the appointment
            appointment = get_object_or_404(Appointment, pk=pk)
            
            # Ensure that only doctors can confirm appointments
            if request.user.user_type != 'doctor':
                return Response({
                    'success': False,
                    'message': 'Only doctors can confirm appointments.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Ensure the doctor is confirming their own appointment
            if appointment.doctor.user != request.user:
                return Response({
                    'success': False,
                    'message': 'You can only confirm your own appointments.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Update appointment status
            appointment.status = 'confirmed'
            appointment.save()
            
            # Send confirmation email to patient
            try:
                subject = "Appointment Confirmed"
                message = (
                    f"Dear {appointment.patient.first_name},\n\n"
                    f"Your appointment with Dr. {appointment.doctor.user.get_full_name()} "
                    f"on {appointment.appointment_date} at {appointment.start_time} has been confirmed.\n\n"
                    f"Location: {appointment.doctor.office_address}\n\n"
                    f"Best regards,\nHealix Team"
                )
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [appointment.patient.email]
                )
            except Exception as e:
                logger.error(f"Failed to send confirmation email: {e}")
            
            serializer = AppointmentSerializer(appointment)
            return Response({
                'success': True,
                'message': 'Appointment confirmed successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error confirming appointment: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DeleteAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            appointment = get_object_or_404(Appointment, pk=pk)
            
            # Check if the user is either the doctor or the patient of the appointment
            is_doctor = request.user.user_type == 'doctor' and appointment.doctor.user == request.user
            is_patient = request.user == appointment.patient
            
            if not (is_doctor or is_patient):
                return Response({
                    'success': False,
                    'message': 'You can only delete your own appointments.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Check if the appointment is cancelled
            if appointment.status != 'cancelled':
                return Response({
                    'success': False,
                    'message': 'Only cancelled appointments can be deleted.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Delete the appointment
            appointment.delete()
            
            return Response({
                'success': True,
                'message': 'Appointment deleted successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error deleting appointment: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        