from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0012_split_appointment_datetime'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
    ] 