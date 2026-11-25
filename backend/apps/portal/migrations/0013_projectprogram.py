from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0012_government_photos'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProjectProgram',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('kind', models.CharField(choices=[('project', 'Project'), ('program', 'Program')], default='project', max_length=10)),
                ('academic_year', models.CharField(choices=[('2025-2026', '2025-2026'), ('2026-2027', '2026-2027'), ('2027-2028', '2027-2028')], default='2026-2027', max_length=9)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('date_label', models.CharField(blank=True, help_text='Optional, e.g. "March 2026" or "Every semester"', max_length=100)),
                ('status', models.CharField(blank=True, help_text='Optional badge, e.g. "Completed", "Ongoing", "Upcoming"', max_length=50)),
                ('image', models.ImageField(blank=True, help_text='Optional image', upload_to='projects/%Y/%m/')),
                ('order', models.PositiveSmallIntegerField(default=0)),
                ('is_published', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Project / Program',
                'verbose_name_plural': 'Projects & Programs',
                'db_table': 'project_programs',
                'ordering': ['order', '-created_at'],
            },
        ),
    ]
