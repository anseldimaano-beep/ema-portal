import re
from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from .models import Announcement, AcademicCalendar, FAQ, PageContent, ContactMessage, Senator, Committee
from .email_utils import send_via_resend


def _video_embed_src(url):
    """Mirrors the frontend's getVideoEmbedUrl() so the admin preview matches
    what visitors will actually see on the site."""
    if not url:
        return None

    yt_match = re.search(
        r'(?:youtu\.be/|youtube\.com/(?:watch\?v=|embed/|shorts/))([a-zA-Z0-9_-]{11})',
        url,
    )
    if yt_match:
        return f'https://www.youtube.com/embed/{yt_match.group(1)}'

    if 'facebook.com' in url or 'fb.watch' in url:
        from urllib.parse import quote
        return f'https://www.facebook.com/plugins/video.php?href={quote(url, safe="")}&show_text=0'

    return None


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'priority', 'is_pinned', 'is_published', 'published_at', 'author']
    list_filter = ['category', 'priority', 'is_published', 'is_pinned']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'published_at'
    ordering = ['-is_pinned', '-published_at']
    readonly_fields = ['video_preview']

    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'content', 'excerpt', 'category', 'priority')
        }),
        ('Media', {
            'fields': ('featured_image', 'attachment', 'video_url', 'video_preview'),
            'classes': ('collapse',)
        }),
        ('Publishing', {
            'fields': ('author', 'is_published', 'is_pinned', 'published_at', 'expires_at')
        }),
    )

    def video_preview(self, obj):
        if not obj.video_url:
            return 'Enter a video URL above, then save to preview the embed here.'

        embed_src = _video_embed_src(obj.video_url)
        if not embed_src:
            return format_html(
                '<span style="color:#b91c1c;">Unrecognized link — must be a YouTube or Facebook video URL.</span>'
            )

        return format_html(
            '<div style="max-width:400px;">'
            '<iframe src="{}" width="400" height="220" frameborder="0" '
            'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" '
            'allowfullscreen></iframe>'
            '<p style="margin-top:6px;font-size:12px;color:#555;">'
            'If this shows "Unavailable" (common for Facebook Reels blocked by rights checks), '
            'clear Video URL and rely on Featured image instead, or use a regular Facebook video post link.'
            '</p>'
            '<p style="margin-top:2px;"><a href="{}" target="_blank" rel="noopener noreferrer">Open original link &#8599;</a></p>'
            '</div>',
            embed_src, obj.video_url,
        )
    video_preview.short_description = 'Video preview'


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
