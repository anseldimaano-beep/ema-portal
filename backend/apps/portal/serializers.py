from rest_framework import serializers
from .models import Announcement, AcademicCalendar, FAQ, PageContent, ContactMessage


class AnnouncementSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)

    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'category',
            'category_display', 'priority', 'priority_display',
            'featured_image', 'attachment', 'author_name',
            'is_published', 'is_pinned', 'published_at', 'expires_at',
            'view_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'view_count', 'created_at', 'updated_at']


class AnnouncementListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'slug', 'excerpt', 'category', 'priority', 
                  'featured_image', 'is_pinned', 'published_at', 'author_name']


class AcademicCalendarSerializer(serializers.ModelSerializer):
    event_type_display = serializers.CharField(source='get_event_type_display', read_only=True)

    class Meta:
        model = AcademicCalendar
        fields = [
            'id', 'title', 'description', 'event_type', 'event_type_display',
            'start_date', 'end_date', 'start_time', 'end_time',
            'location', 'is_all_day', 'is_academic', 'is_recurring'
        ]


class FAQSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'category_display', 'order', 'view_count']


class PageContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageContent
        fields = ['id', 'page', 'title', 'content', 'last_updated']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']


class ContactMessageAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['created_at']
