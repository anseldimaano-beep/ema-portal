from django.db import migrations, models


def seed_founder(apps, schema_editor):
    SchoolLeader = apps.get_model('portal', 'SchoolLeader')
    if not SchoolLeader.objects.exists():
        SchoolLeader.objects.create(position='Founder', name='Atty. Federico Semilla', order=0)


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0013_projectprogram'),
    ]

    operations = [
        migrations.CreateModel(
            name='SchoolLeader',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.CharField(help_text='e.g. "Founder", "School President"', max_length=150)),
                ('name', models.CharField(max_length=200)),
                ('photo', models.ImageField(blank=True, help_text='Optional photo', upload_to='leadership/')),
                ('order', models.PositiveSmallIntegerField(default=0, help_text='Lower numbers appear first')),
                ('is_published', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'School Leader',
                'verbose_name_plural': 'School Leadership',
                'db_table': 'school_leaders',
                'ordering': ['order', 'id'],
            },
        ),
        migrations.RunPython(seed_founder, migrations.RunPython.noop),
    ]
