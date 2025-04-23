from rest_framework import serializers
from .models import CustomUser, DoctorProfile, PatientProfile, Appointment
from django.core.files.storage import default_storage
import os
from datetime import datetime
import logging
import boto3
from botocore.config import Config
from django.conf import settings

logger = logging.getLogger('accounts')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'user_type', 'first_name', 'last_name']

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
            logger.info("No profile picture found")
            return None
            
        try:
            # Debug logging
            logger.info(f"Profile picture name: {obj.profile_picture.name}")
            logger.info(f"Profile picture storage: {obj.profile_picture.storage}")
            logger.info(f"Storage class: {obj.profile_picture.storage.__class__.__name__}")
            
            # If we're using S3 storage, construct the URL directly
            if hasattr(obj.profile_picture.storage, 'bucket_name'):
                # Get the bucket name
                bucket_name = obj.profile_picture.storage.bucket_name
                logger.info(f"Bucket name: {bucket_name}")
                
                # Ensure the file name is properly encoded
                file_name = obj.profile_picture.name.replace(' ', '%20')
                logger.info(f"Encoded file name: {file_name}")
                
                # Always generate a new URL with the correct region
                s3_url = f"https://{bucket_name}.s3.eu-north-1.amazonaws.com/{file_name}"
                logger.info(f"Generated new S3 URL: {s3_url}")
                
                # Double check the URL format
                if 'europe' in s3_url or 'stockholm' in s3_url:
                    logger.warning(f"Invalid region format detected in URL: {s3_url}")
                    # Force the correct format
                    s3_url = s3_url.replace('europe (stockholm)', 'eu-north-1')
                    s3_url = s3_url.replace('europe%20(stockholm)', 'eu-north-1')
                    s3_url = s3_url.replace('europe%20%28stockholm%29', 'eu-north-1')
                    logger.info(f"Corrected S3 URL: {s3_url}")
                
                return s3_url
            
            # For local storage, build the absolute URL
            request = self.context.get('request')
            if request:
                url = request.build_absolute_uri(obj.profile_picture.url)
                logger.info(f"Generated local URL: {url}")
                return url
            url = obj.profile_picture.url
            logger.info(f"Generated simple URL: {url}")
            return url
            
        except Exception as e:
            logger.error(f"Error generating profile picture URL: {str(e)}", exc_info=True)
            return None

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['user', 'age', 'medical_history']

