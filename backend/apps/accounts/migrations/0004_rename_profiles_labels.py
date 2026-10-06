from django.db import migrations


class Migration(migrations.Migration):
    """Label-only change: renames how the profile models appear in the admin.
    No database tables or columns are touched."""

    dependencies = [
        ('accounts', '0003_emailverificationtoken'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='facultyprofile',
            options={'verbose_name': 'EEMG Officer', 'verbose_name_plural': 'EEMG Officers'},
        ),
        migrations.AlterModelOptions(
            name='studentprofile',
            options={'verbose_name': 'President', 'verbose_name_plural': 'President'},
        ),
    ]
