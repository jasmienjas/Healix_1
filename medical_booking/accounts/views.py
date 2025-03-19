from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import logging
from .models import CustomUser, DoctorProfile, PatientProfile
from .serializers import RegisterSerializer, DoctorSignupSerializer, UserSerializer, PatientSignupSerializer
from .token_serializers import CustomTokenObtainPairSerializer

logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        # Format the response to include success flag
        data = {
            'success': True,
            'message': 'Registration successful! Please wait for admin approval.',
            **response.data  # Include the original response data
        }
        return Response(data, status=status.HTTP_201_CREATED)


class DoctorRegisterView(generics.CreateAPIView):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorSignupSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                user_data = serializer.save()
                response_data = {
                    'success': True,
                    'message': 'Registration successful! Please wait for admin approval.',
                    'id': user_data['user'].id,
                    'email': user_data['user'].email,
                    'username': user_data['user'].username,
                    'user_type': user_data['user'].user_type,
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'success': False,
                    'message': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'success': False,
            'message': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        print(f"Login attempt - Email: {email}")

        try:
            user = CustomUser.objects.get(email=email)
            print(f"Found user: {user.email}, username: {user.username}")

            authenticated_user = authenticate(username=user.username, password=password)
            
            if authenticated_user:
                print("Authentication successful")
                refresh = RefreshToken.for_user(authenticated_user)
                
                response_data = {
                    'success': True,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'id': authenticated_user.id,
                        'email': authenticated_user.email,
                        'username': authenticated_user.username,
                        'user_type': authenticated_user.user_type,
                        'first_name': authenticated_user.first_name,
                        'last_name': authenticated_user.last_name
                    }
                }
                print(f"Login successful, returning: {response_data}")
                
                response = Response(response_data)
                response.set_cookie(
                    'healix_auth_token',
                    str(refresh.access_token),
                    httponly=True,
                    samesite='Lax'
                )
                return response
            else:
                print("Password check failed")
                return Response({
                    'success': False,
                    'message': 'Invalid email or password'
                }, status=status.HTTP_400_BAD_REQUEST)

        except CustomUser.DoesNotExist:
            print(f"No user found with email: {email}")
            return Response({
                'success': False,
                'message': 'Invalid email or password'
            }, status=status.HTTP_400_BAD_REQUEST)


class PatientRegisterView(generics.CreateAPIView):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientSignupSerializer

    def create(self, request, *args, **kwargs):
        print(f"Received registration data: {request.data}")
        
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                user_data = serializer.save()
                user = user_data['user']
                
                # Set user as inactive until email is verified
                user.is_active = False
                user.save()
                
                # Send verification email logic here
                # For now, we'll just print it
                print(f"Verification email would be sent to: {user.email}")
                
                response_data = {
                    'success': True,
                    'message': 'Registration successful! Please check your email for verification.',
                    'data': {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username,
                        'user_type': user.user_type,
                        'requires_verification': True
                    }
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Error creating user: {str(e)}")
                return Response({
                    'success': False,
                    'message': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            print(f"Validation errors: {serializer.errors}")
            return Response({
                'success': False,
                'message': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
