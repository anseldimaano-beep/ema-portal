from django.contrib import admin
from django.utils import timezone
from .models import Announcement, AcademicCalendar, FAQ, PageContent, ContactMessage, Senator, Committee
from .email_utils import send_via_resend


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
        (''Media', {
            'fields': ('featured_image', 'attachment', 'video_url'),
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


@admin.register(Senator)
class SenatorAdmin(admin.ModelAdmin):
    list_display = ['name', 'position', 'department', 'term', 'order', 'is_active']
    list_filter = ['position', 'is_active', 'term']
    search_fields = ['name', 'department']
    ordering = ['order', 'name']


@admin.register(Committee)
class CommitteeAdmin(admin.ModelAdmin):
    list_display = ['name', 'chairperson', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    filter_horizontal = ['members']
    ordering = ['order', 'name']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['name', 'email', 'subject']
    readonly_fields = ['created_at', 'responded_by', 'responded_at']
    ordering = ['-created_at']

    def save_model(self, request, obj, form, change):
        # Only fire an email the moment a response is newly written or edited.
        response_changed = 'response' in form.changed_data and obj.response.strip()

        if response_changed:
            obj.responded_by = request.user
            obj.responded_at = timezone.now()
            if obj.status == obj.Status.NEW:
                obj.status = obj.Status.RESOLVED

        super().save_model(request, obj, form, change)

        if response_changed:
            send_via_resend(
                to_email=obj.email,
                subject=f'Re: {obj.subject}',
                text_body=(
                    f'Hi {obj.name},\n\n'
                    f'{obj.response}\n\n'
                    f'---\n'
                    f'This is a reply to your message sent to EMA EMITS Model Government:\n'
                    f'"{obj.message}"'
                ),
            )
