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
        
        # Configure access point
        self.account_id = '784439927722'
        self.access_point_name = 'healix'
        self.bucket_name = f"{self.access_point_name}-{self.account_id}"
        self.access_point_url = f"https://{self.bucket_name}.s3-accesspoint.{settings.AWS_S3_REGION_NAME}.amazonaws.com"
        
        logger.info(f"Initializing S3 storage with access point URL: {self.access_point_url}")
        
        # Create a new client using SigV4
        self.client = boto3.client(
            's3',
            region_name=settings.AWS_S3_REGION_NAME,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            config=config
        )
        
        # List objects in the bucket to verify access
        try:
            response = self.client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix='media/appointment_documents/'
            )
            logger.info("Available files in appointment_documents:")
            for obj in response.get('Contents', []):
                logger.info(f"Found file: {obj['Key']}")
        except Exception as e:
            logger.error(f"Error listing objects: {str(e)}")
    
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
        
        # Don't remove media/ prefix as it's part of the key
        logger.info(f"[CLEAN] Output name: {name}")
        return name
    
    def _normalize_name(self, name):
        """
        Normalize the file name for S3 storage.
        """
        logger.info(f"[NORMALIZE] Input name: {name}")
        name = self._clean_name(name)
        
        # Add media prefix if it's not already there and not starting with appointment_documents
        if not name.startswith('media/') and not name.startswith('appointment_documents/'):
            if name.startswith(f"{self.location}/"):
                name = name  # Keep as is since it already has the correct prefix
            else:
                name = f"{self.location}/{name}"
            
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
            
            # List all objects with similar prefix to help debug
            try:
                prefix = '/'.join(normalized_name.split('/')[:-1]) + '/'
                logger.info(f"[URL] Listing objects with prefix: {prefix}")
                response = self.client.list_objects_v2(
                    Bucket=self.bucket_name,
                    Prefix=prefix
                )
                for obj in response.get('Contents', []):
                    logger.info(f"[URL] Found similar file: {obj['Key']}")
            except Exception as e:
                logger.error(f"[URL] Error listing similar files: {str(e)}")
            
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