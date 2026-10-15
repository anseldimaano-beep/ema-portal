from django.contrib import admin
from django.utils import timezone

from .models import (
    Announcement, AnnouncementPhoto, AcademicCalendar, FAQ,
    PageContent, ContactMessage, Senator, Committee,
)


class AnnouncementPhotoInline(admin.TabularInline):
    model = AnnouncementPhoto
    extra = 3
    fields = ['image', 'caption', 'order']


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    """News, events, projects and programs posts (shown on the Announcements page)."""
    list_display = ['title', 'category', 'priority', 'is_published', 'is_pinned', 'published_at']
    list_filter = ['category', 'priority', 'is_published', 'is_pinned']
    search_fields = ['title', 'content']
    date_hierarchy = 'published_at'
    inlines = [AnnouncementPhotoInline]
    fieldsets = [
        (None, {'fields': ['title', 'category', 'priority', 'content', 'excerpt']}),
        ('Media', {'fields': ['featured_image', 'attachment', 'video_url', 'video_file']}),
        ('Publishing', {'fields': ['is_published', 'is_pinned', 'published_at', 'expires_at']}),
    ]

    def save_model(self, request, obj, form, change):
        if not obj.author_id:
            obj.author = request.user
        if obj.is_published and not obj.published_at:
            obj.published_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(AcademicCalendar)
class AcademicCalendarAdmin(admin.ModelAdmin):
    """Events shown on the Calendar page."""
    list_display = ['title', 'event_type', 'start_date', 'end_date', 'location']
    list_filter = ['event_type', 'is_academic']
    search_fields = ['title', 'description', 'location']
    date_hierarchy = 'start_date'


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'order', 'is_published']
    list_filter = ['category', 'is_published']
    search_fields = ['question', 'answer']
    list_editable = ['order', 'is_published']


@admin.register(PageContent)
class PageContentAdmin(admin.ModelAdmin):
    list_display = ['page', 'title', 'last_updated']

    def save_model(self, request, obj, form, change):
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Senator)
class SenatorAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'department', 'term', 'order', 'is_active']
    list_filter = ['position', 'term', 'is_active']
    search_fields = ['name', 'department']
    list_editable = ['order', 'is_active']


@admin.register(Committee)
class CommitteeAdmin(admin.ModelAdmin):
    list_display = ['name', 'chairperson', 'order', 'is_active']
    list_filter = ['is_active']
    filter_horizontal = ['members']
    list_editable = ['order', 'is_active']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['subject', 'name', 'email', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']
