from django import forms
from django.contrib import admin
from django.utils import timezone

from .models import (
    Announcement, AnnouncementPhoto, AcademicCalendar, FAQ,
    PageContent, ContactMessage, Senator, Committee,
)


class MultipleFileInput(forms.ClearableFileInput):
    allow_multiple_selected = True


class MultipleFileField(forms.FileField):
    """A file field that accepts several files selected at once."""

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('widget', MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        single_clean = super().clean
        if isinstance(data, (list, tuple)):
            return [single_clean(d, initial) for d in data if d]
        return [single_clean(data, initial)] if data else []


class AnnouncementAdminForm(forms.ModelForm):
    extra_photos = MultipleFileField(
        required=False,
        label='Bulk upload photos',
        help_text='Select as many images as you like at once (Ctrl+A in the file picker selects all). '
                  'They are added to the gallery in the order of their file names.',
    )

    class Meta:
        model = Announcement
        fields = '__all__'


class AnnouncementPhotoInline(admin.TabularInline):
    model = AnnouncementPhoto
    extra = 0
    fields = ['image', 'caption', 'order']


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    """News, events, projects and programs posts (shown on the Announcements page)."""
    list_display = ['title', 'category', 'priority', 'is_published', 'is_pinned', 'published_at']
    list_filter = ['category', 'priority', 'is_published', 'is_pinned']
    search_fields = ['title', 'content']
    date_hierarchy = 'published_at'
    form = AnnouncementAdminForm
    inlines = [AnnouncementPhotoInline]
    fieldsets = [
        (None, {'fields': ['title', 'category', 'priority', 'content', 'excerpt']}),
        ('Media', {'fields': ['featured_image', 'extra_photos', 'attachment', 'video_url', 'video_file']}),
        ('Publishing', {'fields': ['is_published', 'is_pinned', 'published_at', 'expires_at']}),
    ]

    def save_model(self, request, obj, form, change):
        if not obj.author_id:
            obj.author = request.user
        if obj.is_published and not obj.published_at:
            obj.published_at = timezone.now()
        super().save_model(request, obj, form, change)

    def save_related(self, request, form, formsets, change):
        super().save_related(request, form, formsets, change)
        files = sorted(form.cleaned_data.get('extra_photos') or [], key=lambda f: f.name.lower())
        if files:
            last = form.instance.photos.order_by('-order').values_list('order', flat=True).first() or 0
            AnnouncementPhoto.objects.bulk_create([
                AnnouncementPhoto(announcement=form.instance, image=f, order=last + i + 1)
                for i, f in enumerate(files)
            ])


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
