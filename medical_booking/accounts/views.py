from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser
from .serializers import RegisterSerializer
from .token_serializers import CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            user = CustomUser.objects.get(username=request.data['username'])
            if not user.check_password(request.data['password']):
                return Response({'error': 'Invalid credentials'}, status=400)

        except CustomUser.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=400)

        if serializer.is_valid():
            tokens = serializer.validated_data  # ✅ Uses CustomTokenObtainPairSerializer

            return Response({
                'refresh': tokens['refresh'],
                'access': tokens['access'],  
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'user_type': user.user_type  # ✅ Ensure user_type is included
                }
            })

        return Response({'error': 'Invalid credentials'}, status=400)
