from django.contrib import admin
from .models import Announcement, AcademicCalendar, FAQ, PageContent, ContactMessage


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'priority', 'is_pinned', 'is_published', 'published_at', 'author']
    list_filter = ['category', 'priority', 'is_published', 'is_pinned']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_at'
    ordering = ['-is_pinned', '-published_at']

    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'content', 'excerpt', 'category', 'priority')
        }),
        ('Media', {
            'fields': ('featured_image', 'attachment'),
            'classes': ('collapse',)
        }),
        ('Publishing', {
            'fields': ('author', 'is_published', 'is_pinned', 'published_at', 'expires_at')
        }),
    )


@admin.register(AcademicCalendar)
class AcademicCalendarAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'start_date', 'end_date', 'is_academic']
    list_filter = ['event_type', 'is_academic', 'is_recurring']
    search_fields = ['title', 'description']
    date_hierarchy = 'start_date'
    ordering = ['start_date']


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ['question', 'category', 'is_published', 'order', 'view_count']
    list_filter = ['category', 'is_published']
    search_fields = ['question', 'answer']
    ordering = ['category', 'order']


@admin.register(PageContent)
class PageContentAdmin(admin.ModelAdmin):
    list_display = ['page', 'title', 'last_updated', 'updated_by']
    list_filter = ['page']
    search_fields = ['title', 'content']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['name', 'email', 'subject']
    readonly_fields = ['created_at']
    ordering = ['-created_at']
