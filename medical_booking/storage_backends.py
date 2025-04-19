from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings
import logging

logger = logging.getLogger('accounts')

class MediaStorage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False
    default_acl = 'private'

class CustomS3Boto3Storage(S3Boto3Storage):
    def url(self, name, parameters=None, expire=None):
        # Get the base URL from the parent class
        url = super().url(name, parameters, expire)
        logger.info(f"Original URL: {url}")
        
        # Always use eu-north-1 as the region
        if 'europe' in url or 'stockholm' in url:
            # Replace any problematic region format with the correct one
            url = url.replace('europe (stockholm)', 'eu-north-1')
            url = url.replace('europe%20(stockholm)', 'eu-north-1')
            url = url.replace('europe%20%28stockholm%29', 'eu-north-1')
            logger.info(f"Corrected URL: {url}")
        
        # Force the correct region if it's not already there
        if 's3.eu-north-1.amazonaws.com' not in url:
            bucket_name = self.bucket_name
            url = f"https://{bucket_name}.s3.eu-north-1.amazonaws.com/{name}"
            logger.info(f"Generated new URL: {url}")
        
        return url 