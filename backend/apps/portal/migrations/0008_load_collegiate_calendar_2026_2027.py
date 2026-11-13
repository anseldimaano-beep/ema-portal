"""Load the A.Y. 2026-2027 Collegiate Calendar (Bi-Semester) into the
academic calendar. Idempotent: events are matched on (title, start_date)."""
import datetime

from django.db import migrations

D = datetime.date

# (title, event_type, start_date, end_date or None, description)
EVENTS = [
    # June 2026
    ('Opening of Classes (1st Semester)', 'semester_start', D(2026, 6, 15), None, ''),
    ('Last Day of Enrollment', 'enrollment', D(2026, 6, 30), None, ''),
    ('Election of EEMG Officers', 'event', D(2026, 6, 30), None, ''),
    # July 2026
    ('Submission of Test Paper for Prelim Exam', 'deadline', D(2026, 7, 13), None, ''),
    ('Preliminary Exam', 'examination', D(2026, 7, 16), D(2026, 7, 17), ''),
    ('Acquaintance Party', 'event', D(2026, 7, 25), None, ''),
    # August 2026
    ('Buwan ng Wika Celebration', 'event', D(2026, 8, 14), None, ''),
    ('Submission of Test Paper for Midterm Exam', 'deadline', D(2026, 8, 17), D(2026, 8, 18), ''),
    ('Midterm Exam', 'examination', D(2026, 8, 19), None, ''),
    ('National Heroes Day', 'holiday', D(2026, 8, 31), None, ''),
    # September 2026
    ('Submission of Test Paper for Pre-Final Exam', 'deadline', D(2026, 9, 11), None, ''),
    ('Intramurals', 'event', D(2026, 9, 15), None, ''),
    ('Pre-Final Exam', 'examination', D(2026, 9, 17), D(2026, 9, 18), ''),
    # October 2026
    ("Observance of World Teachers' Day Celebration", 'event', D(2026, 10, 5), None, ''),
    ('Submission of Test Paper for Final Exam', 'deadline', D(2026, 10, 12), None, ''),
    ('Final Exam', 'examination', D(2026, 10, 15), D(2026, 10, 16), ''),
    ('Academic Break', 'other', D(2026, 10, 19), D(2026, 10, 30), ''),
    ('Enrollment Period for 2nd Semester', 'enrollment', D(2026, 10, 19), D(2026, 10, 30), ''),
    # November 2026
    ('Opening of Classes (2nd Semester)', 'semester_start', D(2026, 11, 2), None, ''),
    ('Submission of Test Paper for Preliminary Exam', 'deadline', D(2026, 11, 25), None, ''),
    ('Preliminary Exam', 'examination', D(2026, 11, 27), None, ''),
    ('Preliminary Exam', 'examination', D(2026, 11, 30), None, ''),
    # December 2026
    ('Christmas Break', 'holiday', D(2026, 12, 18), None, ''),
    # January 2027
    ('Resumption of Classes', 'event', D(2027, 1, 4), None, ''),
    ('Submission of Test Paper for Midterm Exam', 'deadline', D(2027, 1, 11), None, ''),
    ('Midterm Exam', 'examination', D(2027, 1, 14), D(2027, 1, 15), ''),
    # February 2027
    ('Foundation Celebration', 'event', D(2027, 2, 1), D(2027, 2, 5), ''),
    ('Submission of Test Paper for Pre-Final Exam', 'deadline', D(2027, 2, 15), None, ''),
    ('Pre-Final Exam', 'examination', D(2027, 2, 18), D(2027, 2, 19), ''),
    # March 2027
    ('Submission of Test Paper for Final Exam', 'deadline', D(2027, 3, 15), None, ''),
    ('Final Exam', 'examination', D(2027, 3, 18), D(2027, 3, 19), ''),
    ('Submission of Grades', 'deadline', D(2027, 3, 22), None, ''),
    ('Deliberation (Graduating Class)', 'event', D(2027, 3, 24), None, ''),
    ('Dedication Night', 'event', D(2027, 3, 29), None, ''),
    ('Graduation Day (Tentative)', 'event', D(2027, 3, 31), None, ''),
]


def load_events(apps, schema_editor):
    AcademicCalendar = apps.get_model('portal', 'AcademicCalendar')
    for title, event_type, start, end, description in EVENTS:
        AcademicCalendar.objects.get_or_create(
            title=title,
            start_date=start,
            defaults={
                'event_type': event_type,
                'end_date': end,
                'description': description,
                'is_all_day': True,
                'is_academic': True,
            },
        )


def unload_events(apps, schema_editor):
    AcademicCalendar = apps.get_model('portal', 'AcademicCalendar')
    for title, _type, start, _end, _desc in EVENTS:
        AcademicCalendar.objects.filter(title=title, start_date=start).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('portal', '0007_alter_announcement_category'),
    ]

    operations = [
        migrations.RunPython(load_events, unload_events),
    ]
