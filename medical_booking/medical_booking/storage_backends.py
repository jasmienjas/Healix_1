from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings
import logging
import boto3
from botocore.config import Config

logger = logging.getLogger('accounts')

class MediaStorage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False
    default_acl = 'private'

class CustomS3Boto3Storage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False
    default_acl = 'private'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Configure boto3 with Signature Version 4
        config = Config(
            signature_version='s3v4',
            s3={'addressing_style': 'virtual'}
        )
        
        self.bucket_name = settings.AWS_STORAGE_BUCKET_NAME
        logger.info(f"Initializing S3 storage with bucket: {self.bucket_name}")
        
        # Create a new client using SigV4
        self.client = boto3.client(
            's3',
            region_name=settings.AWS_S3_REGION_NAME,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=config
        )
        
        # List ALL objects in the bucket to see what we have
        try:
            logger.info("=== LISTING ALL FILES IN BUCKET ===")
            paginator = self.client.get_paginator('list_objects_v2')
            for page in paginator.paginate(Bucket=self.bucket_name):
                for obj in page.get('Contents', []):
                    logger.info(f"Found file: {obj['Key']}")
            logger.info("=== END OF FILE LISTING ===")
        except Exception as e:
            logger.error(f"Error listing all objects: {str(e)}")
    
    def _clean_name(self, name):
        """
        Clean the file name to ensure it's properly formatted for S3.
        """
        logger.info(f"[CLEAN] Input name: {name}")
        
        # Remove any leading slashes
        while name and name[0] == '/':
            name = name[1:]
            
        # Handle full URLs
        if any(name.startswith(prefix) for prefix in ['http://', 'https://']):
            try:
                if 'media/' in name:
                    parts = name.split('media/')
                    if len(parts) > 1:
                        name = parts[1]
                elif 'appointment_documents/' in name:
                    parts = name.split('appointment_documents/')
                    if len(parts) > 1:
                        name = f"appointment_documents/{parts[1]}"
            except Exception as e:
                logger.error(f"Error cleaning name: {e}")
        
        logger.info(f"[CLEAN] Output name: {name}")
        return name
    
    def _normalize_name(self, name):
        """
        Normalize the file name for S3 storage.
        """
        logger.info(f"[NORMALIZE] Input name: {name}")
        name = self._clean_name(name)
        
        # Add media prefix if it's not already there
        if not name.startswith('media/'):
            name = f"media/{name}"
            
        logger.info(f"[NORMALIZE] Output name: {name}")
        return name
    
    def url(self, name, parameters=None, expire=None):
        """
        Generate the URL for the file with the correct region and path.
        """
        logger.info(f"[URL] Generating URL for file: {name}")
        
        try:
            if not name:
                logger.warning("[URL] Empty name provided to url method")
                return None
                
            # Clean and normalize the name
            clean_name = self._clean_name(name)
            normalized_name = self._normalize_name(clean_name)
            logger.info(f"[URL] Cleaned and normalized name: {normalized_name}")
            
            # Check if file exists
            try:
                self.client.head_object(
                    Bucket=self.bucket_name,
                    Key=normalized_name
                )
                logger.info(f"[URL] File exists at key: {normalized_name}")
            except Exception as e:
                logger.error(f"[URL] File does not exist at key: {normalized_name}")
                # Try without media prefix
                if normalized_name.startswith('media/'):
                    alt_name = normalized_name[6:]  # Remove 'media/'
                    try:
                        self.client.head_object(
                            Bucket=self.bucket_name,
                            Key=alt_name
                        )
                        logger.info(f"[URL] File exists at alternative key: {alt_name}")
                        normalized_name = alt_name
                    except Exception as e2:
                        logger.error(f"[URL] File also not found at alternative key: {alt_name}")
            
            # Generate presigned URL with SigV4
            try:
                url = self.client.generate_presigned_url(
                    'get_object',
                    Params={
                        'Bucket': self.bucket_name,
                        'Key': normalized_name
                    },
                    ExpiresIn=3600  # URL expires in 1 hour
                )
                logger.info(f"[URL] Generated presigned URL: {url}")
                return url
            except Exception as e:
                logger.error(f"[URL] Error generating presigned URL: {e}")
                return None
            
        except Exception as e:
            logger.error(f"[URL] Error in url method: {str(e)}", exc_info=True)
            return None
            
    def _save(self, name, content):
        """
        Save the file to S3 and log the exact path used.
        """
        logger.info(f"[SAVE] Saving file with name: {name}")
        cleaned_name = self._clean_name(name)
        normalized_name = self._normalize_name(cleaned_name)
        logger.info(f"[SAVE] Will save to key: {normalized_name}")
        name = super()._save(normalized_name, content)
        logger.info(f"[SAVE] File saved as: {name}")
        return name 