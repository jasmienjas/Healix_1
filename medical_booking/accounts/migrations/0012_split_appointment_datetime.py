from django.db import migrations, models
from django.utils import timezone

def split_datetime(apps, schema_editor):
    Appointment = apps.get_model('accounts', 'Appointment')
    for appointment in Appointment.objects.all():
        if hasattr(appointment, 'appointment_datetime'):
            appointment.appointment_date = appointment.appointment_datetime.date()
            appointment.start_time = appointment.appointment_datetime.time()
            # Set end_time to 1 hour after start_time
            appointment.end_time = (appointment.appointment_datetime + timezone.timedelta(hours=1)).time()
            appointment.save()

def combine_datetime(apps, schema_editor):
    Appointment = apps.get_model('accounts', 'Appointment')
    for appointment in Appointment.objects.all():
        if hasattr(appointment, 'appointment_date') and hasattr(appointment, 'start_time'):
            appointment.appointment_datetime = timezone.datetime.combine(
                appointment.appointment_date,
                appointment.start_time
            )
            appointment.save()

class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0011_doctorprofile_appointment_cost_doctorprofile_bio_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='appointment_date',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='start_time',
            field=models.TimeField(null=True),
        ),
        migrations.AddField(
            model_name='appointment',
            name='end_time',
            field=models.TimeField(null=True),
        ),
        migrations.RunPython(split_datetime, combine_datetime),
        migrations.AlterField(
            model_name='appointment',
            name='appointment_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='start_time',
            field=models.TimeField(),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='end_time',
            field=models.TimeField(),
        ),
        migrations.RemoveField(
            model_name='appointment',
            name='appointment_datetime',
        ),
    ] 