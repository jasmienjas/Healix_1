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
    
    def _clean_name(self, name):
        """
        Clean the file name to ensure it's properly formatted for S3.
        """
        # Remove any leading slashes
        while name and name[0] == '/':
            name = name[1:]
        return name
    
    def _normalize_name(self, name):
        """
        Normalize the file name for S3 storage.
        """
        # If name starts with media/ and location is media, remove the duplicate
        if name.startswith(f"{self.location}/"):
            name = name[len(self.location)+1:]
        # Ensure the location prefix is added
        if not name.startswith(f"{self.location}/"):
            name = f"{self.location}/{name}"
        return name
    
    def url(self, name, parameters=None, expire=None):
        """
        Generate the URL for the file with the correct region and path.
        """
        logger.info(f"Generating URL for file: {name}")
        
        try:
            # Clean and normalize the name
            clean_name = self._clean_name(name)
            normalized_name = self._normalize_name(clean_name)
            logger.info(f"Cleaned and normalized name: {normalized_name}")
            
            # Generate the URL using the custom domain if set
            if hasattr(settings, 'AWS_S3_CUSTOM_DOMAIN') and settings.AWS_S3_CUSTOM_DOMAIN:
                url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{normalized_name}"
                logger.info(f"Generated URL with custom domain: {url}")
                return url
            
            # If no custom domain, use the default S3 URL
            url = super().url(normalized_name, parameters, expire)
            logger.info(f"Generated URL with default S3: {url}")
            
            # Always ensure the correct region is used
            if 'europe' in url or 'stockholm' in url:
                url = url.replace('europe (stockholm)', 'eu-north-1')
                url = url.replace('europe%20(stockholm)', 'eu-north-1')
                url = url.replace('europe%20%28stockholm%29', 'eu-north-1')
                logger.info(f"Corrected URL region: {url}")
            
            return url
            
        except Exception as e:
            logger.error(f"Error generating URL for {name}: {str(e)}", exc_info=True)
            # Return a basic S3 URL as fallback
            return f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.{settings.AWS_S3_REGION_NAME}.amazonaws.com/{normalized_name}" 