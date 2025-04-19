from rest_framework import serializers
from .models import CustomUser, DoctorProfile, PatientProfile, Appointment
from django.core.files.storage import default_storage
import os
from datetime import datetime

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
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = DoctorProfile
        fields = [
            'id',
            'user',
            'specialty',
            'office_address',
            'office_number',
            'phone_number',
            'profile_picture',
            'profile_picture_url',
            'appointment_cost',
            'office_hours_start',
            'office_hours_end',
            'bio',
            'years_of_experience',
            'education'
        ]

    def get_profile_picture_url(self, obj):
        if not obj.profile_picture:
            return None
            
        try:
            # Debug logging
            print(f"Profile picture name: {obj.profile_picture.name}")
            print(f"Profile picture storage: {obj.profile_picture.storage}")
            
            # If we're using S3 storage, use the storage's url method
            if hasattr(obj.profile_picture.storage, 'url'):
                try:
                    # Get the URL directly from the storage backend
                    url = obj.profile_picture.storage.url(obj.profile_picture.name)
                    print(f"Generated S3 URL: {url}")  # Debug log
                    return url
                except Exception as e:
                    print(f"Error getting URL from storage: {str(e)}")
                    # Fallback to manual URL construction
                    bucket_name = obj.profile_picture.storage.bucket_name
                    region = obj.profile_picture.storage.connection.meta.region_name
                    # Use the standard AWS S3 URL format
                    s3_url = f"https://{bucket_name}.s3.{region}.amazonaws.com/{obj.profile_picture.name}"
                    print(f"Fallback S3 URL: {s3_url}")  # Debug log
                    return s3_url
            
            # For local storage, build the absolute URL
            request = self.context.get('request')
            if request:
                url = request.build_absolute_uri(obj.profile_picture.url)
                print(f"Generated local URL: {url}")  # Debug log
                return url
            url = obj.profile_picture.url
            print(f"Generated simple URL: {url}")  # Debug log
            return url
            
        except Exception as e:
            print(f"Error generating profile picture URL: {str(e)}")
            print(f"Error type: {type(e)}")
            return None

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

class DoctorRegisterSerializer(serializers.ModelSerializer):
    # Fields from frontend
    firstName = serializers.CharField(write_only=True)
    lastName = serializers.CharField(write_only=True)
    phoneNumber = serializers.CharField(write_only=True)
    officeNumber = serializers.CharField(write_only=True)
    officeAddress = serializers.CharField(write_only=True)
    birthDate = serializers.DateField(source='dob')
    medicalLicense = serializers.FileField(write_only=True)
    phdCertificate = serializers.FileField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'firstName', 'lastName', 'email', 'password',
            'phoneNumber', 'officeNumber', 'officeAddress',
            'birthDate', 'medicalLicense', 'phdCertificate'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if not attrs.get('medicalLicense'):
            raise serializers.ValidationError({'medicalLicense': 'Medical license is required.'})
        if not attrs.get('phdCertificate'):
            raise serializers.ValidationError({'phdCertificate': 'PhD certificate is required.'})
        return attrs

    def create(self, validated_data):
        try:
            print("Starting doctor registration process")
            # Extract frontend fields
            first_name = validated_data.pop('firstName')
            last_name = validated_data.pop('lastName')
            phone_number = validated_data.pop('phoneNumber')
            office_number = validated_data.pop('officeNumber')
            office_address = validated_data.pop('officeAddress')
            medical_license = validated_data.pop('medicalLicense')
            phd_certificate = validated_data.pop('phdCertificate')

            print(f"Extracted data: first_name={first_name}, last_name={last_name}, email={validated_data['email']}")

            # Create username
            username = f"dr_{first_name.lower()}_{last_name.lower()}"
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

            print(f"Creating user with username: {username}")

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

            print(f"User created with ID: {user.id}")

            # Generate unique filenames
            medical_license_name = f"medical_licenses/{username}_{timestamp}_{medical_license.name}"
            phd_certificate_name = f"certificates/{username}_{timestamp}_{phd_certificate.name}"

            print(f"Saving files: {medical_license_name}, {phd_certificate_name}")

            # Save files to storage
            medical_license_path = default_storage.save(medical_license_name, medical_license)
            phd_certificate_path = default_storage.save(phd_certificate_name, phd_certificate)

            print(f"Files saved: {medical_license_path}, {phd_certificate_path}")

            # Create doctor profile
            DoctorProfile.objects.create(
                user=user,
                phone_number=phone_number,
                office_number=office_number,
                office_address=office_address,
                medical_license=medical_license_path,
                certificate=phd_certificate_path,
                # Set default values for required fields
                specialty='General Medicine',  # This will be updated later
                appointment_cost=0.00,  # This will be updated later
                office_hours_start='09:00:00',  # This will be updated later
                office_hours_end='17:00:00',  # This will be updated later
                bio='',  # This will be updated later
                years_of_experience=0,  # This will be updated later
                education=''  # This will be updated later
            )

            print(f"Doctor profile created for user {user.id}")
            return user

        except Exception as e:
            print(f"Error in create method: {str(e)}")
            # If user was created but profile creation failed, delete the user
            if 'user' in locals():
                user.delete()
            raise serializers.ValidationError(str(e))

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