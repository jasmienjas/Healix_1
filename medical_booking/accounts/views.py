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
from datetime import datetime
from django.db.models import Q

import logging
import os

from .models import CustomUser, DoctorProfile, PatientProfile, Appointment
from .serializers import (
    UserSerializer,
    PatientRegisterSerializer,
    DoctorRegisterSerializer,
    AppointmentSerializer,
    DoctorProfileSerializer
)
from .token_serializers import CustomTokenObtainPairSerializer

logger = logging.getLogger(__name__)

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
        
class DoctorRegisterView(generics.CreateAPIView):
    """
    View for doctor registration.
    """
    serializer_class = DoctorRegisterSerializer
    parser_classes = (MultiPartParser, FormParser)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
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
        })

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

            doctor_profile = request.user.doctor_profile
            appointments = Appointment.objects.filter(doctor=doctor_profile)
            serializer = AppointmentSerializer(appointments, many=True)
            
            # Log the serialized data for debugging
            logger.info(f"Serialized appointments: {serializer.data}")
            
            return Response({
                'success': True,
                'message': 'Appointments retrieved successfully',
                'data': serializer.data
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

    def get(self, request):
        try:
            if request.user.user_type != 'doctor':
                return Response({
                    'success': False,
                    'message': 'Only doctors can access this endpoint'
                }, status=status.HTTP_403_FORBIDDEN)

            doctor_profile = request.user.doctor_profile
            serializer = DoctorProfileSerializer(doctor_profile)
            
            return Response({
                'success': True,
                'message': 'Profile retrieved successfully',
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)