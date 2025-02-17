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

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return response

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            print("🔍 Login Attempt:", request.data)  # ✅ Debugging Line
            
            # ✅ Use email instead of username
            user = CustomUser.objects.get(email=request.data['email'])

            print("🔑 Checking Password for:", user.email)
            print("Stored Password Hash:", user.password)

            if not user.check_password(request.data['password']):  
                print("❌ Password mismatch!")  # ✅ Debugging Line
                return Response({'error': 'Invalid credentials'}, status=400)

        except CustomUser.DoesNotExist:
            print("❌ User does not exist!")  # ✅ Debugging Line
            return Response({'error': 'Invalid credentials'}, status=400)

        # ✅ Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            'refresh': str(refresh),
            'access': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'user_type': user.user_type  
            }
        })
