"""
Academic Models - Courses, Grades, Faculty Directory, Room Reservations
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model

User = get_user_model()


class Course(models.Model):
    """Academic courses offered by the college."""

    class Level(models.TextChoices):
        FOUNDATION = 'foundation', 'Foundation'
        MAJOR = 'major', 'Major'
        ELECTIVE = 'elective', 'Elective'
        GENERAL = 'general', 'General Education'

    class Semester(models.TextChoices):
        FIRST = '1st', 'First Semester'
        SECOND = '2nd', 'Second Semester'
        SUMMER = 'summer', 'Summer'
        ALL = 'all', 'All Semesters'

    code = models.CharField(max_length=20, unique=True, help_text='e.g., CS101, MATH201')
    title = models.CharField(max_length=200)
    description = models.TextField()
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.GENERAL)

    units = models.PositiveSmallIntegerField(default=3, validators=[MinValueValidator(1), MaxValueValidator(12)])
    lecture_hours = models.PositiveSmallIntegerField(default=3)
    lab_hours = models.PositiveSmallIntegerField(default=0)

    department = models.CharField(max_length=20, choices=User.Department.choices, default=User.Department.GENERAL)
    semester_offered = models.CharField(max_length=10, choices=Semester.choices, default=Semester.ALL)
    year_level = models.PositiveSmallIntegerField(
        choices=[(1, '1st Year'), (2, '2nd Year'), (3, '3rd Year'), (4, '4th Year')],
        null=True, blank=True
    )

    prerequisites = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='prerequisite_for')

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'
        ordering = ['code']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

    def __str__(self):
        return f"{self.code} - {self.title}"


class CourseOffering(models.Model):
    """Specific course offering for a semester."""

    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        CLOSED = 'closed', 'Closed'
        CANCELLED = 'cancelled', 'Cancelled'
        WAITLIST = 'waitlist', 'Waitlist'

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='offerings')
    semester = models.CharField(max_length=20, choices=[
        ('1st-2026-2027', '1st Semester 2026-2027'),
        ('2nd-2026-2027', '2nd Semester 2026-2027'),
        ('summer-2027', 'Summer 2027'),
    ])
    section = models.CharField(max_length=10, help_text='e.g., A, B, C')

    instructor = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        limit_choices_to={'role': User.Role.FACULTY},
        related_name='teaching_courses'
    )

    schedule = models.CharField(max_length=100, help_text='e.g., MWF 9:00-10:30')
    room = models.CharField(max_length=50, blank=True)
    capacity = models.PositiveSmallIntegerField(default=40)
    enrolled_count = models.PositiveSmallIntegerField(default=0)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'course_offerings'
        ordering = ['course__code', 'section']
        verbose_name = 'Course Offering'
        verbose_name_plural = 'Course Offerings'
        unique_together = ['course', 'semester', 'section']

    def __str__(self):
        return f"{self.course.code} - {self.section} ({self.semester})"

    @property
    def available_slots(self):
        return self.capacity - self.enrolled_count


class Enrollment(models.Model):
    """Student enrollment in a course offering."""

    class Status(models.TextChoices):
        ENROLLED = 'enrolled', 'Enrolled'
        DROPPED = 'dropped', 'Dropped'
        WITHDRAWN = 'withdrawn', 'Withdrawn'
        COMPLETED = 'completed', 'Completed'

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': User.Role.STUDENT},
        related_name='enrollments'
    )
    course_offering = models.ForeignKey(CourseOffering, on_delete=models.CASCADE, related_name='enrolled_students')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ENROLLED)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    dropped_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'enrollments'
        unique_together = ['student', 'course_offering']
        verbose_name = 'Enrollment'
        verbose_name_plural = 'Enrollments'

    def __str__(self):
        return f"{self.student.username} in {self.course_offering}"


class Grade(models.Model):
    """Student grades for enrolled courses."""

    class GradeStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        SUBMITTED = 'submitted', 'Submitted'
        VERIFIED = 'verified', 'Verified'
        FINALIZED = 'finalized', 'Finalized'

    enrollment = models.OneToOneField(
        Enrollment,
        on_delete=models.CASCADE,
        related_name='grade'
    )

    # Component grades (0-100)
    prelim_grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    midterm_grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    prefinal_grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    final_grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Computed final grade
    computed_grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Grade equivalent (1.0, 1.25, 1.5, etc.)
    grade_equivalent = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    status = models.CharField(max_length=20, choices=GradeStatus.choices, default=GradeStatus.PENDING)

    # Remarks
    remarks = models.TextField(blank=True)
    is_incomplete = models.BooleanField(default=False)
    is_dropped = models.BooleanField(default=False)

    # Audit trail
    entered_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='grades_entered'
    )
    entered_at = models.DateTimeField(null=True, blank=True)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='grades_verified'
    )
    verified_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'grades'
        verbose_name = 'Grade'
        verbose_name_plural = 'Grades'

    def __str__(self):
        return f"Grade: {self.enrollment.student.username} - {self.enrollment.course_offering.course.code}"

    def compute_final_grade(self):
        """Compute final grade from components."""
        if all([self.prelim_grade, self.midterm_grade, self.prefinal_grade, self.final_grade]):
            # Standard computation: 20% prelim + 20% midterm + 30% prefinal + 30% final
            computed = (
                float(self.prelim_grade) * 0.20 +
                float(self.midterm_grade) * 0.20 +
                float(self.prefinal_grade) * 0.30 +
                float(self.final_grade) * 0.30
            )
            self.computed_grade = round(computed, 2)
            self.grade_equivalent = self._get_grade_equivalent(self.computed_grade)
            return self.computed_grade
        return None

    def _get_grade_equivalent(self, grade):
        """Convert percentage to grade equivalent."""
        if grade >= 97.5: return 1.00
        elif grade >= 94.5: return 1.25
        elif grade >= 91.5: return 1.50
        elif grade >= 88.5: return 1.75
        elif grade >= 85.5: return 2.00
        elif grade >= 82.5: return 2.25
        elif grade >= 79.5: return 2.50
        elif grade >= 76.5: return 2.75
        elif grade >= 74.5: return 3.00
        elif grade >= 71.5: return 3.25
        elif grade >= 68.5: return 3.50
        elif grade >= 65.5: return 3.75
        elif grade >= 60.0: return 4.00
        else: return 5.00


class Room(models.Model):
    """Classroom and facility rooms."""

    class RoomType(models.TextChoices):
        CLASSROOM = 'classroom', 'Classroom'
        LABORATORY = 'laboratory', 'Laboratory'
        LECTURE_HALL = 'lecture_hall', 'Lecture Hall'
        CONFERENCE = 'conference', 'Conference Room'
        AUDITORIUM = 'auditorium', 'Auditorium'
        LIBRARY = 'library', 'Library Room'
        OTHER = 'other', 'Other'

    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    room_type = models.CharField(max_length=20, choices=RoomType.choices, default=RoomType.CLASSROOM)
    building = models.CharField(max_length=100)
    floor = models.CharField(max_length=20)
    capacity = models.PositiveSmallIntegerField(default=30)

    # Features
    has_projector = models.BooleanField(default=False)
    has_computers = models.BooleanField(default=False)
    has_aircon = models.BooleanField(default=False)
    has_whiteboard = models.BooleanField(default=True)

    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'rooms'
        ordering = ['building', 'floor', 'code']
        verbose_name = 'Room'
        verbose_name_plural = 'Rooms'

    def __str__(self):
        return f"{self.code} - {self.name}"


class RoomReservation(models.Model):
    """Room reservation system for faculty and staff."""

    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'
        CANCELLED = 'cancelled', 'Cancelled'
        COMPLETED = 'completed', 'Completed'

    class Purpose(models.TextChoices):
        CLASS = 'class', 'Class Session'
        MEETING = 'meeting', 'Meeting'
        EVENT = 'event', 'Event'
        EXAM = 'exam', 'Examination'
        SEMINAR = 'seminar', 'Seminar/Workshop'
        PRACTICE = 'practice', 'Practice/Rehearsal'
        OTHER = 'other', 'Other'

    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='reservations')
    requested_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role__in': [User.Role.FACULTY, User.Role.STAFF, User.Role.ADMIN]},
        related_name='room_reservations'
    )

    purpose = models.CharField(max_length=20, choices=Purpose.choices)
    purpose_description = models.TextField(blank=True)

    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    expected_attendees = models.PositiveSmallIntegerField(default=10)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    # Approval workflow
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_reservations'
    )
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'room_reservations'
        ordering = ['-date', '-start_time']
        verbose_name = 'Room Reservation'
        verbose_name_plural = 'Room Reservations'

    def __str__(self):
        return f"{self.room.code} - {self.date} ({self.start_time}-{self.end_time})"
