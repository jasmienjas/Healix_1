from django.core.management.base import BaseCommand
from accounts.models import CustomUser

class Command(BaseCommand):
    help = 'Delete a user by email address'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email address of the user to delete')

    def handle(self, *args, **options):
        email = options['email']
        try:
            user = CustomUser.objects.get(email=email)
            user.delete()
            self.stdout.write(self.style.SUCCESS(f'Successfully deleted user with email: {email}'))
        except CustomUser.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User with email {email} does not exist')) 