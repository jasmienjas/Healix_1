from rest_framework import serializers
from .models import CustomUser, DoctorProfile, PatientProfile, Appointment
#from django.core.files.storage import default_storage, Appointment 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type']

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorProfile
        fields = ['user', 'specialty', 'license_number', 'certificate']
class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = DoctorProfile
        fields = [
            'id',
            'user',
            'specialty',
            'office_address',
            'office_number',
        ]
class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['user', 'age', 'medical_history']

class PatientRegisterSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(write_only=True)
    lastName = serializers.CharField(write_only=True)
    phoneNumber = serializers.CharField(write_only=True)
    birthDate = serializers.DateField(write_only=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'firstName', 'lastName', 'email', 'password', 'phoneNumber', 'birthDate']

    def create(self, validated_data):
        try:
            # Create username from first and last name
            username = f"{validated_data['firstName'].lower()}_{validated_data['lastName'].lower()}"
            
            # Create user
            user = CustomUser.objects.create_user(
                username=username,
                email=validated_data['email'],
                password=validated_data['password'],
                user_type='patient',
                dob=validated_data['birthDate'],
                first_name=validated_data['firstName'],
                last_name=validated_data['lastName']
            )

            # Create patient profile
            PatientProfile.objects.create(
                user=user,
                phone_number=validated_data['phoneNumber']
            )

            return user
        except Exception as e:
            print(f"Error in create method: {str(e)}")
            raise serializers.ValidationError(str(e))

    def to_representation(self, instance):
        return {
            'success': True,
            'message': 'Registration successful',
            'data': {
                'id': instance.id,
                'email': instance.email,
                'firstName': instance.first_name,
                'lastName': instance.last_name,
                'user_type': 'patient'
            }
        }

    def to_representation(self, instance):
        return {
            'success': True,
            'message': 'Registration successful',
            'data': {
                'id': instance.id,
                'email': instance.email,
                'firstName': instance.first_name,
                'lastName': instance.last_name,
                'user_type': 'patient'
            }
        }

class DoctorRegisterSerializer(serializers.ModelSerializer):
    # Fields from frontend
    firstName = serializers.CharField(write_only=True)
    lastName = serializers.CharField(write_only=True)
    phoneNumber = serializers.CharField(write_only=True)
    officeNumber = serializers.CharField(write_only=True)
    officeAddress = serializers.CharField(write_only=True)
    birthDate = serializers.DateField(source='dob')
    medicalLicense = serializers.FileField(write_only=True)
    phdCertificate = serializers.FileField(source='phd_certificate')

    class Meta:
        model = CustomUser
        fields = [
            'id', 'firstName', 'lastName', 'email', 'password',
            'phoneNumber', 'officeNumber', 'officeAddress',
            'birthDate', 'medicalLicense', 'phdCertificate'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        # Keep original certificate validation
        if 'phd_certificate' not in attrs:
            raise serializers.ValidationError({'phdCertificate': 'Certificate is required for doctors.'})
        return attrs

    def create(self, validated_data):
        # Extract frontend fields
        first_name = validated_data.pop('firstName')
        last_name = validated_data.pop('lastName')
        phone_number = validated_data.pop('phoneNumber')
        office_number = validated_data.pop('officeNumber')
        office_address = validated_data.pop('officeAddress')
        medical_license = validated_data.pop('medicalLicense')
        phd_certificate = validated_data.pop('phd_certificate')  # Note: this comes from source='phd_certificate' mapping

        # Create username
        username = f"dr_{first_name.lower()}_{last_name.lower()}"

        # Create user
        user = CustomUser.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            user_type='doctor',
            dob=validated_data['dob'],
            first_name=first_name,
            last_name=last_name
        )

        # Save files with unique names
        medical_license_path = f"licenses/{username}_{medical_license.name}"
        phd_certificate_path = f"certificates/{username}_{phd_certificate.name}"
        
        default_storage.save(medical_license_path, medical_license)
        default_storage.save(phd_certificate_path, phd_certificate)

        # Create doctor profile
        DoctorProfile.objects.create(
            user=user,
            phone_number=phone_number,
            office_number=office_number,
            office_address=office_address,
            medical_license=medical_license_path,
            certificate=phd_certificate_path,
            specialty='',  # Keeping from original functionality
            license_number=''  # Keeping from original functionality
        )

        return user

    def to_representation(self, instance):
        return {
            'success': True,
            'message': 'Registration successful. Please wait for admin approval.',
            'data': {
                'id': instance.id,
                'email': instance.email,
                'firstName': instance.first_name,
                'lastName': instance.last_name,
                'user_type': 'doctor'
            }
        }

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient',
            'doctor',
            'appointment_datetime',
            'status',
            'reason',
            'created_at',
            'updated_at'
        ]
        depth = 2  # This will include nested serialization of patient and doctor