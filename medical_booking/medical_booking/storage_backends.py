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
        
        # Extract account ID from the access point URL
        account_id = '784439927722'
        self.access_point_name = 'healix'
        self.access_point_url = f"https://{self.access_point_name}-{account_id}.s3-accesspoint.{settings.AWS_S3_REGION_NAME}.amazonaws.com"
        
        logger.info(f"Initializing S3 storage with access point URL: {self.access_point_url}")
        
        # Create a new client using the access point and SigV4
        self.client = boto3.client(
            's3',
            region_name=settings.AWS_S3_REGION_NAME,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=config
        )
    
    def _clean_name(self, name):
        """
        Clean the file name to ensure it's properly formatted for S3.
        """
        logger.info(f"Cleaning name: {name}")
        # Remove any leading slashes
        while name and name[0] == '/':
            name = name[1:]
            
        # Handle full URLs or ARNs
        if any(name.startswith(prefix) for prefix in ['http://', 'https://', 'arn:aws:s3:']):
            # Extract just the file path portion after media/
            try:
                parts = name.split('media/')
                if len(parts) > 1:
                    name = parts[1]
            except Exception as e:
                logger.error(f"Error cleaning name: {e}")
                
        # Ensure the name doesn't start with media/ if location is already media
        if name.startswith(f"{self.location}/"):
            name = name[len(self.location)+1:]
            
        logger.info(f"Cleaned name: {name}")
        return name
    
    def _normalize_name(self, name):
        """
        Normalize the file name for S3 storage.
        """
        logger.info(f"Normalizing name: {name}")
        name = self._clean_name(name)
        # Add location prefix if it's not already there
        if not name.startswith(f"{self.location}/"):
            name = f"{self.location}/{name}"
        logger.info(f"Normalized name: {name}")
        return name
    
    def url(self, name, parameters=None, expire=None):
        """
        Generate the URL for the file with the correct region and path.
        """
        logger.info(f"Generating URL for file: {name}")
        
        try:
            if not name:
                logger.warning("Empty name provided to url method")
                return None
                
            # Clean and normalize the name
            clean_name = self._clean_name(name)
            normalized_name = self._normalize_name(clean_name)
            logger.info(f"Cleaned and normalized name: {normalized_name}")
            
            # Generate presigned URL with SigV4
            try:
                url = self.client.generate_presigned_url(
                    'get_object',
                    Params={
                        'Bucket': f"{self.access_point_name}-{784439927722}",
                        'Key': normalized_name
                    },
                    ExpiresIn=3600,  # URL expires in 1 hour
                )
                logger.info(f"Generated presigned URL: {url}")
                return url
            except Exception as e:
                logger.error(f"Error generating presigned URL: {e}")
                return None
            
        except Exception as e:
            logger.error(f"Error in url method: {str(e)}", exc_info=True)
            return None 