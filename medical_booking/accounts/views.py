from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser, DoctorProfile
from .serializers import RegisterSerializer, DoctorSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from datetime import datetime


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
            user = CustomUser.objects.get(email=request.data['email'])  # ✅ Use email instead of username
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
        

class PostponeAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        # Get the appointment object
        appointment = get_object_or_404(Appointment, pk=pk)
        
        # Ensure that only doctors can postpone appointments
        if request.user.user_type != 'patient':
            return Response({'error': 'Only doctors can postpone appointments.'},
                            status=status.HTTP_403_FORBIDDEN)
        
        # Expecting new datetime and a postponement reason in the request data
        new_datetime_str = request.data.get('appointment_datetime')
        postpone_reason = request.data.get('postpone_reason')
        
        if not new_datetime_str:
            return Response({'error': 'New appointment datetime is required.'},
                            status=status.HTTP_400_BAD_REQUEST)
        if not postpone_reason:
            return Response({'error': 'A postpone reason is required.'},
                            status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Parse the ISO format datetime string (e.g., "2025-03-10T09:00:00")
            new_datetime = datetime.fromisoformat(new_datetime_str)
        except Exception:
            return Response({'error': 'Invalid datetime format. Use ISO format (YYYY-MM-DDTHH:MM:SS).'},
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Update the appointment details
        appointment.appointment_datetime = new_datetime
        appointment.status = 'postponed'
        appointment.reason = postpone_reason  # Store the postponement reason
        appointment.save()
        
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class CancelAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        # Retrieve the appointment by primary key
        appointment = get_object_or_404(Appointment, pk=pk)
        
        # Check that only doctors can cancel appointments
        if request.user.user_type != 'doctor':
            return Response({'error': 'Only doctors can cancel appointments.'},
                            status=status.HTTP_403_FORBIDDEN)
        
        # Get cancellation message from the request data
        cancellation_message = request.data.get('cancellation_message')
        if not cancellation_message:
            return Response({'error': 'Cancellation message is required.'},
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Update the appointment status and store the cancellation message
        appointment.status = 'cancelled'
        appointment.reason = cancellation_message  # reusing the "reason" field to store the cancellation note
        appointment.save()
        
        # Retrieve the patient's email (assuming appointment.patient is a PatientProfile linked to a user)
        patient_email = appointment.patient.user.email
        
        # Prepare the email details
        subject = "Appointment Cancellation Notice"
        message = (
            f"Dear {appointment.patient.user.username},\n\n"
            f"Your appointment scheduled on {appointment.appointment_datetime} has been cancelled by Dr. {appointment.doctor.user.username}.\n\n"
            f"Message from doctor: {cancellation_message}\n\n"
            f"Best regards,\nHealix Team"
        )
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [patient_email]
        
        # Send the email notification to the patient
        try:
            send_mail(subject, message, from_email, recipient_list)
        except Exception as e:
            # Log the error; you may also choose to return a warning in the response
            print(f"Failed to send cancellation email: {e}")
        
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)

