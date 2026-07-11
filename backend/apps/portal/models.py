"""
Portal Content Models - Phase 1 Public Information
"""
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()


class Announcement(models.Model):
    """College announcements and news."""

    class Priority(models.TextChoices):
        LOW = 'low', 'Low'
        NORMAL = 'normal', 'Normal'
        HIGH = 'high', 'High'
        URGENT = 'urgent', 'Urgent'

    class Category(models.TextChoices):
        GENERAL = 'general', 'General'
        ACADEMIC = 'academic', 'Academic'
        ADMINISTRATIVE = 'administrative', 'Administrative'
        EVENT = 'event', 'Event'
        EMERGENCY = 'emergency', 'Emergency'
        ENROLLMENT = 'enrollment', 'Enrollment'
        SCHOLARSHIP = 'scholarship', 'Scholarship'

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    content = models.TextField()
    excerpt = models.CharField(max_length=300, blank=True)
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.GENERAL)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.NORMAL)

    # Media
    featured_image = models.ImageField(upload_to='announcements/%Y/%m/', blank=True)
    attachment = models.FileField(upload_to='announcements/attachments/%Y/%m/', blank=True)

    # Publishing
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='announcements')
    is_published = models.BooleanField(default=True)
    is_pinned = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    # Engagement
    view_count = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'announcements'
        ordering = ['-is_pinned', '-published_at', '-created_at']
        verbose_name = 'Announcement'
        verbose_name_plural = 'Announcements'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.excerpt:
            self.excerpt = self.content[:200] + '...' if len(self.content) > 200 else self.content
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class AcademicCalendar(models.Model):
    """Academic calendar events and important dates."""

    class EventType(models.TextChoices):
        SEMESTER_START = 'semester_start', 'Semester Start'
        SEMESTER_END = 'semester_end', 'Semester End'
        ENROLLMENT = 'enrollment', 'Enrollment Period'
        EXAMINATION = 'examination', 'Examination'
        HOLIDAY = 'holiday', 'Holiday'
        EVENT = 'event', 'College Event'
        DEADLINE = 'deadline', 'Deadline'
        SUSPENSION = 'suspension', 'Class Suspension'
        OTHER = 'other', 'Other'

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    event_type = models.CharField(max_length=20, choices=EventType.choices, default=EventType.EVENT)

    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    location = models.CharField(max_length=200, blank=True)
    is_all_day = models.BooleanField(default=False)
    is_academic = models.BooleanField(default=True)

    # For recurring events
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(max_length=50, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'academic_calendar'
        ordering = ['start_date', 'start_time']
        verbose_name = 'Calendar Event'
        verbose_name_plural = 'Calendar Events'

    def __str__(self):
        return f"{self.title} ({self.start_date})"


class FAQ(models.Model):
    """Frequently Asked Questions."""

    class Category(models.TextChoices):
        ADMISSIONS = 'admissions', 'Admissions'
        ENROLLMENT = 'enrollment', 'Enrollment'
        ACADEMICS = 'academics', 'Academics'
        FINANCIAL = 'financial', 'Financial Aid'
        CAMPUS = 'campus', 'Campus Life'
        TECHNICAL = 'technical', 'Technical Support'
        GENERAL = 'general', 'General'

    question = models.CharField(max_length=300)
    answer = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices, default=Category.GENERAL)
    is_published = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)
    view_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'faqs'
        ordering = ['category', 'order', 'created_at']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return self.question[:60]


class PageContent(models.Model):
    """Dynamic page content for static pages (About, Contact, etc.)."""

    class Page(models.TextChoices):
        ABOUT = 'about', 'About Us'
        MISSION_VISION = 'mission_vision', 'Mission & Vision'
        CONTACT = 'contact', 'Contact Us'
        ENROLLMENT_GUIDE = 'enrollment_guide', 'Enrollment Guide'
        STUDENT_HANDBOOK = 'student_handbook', 'Student Handbook'
        PRIVACY_POLICY = 'privacy_policy', 'Privacy Policy'
        TERMS = 'terms', 'Terms of Use'

    page = models.CharField(max_length=30, choices=Page.choices, unique=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    last_updated = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'page_contents'
        verbose_name = 'Page Content'
        verbose_name_plural = 'Page Contents'

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    """Contact form submissions."""

    class Status(models.TextChoices):
        NEW = 'new', 'New'
        IN_PROGRESS = 'in_progress', 'In Progress'
        RESOLVED = 'resolved', 'Resolved'
        CLOSED = 'closed', 'Closed'

    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)

    # Admin response
    response = models.TextField(blank=True)
    responded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'contact_messages'
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'

    def __str__(self):
        return f"{self.name}: {self.subject}"
