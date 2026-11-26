from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0014_schoolleader'),
    ]

    operations = [
        migrations.CreateModel(
            name='Adviser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('photo', models.ImageField(blank=True, help_text='Optional photo', upload_to='government/%Y/%m/')),
                ('term', models.CharField(blank=True, help_text='e.g. 2026-2027', max_length=20)),
                ('order', models.PositiveSmallIntegerField(default=0, help_text='Lower numbers appear first')),
                ('is_active', models.BooleanField(default=True, help_text='Untick to hide from the website')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('position', models.CharField(default='Adviser', help_text='e.g. Adviser, Co-Adviser, Technical Adviser', max_length=150)),
            ],
            options={
                'verbose_name': 'Adviser',
                'verbose_name_plural': 'Advisers',
                'db_table': 'advisers',
                'ordering': ['order', 'id'],
            },
        ),
    ]
