from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0006_announcementphoto'),
    ]

    operations = [
        migrations.AlterField(
            model_name='announcement',
            name='category',
            field=models.CharField(
                choices=[
                    ('general', 'General'),
                    ('academic', 'Academic'),
                    ('administrative', 'Administrative'),
                    ('event', 'Event'),
                    ('emergency', 'Emergency'),
                    ('enrollment', 'Enrollment'),
                    ('scholarship', 'Scholarship'),
                    ('upcoming', 'Upcoming'),
                ],
                default='general',
                max_length=20,
            ),
        ),
    ]
