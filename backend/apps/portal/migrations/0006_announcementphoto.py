from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0005_alter_announcement_attachment_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AnnouncementPhoto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='announcements/photos/%Y/%m/')),
                ('caption', models.CharField(blank=True, max_length=200)),
                ('order', models.PositiveSmallIntegerField(default=0, help_text='Lower numbers show first.')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('announcement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos', to='portal.announcement')),
            ],
            options={
                'verbose_name': 'Photo',
                'verbose_name_plural': 'Photos',
                'db_table': 'announcement_photos',
                'ordering': ['order', 'id'],
            },
        ),
    ]
