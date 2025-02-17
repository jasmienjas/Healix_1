from rest_framework import serializers
from .models import CustomUser, DoctorProfile, PatientProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type']

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = ['user', 'specialty', 'license_number', 'certificate']

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['user', 'age', 'medical_history']

class RegisterSerializer(serializers.ModelSerializer):
    phd_certificate = serializers.FileField(required=False)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'user_type', 'dob', 'phd_certificate']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs.get('user_type') == 'doctor' and 'phd_certificate' not in attrs:
            raise serializers.ValidationError({'phd_certificate': 'Certificate is required for doctors.'})
        return attrs

    def create(self, validated_data):
        phd_certificate = validated_data.pop('phd_certificate', None)

        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=validated_data.get('user_type', 'patient'),
            dob=validated_data.get('dob'),
        )

        if user.user_type == 'doctor':
            DoctorProfile.objects.create(user=user, certificate=phd_certificate)
        elif user.user_type == 'patient':
            PatientProfile.objects.create(user=user, age=25)  # ✅ Set a default age for patients

        return user
