"""
Custom User Model with Role-Based Access Control
Supports: Student, Faculty, Staff, Admin roles
"""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Extended user model with college-specific roles and fields."""

    class Role(models.TextChoices):
        STUDENT = 'student', _('Student')
        FACULTY = 'faculty', _('Teacher')
        ORGANIZATION = 'organization', _('Organization (EEMG)')
        STAFF = 'staff', _('Staff')
        ADMIN = 'admin', _('Administrator')
        ALUMNI = 'alumni', _('Alumni')
        GUEST = 'guest', _('Guest')

    class Position(models.TextChoices):
        """Position/title within a role. Only certain leadership positions
        held by a Teacher or Organization member unlock Admin access."""
        REGULAR = 'regular', _('Regular')
        DEPARTMENT_HEAD = 'department_head', _('Department Head')
        PRINCIPAL = 'principal', _('Principal')
        PRESIDENT = 'president', _('President (EEMG)')

    # Positions that automatically elevate a Teacher/Organization registrant
    # to Admin. Registration can never set role=Admin directly; it can only
    # be reached by selecting one of these positions under Teacher or
    # Organization classification.
    ADMIN_ELIGIBLE_POSITIONS = {
        Position.DEPARTMENT_HEAD,
        Position.PRINCIPAL,
        Position.PRESIDENT,
    }
    # Roles that are allowed to carry an admin-eligible position.
    ADMIN_ELIGIBLE_ROLES = {Role.FACULTY, Role.ORGANIZATION}

    class Department(models.TextChoices):
        BSCS = 'bscs', _('BSCS - Computer Science')
        BSBA = 'bsba', _('BSBA - Business Administration')
        BEED = 'beed', _('BEED - Education')
        BSHM = 'bshm', _('BSHM - Hospitality Management')
        HBMC = 'hbmc', _('HBMC - Multimedia Communications')
        GENERAL = 'general', _('General Education')
        ADMIN = 'admin', _('Administration')

    # Override username with student ID / employee ID
    username = models.CharField(
        max_length=20, 
        unique=True,
        help_text='Student ID or Employee ID'
    )
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(
        max_length=20, 
        choices=Role.choices, 
        default=Role.GUEST
    )
    department = models.CharField(
        max_length=20,
        choices=Department.choices,
        default=Department.GENERAL
    )
    leadership_position = models.CharField(
        max_length=20,
        choices=Position.choices,
        default=Position.REGULAR,
        help_text='Leadership title for Teacher/Organization accounts. '
                   'Department Head, Principal, or President auto-grants Admin.'
    )

    # Profile fields
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    middle_name = models.CharField(max_length=50, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to='profiles/%Y/%m/', 
        blank=True,
        default='profiles/default.png'
    )

    # Academic fields (for students)
    year_level = models.PositiveSmallIntegerField(
        choices=[(1, '1st Year'), (2, '2nd Year'), (3, '3rd Year'), (4, '4th Year')],
        null=True, 
        blank=True
    )
    program = models.CharField(max_length=100, blank=True)
    section = models.CharField(max_length=20, blank=True)
    enrollment_status = models.CharField(
        max_length=20,
        choices=[
            ('enrolled', 'Enrolled'),
            ('pending', 'Pending'),
            ('suspended', 'Suspended'),
            ('graduated', 'Graduated'),
            ('dropped', 'Dropped'),
        ],
        default='pending'
    )

    # Faculty fields
    employee_id = models.CharField(max_length=20, blank=True)
    position = models.CharField(max_length=100, blank=True)
    specialization = models.CharField(max_length=200, blank=True)

    # Security fields
    email_verified = models.BooleanField(default=False)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    failed_login_attempts = models.PositiveSmallIntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Use email as the primary identifier
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    objects = UserManager()

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.username} - {self.get_full_name()}"

    def get_full_name(self):
        if self.middle_name:
            return f"{self.first_name} {self.middle_name[0]}. {self.last_name}"
        return f"{self.first_name} {self.last_name}"

    def get_initials(self):
        return f"{self.first_name[0]}{self.last_name[0]}".upper()

    @property
    def is_student(self):
        return self.role == self.Role.STUDENT

    @property
    def is_faculty(self):
        return self.role == self.Role.FACULTY

    @property
    def is_admin_staff(self):
        return self.role in [self.Role.ADMIN, self.Role.STAFF]

    @property
    def is_organization(self):
        return self.role == self.Role.ORGANIZATION


class StudentProfile(models.Model):
    """Extended profile for students with academic details."""
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='student_profile'
    )
    student_number = models.CharField(max_length=20, unique=True)
    guardian_name = models.CharField(max_length=100, blank=True)
    guardian_phone = models.CharField(max_length=20, blank=True)
    guardian_email = models.EmailField(blank=True)
    emergency_contact = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=20, blank=True)
    blood_type = models.CharField(max_length=5, blank=True)
    allergies = models.TextField(blank=True)
    previous_school = models.CharField(max_length=200, blank=True)
    scholarship_type = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = 'student_profiles'

    def __str__(self):
        return f"Profile: {self.user.get_full_name()}"


class FacultyProfile(models.Model):
    """Extended profile for faculty members."""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='faculty_profile'
    )
    employee_number = models.CharField(max_length=20, unique=True)
    highest_degree = models.CharField(max_length=100, blank=True)
    university_graduated = models.CharField(max_length=200, blank=True)
    years_of_experience = models.PositiveSmallIntegerField(default=0)
    research_interests = models.TextField(blank=True)
    publications = models.TextField(blank=True)
    office_hours = models.CharField(max_length=200, blank=True)
    office_location = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = 'faculty_profiles'

    def __str__(self):
        return f"Faculty: {self.user.get_full_name()}"


class BlacklistedToken(models.Model):
    """
    Revoked JWTs (used on logout, password change, etc.).
    JWTs are stateless by design, so this table is the one piece of state
    needed to make a token unusable before its natural expiry.
    """
    jti = models.CharField(max_length=64, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blacklisted_tokens')
    blacklisted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(help_text='Mirrors the token exp claim, so old rows can be pruned safely.')

    class Meta:
        db_table = 'blacklisted_tokens'

    def __str__(self):
        return f"Blacklisted token for {self.user.username} (jti={self.jti})"


class PasswordResetToken(models.Model):
    """
    One-time password reset tokens.
    Only a salted hash of the token is stored, mirroring how passwords are
    stored, so a database read alone can't be used to reset an account.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token_hash = models.CharField(max_length=128, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'password_reset_tokens'

    def __str__(self):
        return f"Password reset token for {self.user.username}"

    @property
    def is_valid(self):
        from django.utils import timezone
        return self.used_at is None and self.expires_at > timezone.now()


class EmailVerificationToken(models.Model):
    """
    One-time email verification tokens, issued at registration.
    Only a salted hash of the token is stored, mirroring PasswordResetToken,
    so a database read alone can't be used to verify an account.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='email_verification_tokens')
    token_hash = models.CharField(max_length=128, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'email_verification_tokens'

    def __str__(self):
        return f"Email verification token for {self.user.username}"

    @property
    def is_valid(self):
        from django.utils import timezone
        return self.used_at is None and self.expires_at > timezone.now()
