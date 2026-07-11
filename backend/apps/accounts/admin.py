from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudentProfile, FacultyProfile, BlacklistedToken, PasswordResetToken


class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    can_delete = False
    verbose_name_plural = 'Student Profile'


class FacultyProfileInline(admin.StackedInline):
    model = FacultyProfile
    can_delete = False
    verbose_name_plural = 'Faculty Profile'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'get_full_name', 'role', 'department', 'is_active', 'created_at']
    list_filter = ['role', 'department', 'is_active', 'year_level', 'enrollment_status']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'student_profile__student_number']
    ordering = ['-created_at']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('College Information', {
            'fields': ('role', 'department', 'phone', 'address', 'date_of_birth', 'profile_picture')
        }),
        ('Student Information', {
            'fields': ('year_level', 'program', 'section', 'enrollment_status'),
            'classes': ('collapse',)
        }),
        ('Faculty Information', {
            'fields': ('employee_id', 'position', 'specialization'),
            'classes': ('collapse',)
        }),
        ('Security', {
            'fields': ('email_verified', 'last_login_ip', 'failed_login_attempts'),
            'classes': ('collapse',)
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('College Information', {
            'fields': ('role', 'department', 'first_name', 'last_name')
        }),
    )

    inlines = [StudentProfileInline, FacultyProfileInline]

    def get_full_name(self, obj):
        return obj.get_full_name()
    get_full_name.short_description = 'Full Name'


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['student_number', 'user', 'guardian_name']
    search_fields = ['student_number', 'user__first_name', 'user__last_name']


@admin.register(FacultyProfile)
class FacultyProfileAdmin(admin.ModelAdmin):
    list_display = ['employee_number', 'user', 'highest_degree']
    search_fields = ['employee_number', 'user__first_name', 'user__last_name']


@admin.register(BlacklistedToken)
class BlacklistedTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'jti', 'blacklisted_at', 'expires_at']
    search_fields = ['jti', 'user__username']
    readonly_fields = ['blacklisted_at']


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'expires_at', 'used_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['token_hash', 'created_at']
