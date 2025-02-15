from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # ✅ Include user type inside the JWT token
        token['user_type'] = user.user_type if hasattr(user, 'user_type') else "unknown"


        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # ✅ Include user type in the response payload
        data['user_type'] = self.user.user_type  

        return data
