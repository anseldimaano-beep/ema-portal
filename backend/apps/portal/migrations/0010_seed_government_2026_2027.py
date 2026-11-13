"""Load the A.Y. 2026-2027 government roster so it can be edited from the
Django admin. Idempotent: existing records with the same names are left alone,
and the reverse step deletes nothing."""
from django.db import migrations

TERM = '2026-2027'

EXECUTIVE = [
    ('President', 'Glendel I. Manipol'),
    ('Vice President', 'Vincent De Mesa'),
]

SENATORS = [
    'Manalo, Zandro', 'Bayhon, Jamailah', 'Villa, Kate Angela', 'Sales, Regielyn',
    'Rafol, John Philip', 'Recaro, Benedict', 'Francisco, Joshua', 'Matining, Bryan',
    'Tan, Princess', 'Cabatian, Milky', 'Marayan, Nathan Rein', 'Verdadero, Angela',
]

REPRESENTATIVES = [
    ('CBM Representatives', ['Avelino, Kane Lee', 'Malubag, Jennelyn']),
    ('CCS Representatives', ['Sadicon, Marishel Ayesha', 'Sotto, Kristine Joy']),
    ('CTE Representatives (Secondary)', ['Oliver, Rencel Jake', 'Paner, Benedict', 'Regalario, Shaira']),
    ('CTE Representatives (Elementary)', ['Florencondia, Marian', 'Sabalvaro, Angelica']),
    ('CHM Representatives', ['Mercado, Charisse', 'Reyes, Mary Jane']),
]

# (committee, chairperson, members)
COMMITTEES = [
    ('Finance', 'Manalo, Zandro',
     ['Manalo, Zandro', 'Brucal, Jana Mae', 'Malubag, Jennelyn', 'Abel, Nicole']),
    ('Security & Safety', 'Matining, Bryan',
     ['Matining, Bryan', 'Matining, Aeron', 'Mercado, Charisse', 'Manalon, Jericho', 'Oliver, Rencel Jake']),
    ('Waste & Classroom Management', 'Recaro, Benedict',
     ['Recaro, Benedict', 'Avelino, Kane Lee', 'Verdadero, Angela', 'Sabalvaro, Angelica']),
    ('Media', 'Bayhon, Jamailah',
     ['Bayhon, Jamailah', 'Dimaapi, Ansel John', 'Cabatian, Milky', 'Sadicon, Marishel Ayesha', 'Reyes, Mary Jane']),
    ('Rules & Regulations and By-Laws', 'Sales, Regielyn',
     ['Sales, Regielyn', 'Regalario, Shaira', 'Paner, Benedict', 'Villa, Kate Angela']),
    ('Events', 'Rafol, John Philip',
     ['Rafol, John Philip', 'Francisco, Joshua', 'Marayan, Nathan Rein', 'Tan, Princess',
      'Harper, Jaz Xavier', 'Sotto, Kristine Joy', 'Florencondia, Marian']),
]


def seed(apps, schema_editor):
    Executive = apps.get_model('portal', 'ExecutiveOfficer')
    Senator = apps.get_model('portal', 'Senator')
    Representative = apps.get_model('portal', 'Representative')
    Committee = apps.get_model('portal', 'Committee')
    CommitteeMember = apps.get_model('portal', 'CommitteeMember')

    for i, (position, name) in enumerate(EXECUTIVE, start=1):
        Executive.objects.get_or_create(
            name=name, position=position, defaults={'term': TERM, 'order': i})

    for i, name in enumerate(SENATORS, start=1):
        Senator.objects.get_or_create(
            name=name, defaults={'position': 'senator', 'term': TERM, 'order': i})

    n = 0
    for group, members in REPRESENTATIVES:
        for name in members:
            n += 1
            Representative.objects.get_or_create(
                name=name, group=group, defaults={'term': TERM, 'order': n})

    for i, (cname, chair, members) in enumerate(COMMITTEES, start=1):
        committee, _ = Committee.objects.get_or_create(name=cname, defaults={'order': i})
        if CommitteeMember.objects.filter(committee=committee).exists():
            continue
        for j, name in enumerate(members, start=1):
            CommitteeMember.objects.create(
                committee=committee, name=name, is_chairperson=(name == chair), order=j)


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0009_government_officials'),
    ]

    operations = [
        migrations.RunPython(seed, migrations.RunPython.noop),
    ]
