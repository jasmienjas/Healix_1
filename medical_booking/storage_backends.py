from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings
import logging

logger = logging.getLogger('accounts')

class MediaStorage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False
    default_acl = 'private'

class CustomS3Boto3Storage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False
    default_acl = 'private'
    
    def url(self, name, parameters=None, expire=None):
        """
        Generate the URL for the file with the correct region and path.
        """
        logger.info(f"Generating URL for file: {name}")
        
        # Ensure the name is properly formatted
        name = self._normalize_name(self._clean_name(name))
        logger.info(f"Normalized name: {name}")
        
        # Generate the URL using the custom domain if set
        if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
            url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{name}"
            logger.info(f"Generated URL with custom domain: {url}")
            return url
        
        # If no custom domain, use the default S3 URL
        url = super().url(name, parameters, expire)
        logger.info(f"Generated URL with default S3: {url}")
        
        # Always ensure the correct region is used
        if 'europe' in url or 'stockholm' in url:
            url = url.replace('europe (stockholm)', 'eu-north-1')
            url = url.replace('europe%20(stockholm)', 'eu-north-1')
            url = url.replace('europe%20%28stockholm%29', 'eu-north-1')
            logger.info(f"Corrected URL region: {url}")
        
        return url 