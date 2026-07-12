from django.contrib import admin
from .models import StudentAccount, ExamPermit


class ExamPermitInline(admin.TabularInline):
    model = ExamPermit
    extra = 0
    readonly_fields = ['is_released', 'status', 'released_at']
    fields = ['exam_type', 'required_percent', 'manual_override', 'remarks', 'is_released', 'status', 'released_at']


@admin.register(StudentAccount)
class StudentAccountAdmin(admin.ModelAdmin):
    list_display = ['student', 'term', 'tuition_fee', 'tuition_paid', 'misc_fee', 'misc_paid', 'total_balance', 'percent_paid']
    list_filter = ['term']
    search_fields = ['student__first_name', 'student__last_name', 'student__username']
    inlines = [ExamPermitInline]

    def total_balance(self, obj):
        return obj.total_balance

    def percent_paid(self, obj):
        return f"{obj.percent_paid}%"


@admin.register(ExamPermit)
class ExamPermitAdmin(admin.ModelAdmin):
    list_display = ['account', 'exam_type', 'required_percent', 'manual_override', 'status']
    list_filter = ['exam_type', 'manual_override']
    search_fields = ['account__student__first_name', 'account__student__last_name']
