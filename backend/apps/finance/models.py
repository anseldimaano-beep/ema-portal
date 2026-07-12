"""
Finance Models - Tuition/Misc fees, balances, and exam permits.

A StudentAccount holds the fee breakdown for one student for one term.
ExamPermit rows hang off a StudentAccount, one per exam period
(prelim/midterm/prefinal/final). A permit is considered released either
because staff explicitly released it, or because the student's payments
have reached that permit's required clearance percentage.
"""
from decimal import Decimal
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class StudentAccount(models.Model):
    """Per-term fee ledger for a student (tuition + miscellaneous fees)."""

    TERM_CHOICES = [
        ('1st-2026-2027', '1st Semester 2026-2027'),
        ('2nd-2026-2027', '2nd Semester 2026-2027'),
        ('summer-2027', 'Summer 2027'),
    ]

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'role': User.Role.STUDENT},
        related_name='student_accounts',
    )
    term = models.CharField(max_length=20, choices=TERM_CHOICES)

    tuition_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    tuition_paid = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    misc_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    misc_paid = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'student_accounts'
        unique_together = ['student', 'term']
        ordering = ['-term']
        verbose_name = 'Student Account'
        verbose_name_plural = 'Student Accounts'

    def __str__(self):
        return f"{self.student.username} - {self.term}"

    @property
    def total_fee(self):
        return self.tuition_fee + self.misc_fee

    @property
    def total_paid(self):
        return self.tuition_paid + self.misc_paid

    @property
    def tuition_balance(self):
        return self.tuition_fee - self.tuition_paid

    @property
    def misc_balance(self):
        return self.misc_fee - self.misc_paid

    @property
    def total_balance(self):
        return self.total_fee - self.total_paid

    @property
    def percent_paid(self):
        if self.total_fee <= 0:
            return Decimal('100.00')
        return round((self.total_paid / self.total_fee) * 100, 2)


class ExamPermit(models.Model):
    """Exam permit for one of the four grading periods of a term."""

    class ExamType(models.TextChoices):
        PRELIM = 'prelim', 'Preliminary Exam'
        MIDTERM = 'midterm', 'Midterm Exam'
        PREFINAL = 'prefinal', 'Pre-Final Exam'
        FINAL = 'final', 'Final Exam'

    # Default % of total fees that must be paid before a permit auto-releases.
    DEFAULT_REQUIRED_PERCENT = {
        ExamType.PRELIM: Decimal('25.00'),
        ExamType.MIDTERM: Decimal('50.00'),
        ExamType.PREFINAL: Decimal('75.00'),
        ExamType.FINAL: Decimal('100.00'),
    }

    account = models.ForeignKey(StudentAccount, on_delete=models.CASCADE, related_name='exam_permits')
    exam_type = models.CharField(max_length=10, choices=ExamType.choices)

    required_percent = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
    # Manual override by registrar/cashier staff - if True, always released
    # regardless of balance; if explicitly set False, always withheld.
    manual_override = models.BooleanField(null=True, blank=True, default=None)

    remarks = models.CharField(max_length=200, blank=True)
    released_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'exam_permits'
        unique_together = ['account', 'exam_type']
        ordering = ['account', 'exam_type']
        verbose_name = 'Exam Permit'
        verbose_name_plural = 'Exam Permits'

    def __str__(self):
        return f"{self.account.student.username} - {self.get_exam_type_display()}"

    def save(self, *args, **kwargs):
        if not self.required_percent:
            self.required_percent = self.DEFAULT_REQUIRED_PERCENT.get(self.exam_type, Decimal('0.00'))
        if self.manual_override is True and self.released_at is None:
            from django.utils import timezone
            self.released_at = timezone.now()
        elif self.manual_override is not True:
            self.released_at = None
        super().save(*args, **kwargs)

    @property
    def is_released(self):
        if self.manual_override is not None:
            return self.manual_override
        return self.account.percent_paid >= self.required_percent

    @property
    def status(self):
        return 'released' if self.is_released else 'locked'
