from rest_framework import serializers
from .models import CustomUser, DoctorProfile, PatientProfile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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

class DoctorSignupSerializer(serializers.Serializer):
    # Frontend fields
    firstName = serializers.CharField(max_length=150)
    lastName = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    phoneNumber = serializers.CharField(max_length=15)
    officeNumber = serializers.CharField(max_length=50)  # Will map to license_number
    officeAddress = serializers.CharField(max_length=100)  # Will map to specialty
    birthDate = serializers.DateField()
    medicalLicense = serializers.FileField()
    phdCertificate = serializers.FileField(required=False, allow_null=True)

    def create(self, validated_data):
        # Create CustomUser
        user = CustomUser.objects.create_user(
            username=validated_data['email'],  # Using email as username
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['firstName'],
            last_name=validated_data['lastName'],
            user_type='doctor',
            dob=validated_data['birthDate']
        )

        # Create DoctorProfile
        doctor_profile = DoctorProfile.objects.create(
            user=user,
            specialty=validated_data['officeAddress'],  # Mapping office address to specialty
            license_number=validated_data['officeNumber'],  # Mapping office number to license_number
            certificate=validated_data['medicalLicense']  # Using medical license as certificate
        )

        return {
            'success': True,
            'message': 'Doctor registration successful',
            'email': user.email
        }

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

class PatientSignupSerializer(serializers.Serializer):
    firstName = serializers.CharField(max_length=150)
    lastName = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    phoneNumber = serializers.CharField(max_length=15)
    birthDate = serializers.DateField()

    def create(self, validated_data):
        # Create CustomUser with correct field mappings
        user = CustomUser.objects.create_user(
            username=validated_data['email'].split('@')[0],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['firstName'],
            last_name=validated_data['lastName'],
            user_type='patient',
            dob=validated_data['birthDate']
        )

        # Create PatientProfile
        patient_profile = PatientProfile.objects.create(
            user=user,
            phone_number=validated_data['phoneNumber']
        )

        return {
            'user': user,
            'profile': patient_profile
        }

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['email'] = user.email
        token['user_type'] = user.user_type
        token['username'] = user.username

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        
        # Add user data to response
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'user_type': self.user.user_type,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name
        }
        
        return data
