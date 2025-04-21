from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0015_alter_doctorprofile_license_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='document',
            field=models.FileField(blank=True, null=True, upload_to='appointment_documents/'),
        ),
    ] 