from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, render, redirect
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.models import User
from django.urls import reverse
from datetime import datetime

from .models import CustomUser, DoctorProfile, Appointment
from .serializers import (
    RegisterSerializer,
    DoctorSerializer,
    UserSerializer,
    AppointmentSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return response

class DoctorRegisterView(generics.CreateAPIView):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorSerializer

class LoginView(TokenObtainPairView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        try:
            user = CustomUser.objects.get(email=request.data['email'])
            if not user.check_password(request.data['password']):
                return Response({'error': 'Invalid credentials'}, status=400)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=400)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type
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

        if request.user.user_type != 'patient':
            return Response({'error': 'Only doctors can postpone appointments.'}, status=status.HTTP_403_FORBIDDEN)

        new_datetime_str = request.data.get('appointment_datetime')
        postpone_reason = request.data.get('postpone_reason')

        if not new_datetime_str:
            return Response({'error': 'New appointment datetime is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not postpone_reason:
            return Response({'error': 'A postpone reason is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            new_datetime = datetime.fromisoformat(new_datetime_str)
        except Exception:
            return Response({'error': 'Invalid datetime format. Use ISO format (YYYY-MM-DDTHH:MM:SS).'}, status=status.HTTP_400_BAD_REQUEST)

        appointment.appointment_datetime = new_datetime
        appointment.status = 'postponed'
        appointment.reason = postpone_reason
        appointment.save()

        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CancelAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        appointment = get_object_or_404(Appointment, pk=pk)

        if request.user.user_type != 'doctor':
            return Response({'error': 'Only doctors can cancel appointments.'}, status=status.HTTP_403_FORBIDDEN)

        cancellation_message = request.data.get('cancellation_message')
        if not cancellation_message:
            return Response({'error': 'Cancellation message is required.'}, status=status.HTTP_400_BAD_REQUEST)

        appointment.status = 'cancelled'
        appointment.reason = cancellation_message
        appointment.save()

        patient_email = appointment.patient.user.email

        subject = "Appointment Cancellation Notice"
        message = (
            f"Dear {appointment.patient.user.username},\n\n"
            f"Your appointment scheduled on {appointment.appointment_datetime} has been cancelled by Dr. {appointment.doctor.user.username}.\n\n"
            f"Message from doctor: {cancellation_message}\n\n"
            f"Best regards,\nHealix Team"
        )
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [patient_email]

        try:
            send_mail(subject, message, from_email, recipient_list)
        except Exception as e:
            print(f"Failed to send cancellation email: {e}")

        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PatientScheduleView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(patient__user=self.request.user)