class PatientRegisterSerializer(serializers.ModelSerializer):
    # Fields from frontend
    firstName = serializers.CharField(write_only=True)
    lastName = serializers.CharField(write_only=True)
    phoneNumber = serializers.CharField(write_only=True)
    birthDate = serializers.DateField(write_only=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    verificationToken = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ['id', 'firstName', 'lastName', 'email', 'password', 'phoneNumber', 'birthDate', 'verificationToken']

    def create(self, validated_data):
        try:
            # Extract patient-specific data
            phone_number = validated_data.pop('phoneNumber')
            birth_date = validated_data.pop('birthDate')
            verification_token = validated_data.pop('verificationToken', None)
            
            # Create the user with dob field
            user = CustomUser.objects.create_user(
                username=validated_data['email'],  # Use email as username
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=validated_data['firstName'],
                last_name=validated_data['lastName'],
                user_type='patient',
                dob=birth_date,  # Map birthDate to dob
                verification_token=verification_token
            )
            
            # Create the patient profile with minimal required fields
            try:
                PatientProfile.objects.create(
                    user=user,
                    phone_number=phone_number,
                    birth_date=birth_date
                )
            except Exception as e:
                # Log the error but continue since user is created
                logger.warning(f"Error creating patient profile: {str(e)}")
            
            return user
        except Exception as e:
            # Log the error for debugging
            logger.error(f"Error in PatientRegisterSerializer.create: {str(e)}")
            raise

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
    licenseNumber = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'firstName', 'lastName', 'email', 'password',
            'phoneNumber', 'officeNumber', 'officeAddress',
            'birthDate', 'medicalLicense', 'phdCertificate', 'licenseNumber'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        print("Validating data:", attrs)
        if not attrs.get('medicalLicense'):
            raise serializers.ValidationError({'medicalLicense': 'Medical license is required.'})
        if not attrs.get('phdCertificate'):
            raise serializers.ValidationError({'phdCertificate': 'PhD certificate is required.'})
        if not attrs.get('licenseNumber'):
            raise serializers.ValidationError({'licenseNumber': 'Medical license number is required.'})
        print("License number in validation:", attrs.get('licenseNumber'))
        return attrs

    def create(self, validated_data):
        try:
            print("Starting doctor registration process")
            print("Validated data:", validated_data)
            
            # Extract frontend fields
            first_name = validated_data.pop('firstName')
            last_name = validated_data.pop('lastName')
            phone_number = validated_data.pop('phoneNumber')
            office_number = validated_data.pop('officeNumber')
            office_address = validated_data.pop('officeAddress')
            medical_license = validated_data.pop('medicalLicense')
            phd_certificate = validated_data.pop('phdCertificate')
            license_number = validated_data.pop('licenseNumber')

            print(f"Extracted data: first_name={first_name}, last_name={last_name}, email={validated_data['email']}, license_number={license_number}")

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

            try:
                # Generate unique filenames
                medical_license_name = f"medical_licenses/{username}_{timestamp}_{medical_license.name}"
                phd_certificate_name = f"certificates/{username}_{timestamp}_{phd_certificate.name}"

                print(f"Saving files: {medical_license_name}, {phd_certificate_name}")

                # Save files to storage
                medical_license_path = default_storage.save(medical_license_name, medical_license)
                phd_certificate_path = default_storage.save(phd_certificate_name, phd_certificate)

                print(f"Files saved: {medical_license_path}, {phd_certificate_path}")

                # Create doctor profile
                print(f"Creating doctor profile")
                doctor_profile_data = {
                    'user': user,
                    'phone_number': phone_number,
                    'office_number': office_number,
                    'office_address': office_address,
                    'medical_license': medical_license_path,
                    'certificate': phd_certificate_path,
                    'specialty': 'General Medicine',
                    'appointment_cost': 0.00,
                    'office_hours_start': '09:00:00',
                    'office_hours_end': '17:00:00',
                    'bio': '',
                    'years_of_experience': 0,
                    'education': ''
                }
                print("Doctor profile data:", doctor_profile_data)
                doctor_profile = DoctorProfile.objects.create(**doctor_profile_data)
                print(f"Doctor profile created: {doctor_profile}")

                return user

            except Exception as e:
                print(f"Error in profile creation: {str(e)}")
                # Only delete the user if it was created
                if user and user.id:
                    user.delete()
                raise serializers.ValidationError(f"Error creating doctor profile: {str(e)}")

        except Exception as e:
            print(f"Error in create method: {str(e)}")
            raise serializers.ValidationError(f"Error in registration: {str(e)}")

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
    patient_name = serializers.SerializerMethodField()
    patient_email = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    doctor_email = serializers.SerializerMethodField()
    document_url = serializers.SerializerMethodField()
    doctor_office_address = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'patient_email',
            'doctor', 'doctor_name', 'doctor_email', 'doctor_office_address',
            'appointment_date', 'start_time', 'end_time',
            'status', 'reason', 'notes', 'document', 'document_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_patient_email(self, obj):
        return obj.patient.email

    def get_doctor_name(self, obj):
        return f"{obj.doctor.user.first_name} {obj.doctor.user.last_name}"

    def get_doctor_email(self, obj):
        return obj.doctor.user.email

    def get_doctor_office_address(self, obj):
        return obj.doctor.office_address

    def get_document_url(self, obj):
        try:
            logger.info(f"Getting document URL for appointment {obj.id}")
            if not obj.document:
                logger.info("No document found for appointment")
                return None

            logger.info(f"Document name: {obj.document.name}")
            logger.info(f"Document storage: {obj.document.storage}")

            if settings.USE_S3:
                logger.info("Using S3 storage")
                try:
                    # Configure boto3 with Signature Version 4
                    config = Config(
                        signature_version='s3v4',
                        s3={'addressing_style': 'virtual'}
                    )
                    
                    s3_client = boto3.client(
                        's3',
                        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                        region_name=settings.AWS_S3_REGION_NAME,
                        config=config
                    )
                    
                    # Log the bucket and key being used
                    logger.info(f"Using bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
                    logger.info(f"Using key: {obj.document.name}")
                    
                    # Ensure the key has the media/ prefix
                    key = obj.document.name
                    if not key.startswith('media/'):
                        key = f"media/{key}"
                    
                    url = s3_client.generate_presigned_url(
                        'get_object',
                        Params={
                            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
                            'Key': key
                        },
                        ExpiresIn=3600
                    )
                    logger.info(f"Generated S3 presigned URL: {url}")
                    return url
                except Exception as e:
                    logger.error(f"Error generating S3 presigned URL: {str(e)}", exc_info=True)
                    return None
            else:
                logger.info("Using local storage")
                try:
                    request = self.context.get('request')
                    if request is not None:
                        url = request.build_absolute_uri(obj.document.url)
                        logger.info(f"Generated local URL: {url}")
                        return url
                    logger.warning("No request found in context")
                    return None
                except Exception as e:
                    logger.error(f"Error generating local URL: {str(e)}", exc_info=True)
                    return None
        except Exception as e:
            logger.error(f"Error in get_document_url: {str(e)}", exc_info=True)
            return None