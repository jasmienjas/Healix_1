from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_add_notes_to_appointment'),
    ]

    operations = [
        migrations.AlterField(
            model_name='doctorprofile',
            name='license_number',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.RemoveField(
            model_name='doctorprofile',
            name='license_number',
        ),
    ] 