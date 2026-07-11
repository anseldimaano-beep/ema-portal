from django.contrib import admin
from .models import Course, CourseOffering, Enrollment, Grade, Room, RoomReservation


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'title', 'department', 'level', 'units', 'semester_offered', 'is_active']
    list_filter = ['department', 'level', 'semester_offered', 'is_active']
    search_fields = ['code', 'title', 'description']
    filter_horizontal = ['prerequisites']
    ordering = ['code']


@admin.register(CourseOffering)
class CourseOfferingAdmin(admin.ModelAdmin):
    list_display = ['course', 'section', 'instructor', 'semester', 'status']
    list_filter = ['semester', 'status', 'course__department']
    search_fields = ['course__code', 'course__title', 'instructor__first_name', 'instructor__last_name']
    ordering = ['course__code', 'section']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course_offering', 'status']
    list_filter = ['status']
    search_fields = ['student__first_name', 'student__last_name', 'course_offering__course__code']


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ['enrollment', 'status', 'entered_by', 'verified_by']
    list_filter = ['status']
    search_fields = ['enrollment__student__first_name', 'enrollment__student__last_name']
    readonly_fields = ['entered_at', 'verified_at']


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'building', 'floor', 'room_type', 'has_projector', 'has_aircon', 'is_active']
    list_filter = ['room_type', 'building', 'has_projector', 'has_aircon', 'is_active']
    search_fields = ['name', 'code', 'building']
    ordering = ['building', 'floor', 'code']


@admin.register(RoomReservation)
class RoomReservationAdmin(admin.ModelAdmin):
    list_display = ['room', 'requested_by', 'status', 'approved_by']
    list_filter = ['status']
    search_fields = ['room__name', 'room__code', 'requested_by__first_name', 'requested_by__last_name']
    readonly_fields = ['approved_at']
