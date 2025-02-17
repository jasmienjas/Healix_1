from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser, DoctorProfile
from .serializers import RegisterSerializer, DoctorSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

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
