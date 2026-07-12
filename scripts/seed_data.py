#!/usr/bin/env python
"""Seed script for demo data. Run: python scripts/seed_data.py"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ema_emits.settings')
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend'))
django.setup()

from django.contrib.auth import get_user_model
from apps.portal.models import Announcement, AcademicCalendar, FAQ, PageContent
from apps.academics.models import Course, Room
from apps.finance.models import StudentAccount, ExamPermit

User = get_user_model()

print("Creating demo users...")
users_data = [
    {'username': '2023-00001', 'email': 'student@emaemits.edu.ph', 'password': 'student123', 'role': 'student', 'first_name': 'Juan', 'last_name': 'Dela Cruz', 'year_level': 3, 'program': 'BSCS', 'section': 'A', 'enrollment_status': 'enrolled'},
    {'username': 'EMP-001', 'email': 'faculty@emaemits.edu.ph', 'password': 'faculty123', 'role': 'faculty', 'first_name': 'Maria', 'last_name': 'Santos', 'department': 'bscs', 'position': 'Professor', 'specialization': 'Software Engineering'},
    {'username': 'ADMIN-001', 'email': 'admin@emaemits.edu.ph', 'password': 'admin123', 'role': 'admin', 'first_name': 'Pedro', 'last_name': 'Reyes', 'department': 'admin', 'position': 'System Administrator'},
]

for u in users_data:
    if not User.objects.filter(username=u['username']).exists():
        User.objects.create_user(**u)
        print(f"  Created: {u['username']}")
    else:
        print(f"  Exists: {u['username']}")

print("\nCreating demo announcements...")
announcements = [
    {'title': 'Enrollment for 1st Semester 2026-2027 Now Open', 'content': 'Enrollment period starts July 15, 2026. Please prepare your requirements including Form 137, good moral certificate, and medical clearance.', 'category': 'enrollment', 'priority': 'high'},
    {'title': 'Midterm Examination Schedule Released', 'content': 'Please check the academic calendar for the complete midterm examination schedule. Examination period runs from August 10-14, 2026.', 'category': 'academic', 'priority': 'normal'},
    {'title': 'New Library Hours Starting August', 'content': 'The college library will now be open until 9:00 PM on weekdays and 5:00 PM on Saturdays to better serve student research needs.', 'category': 'general', 'priority': 'low'},
    {'title': 'BSCS Department Hackathon 2026', 'content': 'Join the annual hackathon on September 15-16. Prizes include internships and gadget packages. Register at the BSCS office.', 'category': 'event', 'priority': 'normal'},
]

author = User.objects.first()
for a in announcements:
    if not Announcement.objects.filter(title=a['title']).exists():
        Announcement.objects.create(author=author, **a)
        print(f"  Created: {a['title']}")

print("\nCreating demo courses...")
courses = [
    {'code': 'CS101', 'title': 'Introduction to Computer Science', 'description': 'Fundamentals of computing, programming concepts, and problem-solving techniques using Python.', 'units': 3, 'department': 'bscs', 'year_level': 1, 'lecture_hours': 3, 'lab_hours': 0},
    {'code': 'CS201', 'title': 'Data Structures and Algorithms', 'description': 'Advanced programming concepts, algorithm analysis, and data structure implementation.', 'units': 3, 'department': 'bscs', 'year_level': 2, 'lecture_hours': 2, 'lab_hours': 3},
    {'code': 'CS301', 'title': 'Database Management Systems', 'description': 'Relational database design, SQL, normalization, and transaction management.', 'units': 3, 'department': 'bscs', 'year_level': 3, 'lecture_hours': 2, 'lab_hours': 3},
    {'code': 'CS401', 'title': 'Software Engineering', 'description': 'Software development lifecycle, project management, and quality assurance.', 'units': 3, 'department': 'bscs', 'year_level': 4, 'lecture_hours': 3, 'lab_hours': 0},
    {'code': 'MATH101', 'title': 'College Algebra', 'description': 'Fundamental algebraic concepts, equations, and functions.', 'units': 3, 'department': 'general', 'year_level': 1, 'lecture_hours': 3, 'lab_hours': 0},
    {'code': 'ENG101', 'title': 'English Communication', 'description': 'Academic writing, public speaking, and professional communication.', 'units': 3, 'department': 'general', 'year_level': 1, 'lecture_hours': 3, 'lab_hours': 0},
]

for c in courses:
    if not Course.objects.filter(code=c['code']).exists():
        Course.objects.create(**c)
        print(f"  Created: {c['code']}")

print("\nCreating demo rooms...")
rooms = [
    {'name': 'Computer Laboratory 1', 'code': 'CL1', 'room_type': 'laboratory', 'building': 'Science Building', 'floor': '2nd', 'capacity': 40, 'has_computers': True, 'has_aircon': True, 'has_projector': True},
    {'name': 'Computer Laboratory 2', 'code': 'CL2', 'room_type': 'laboratory', 'building': 'Science Building', 'floor': '2nd', 'capacity': 40, 'has_computers': True, 'has_aircon': True, 'has_projector': True},
    {'name': 'Lecture Hall A', 'code': 'LH-A', 'room_type': 'lecture_hall', 'building': 'Main Building', 'floor': '3rd', 'capacity': 100, 'has_projector': True, 'has_aircon': True},
    {'name': 'Lecture Hall B', 'code': 'LH-B', 'room_type': 'lecture_hall', 'building': 'Main Building', 'floor': '3rd', 'capacity': 80, 'has_projector': True, 'has_aircon': True},
    {'name': 'Conference Room', 'code': 'CR-1', 'room_type': 'conference', 'building': 'Admin Building', 'floor': '1st', 'capacity': 20, 'has_projector': True, 'has_aircon': True},
]

for r in rooms:
    if not Room.objects.filter(code=r['code']).exists():
        Room.objects.create(**r)
        print(f"  Created: {r['code']}")

print("\nCreating demo FAQs...")
faqs = [
    {'question': 'How do I enroll for the semester?', 'answer': 'Enrollment is done online through the student portal. Log in, go to Enrollment, and follow the step-by-step guide. Required documents: Form 137, Good Moral Certificate, Medical Clearance, and 2x2 photos.', 'category': 'enrollment', 'order': 1},
    {'question': 'What are the tuition fees?', 'answer': 'Tuition fees vary by program. BSCS: ~25,000/semester, BSBA: ~23,000/semester, BEED: ~22,000/semester. Scholarships available for qualified students.', 'category': 'financial', 'order': 1},
    {'question': 'How do I access my grades?', 'answer': 'Log in to the Student Portal, navigate to the Grades section. Grades are posted after faculty submission and admin verification.', 'category': 'academics', 'order': 1},
    {'question': 'What are the library hours?', 'answer': 'Monday-Friday: 7:00 AM - 9:00 PM, Saturday: 8:00 AM - 5:00 PM, Sunday: Closed.', 'category': 'campus', 'order': 1},
]

for f in faqs:
    if not FAQ.objects.filter(question=f['question']).exists():
        FAQ.objects.create(**f)
        print(f"  Created: {f['question'][:40]}...")

print("\nCreating demo calendar events...")
from datetime import date
events = [
    {'title': '1st Semester Start', 'event_type': 'semester_start', 'start_date': date(2026, 8, 3), 'is_all_day': True},
    {'title': 'Enrollment Period', 'event_type': 'enrollment', 'start_date': date(2026, 7, 15), 'end_date': date(2026, 7, 31), 'is_all_day': True},
    {'title': 'Midterm Exams', 'event_type': 'examination', 'start_date': date(2026, 9, 28), 'end_date': date(2026, 10, 2), 'is_all_day': True},
    {'title': 'National Heroes Day', 'event_type': 'holiday', 'start_date': date(2026, 8, 31), 'is_all_day': True},
]

for e in events:
    if not AcademicCalendar.objects.filter(title=e['title'], start_date=e['start_date']).exists():
        AcademicCalendar.objects.create(**e)
        print(f"  Created: {e['title']}")

print("\nCreating demo student account (tuition, misc fee, exam permits)...")
student = User.objects.filter(username='2023-00001').first()
if student:
    account, created = StudentAccount.objects.get_or_create(
        student=student,
        term='1st-2026-2027',
        defaults={
            'tuition_fee': 25000, 'tuition_paid': 15000,
            'misc_fee': 5000, 'misc_paid': 5000,
            'notes': 'BSCS 3rd Year - regular load',
        }
    )
    print(f"  {'Created' if created else 'Exists'}: account for {student.username} ({account.term})")

    for exam_type, _label in ExamPermit.ExamType.choices:
        permit, p_created = ExamPermit.objects.get_or_create(account=account, exam_type=exam_type)
        if p_created:
            print(f"    Created permit: {permit.get_exam_type_display()} (auto @ {permit.required_percent}% paid)")

print("\nSeed data complete! You can now login with:")
print("  Student: student@emaemits.edu.ph / student123")
print("  Faculty: faculty@emaemits.edu.ph / faculty123")
print("  Admin: admin@emaemits.edu.ph / admin123")
