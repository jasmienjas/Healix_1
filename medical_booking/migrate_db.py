import os
import django
from django.core.management import call_command
from django.conf import settings

def migrate_data():
    try:
        # Temporarily store the DATABASE_URL
        postgres_url = os.environ.get('DATABASE_URL')
        
        # Unset DATABASE_URL to use SQLite
        if 'DATABASE_URL' in os.environ:
            del os.environ['DATABASE_URL']
        
        # Set up Django with SQLite
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'medical_booking.settings')
        django.setup()
        
        # Create JSON dump from SQLite
        print("Creating JSON dump from SQLite...")
        call_command('dumpdata', '--exclude', 'auth.permission', '--exclude', 'contenttypes', '--indent', 2, output='db_dump.json')
        
        # Restore DATABASE_URL for PostgreSQL
        os.environ['DATABASE_URL'] = postgres_url
        
        # Reload Django settings to use PostgreSQL
        django.setup()
        
        # Apply migrations to PostgreSQL
        print("Applying migrations to PostgreSQL...")
        call_command('migrate')
        
        # Load data into PostgreSQL
        print("Loading data into PostgreSQL...")
        call_command('loaddata', 'db_dump.json')
        
        print("Migration completed successfully!")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    migrate_data()
