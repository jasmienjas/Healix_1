from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_remove_license_number'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'accounts_customuser'
                    AND column_name = 'verification_token'
                ) THEN
                    ALTER TABLE accounts_customuser ADD COLUMN verification_token VARCHAR(100) NULL;
                END IF;
            END $$;
            """,
            reverse_sql="""
            ALTER TABLE accounts_customuser DROP COLUMN IF EXISTS verification_token;
            """
        ),
    ] 