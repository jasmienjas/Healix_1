from rest_framework import serializers
from .models import CustomUser, DoctorProfile, PatientProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type']

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    phd_certificate = serializers.FileField(required=False)  # Initially optional, we'll make it conditionally required

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'user_type', 'phd_certificate']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        """
        Ensure that a certificate is required for doctors.
        """
        user_type = attrs.get('user_type')
        if user_type == 'doctor' and not attrs.get('phd_certificate'):
            raise serializers.ValidationError({'phd_certificate': 'Certificate is required for doctors.'})
        return attrs

    def create(self, validated_data):
        # Extract the certificate if present
        phd_certificate = validated_data.pop('phd_certificate', None)

        # Create the user
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            user_type=validated_data.get('user_type', 'patient')  # Default to patient if user_type is not specified
        )

        # Create the doctor profile if the user is a doctor
        if user.user_type == 'doctor':
            if phd_certificate:
                DoctorProfile.objects.create(
                    user=user,
                    certificate=phd_certificate  # Save the certificate
                )
            else:
                raise ValueError("Certificate is required for doctors.")

        return user
