from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_remove_license_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='verification_token',
            field=models.CharField(blank=True, default=None, max_length=100, null=True),
        ),
    ] 