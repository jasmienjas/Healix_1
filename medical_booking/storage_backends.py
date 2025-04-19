from storages.backends.s3boto3 import S3Boto3Storage
from django.conf import settings

class MediaStorage(S3Boto3Storage):
    location = 'media'
    file_overwrite = False
    default_acl = 'private'

class CustomS3Boto3Storage(S3Boto3Storage):
    def url(self, name, parameters=None, expire=None):
        # Get the base URL from the parent class
        url = super().url(name, parameters, expire)
        
        # If the URL contains the problematic region format, fix it
        if 'europe (stockholm)' in url:
            # Replace the problematic region format with the correct one
            url = url.replace('europe (stockholm)', 'eu-north-1')
        
        return url 