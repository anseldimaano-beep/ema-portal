from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from datetime import timedelta
from .models import Announcement, AcademicCalendar, FAQ, PageContent, ContactMessage, Senator, Committee
from .serializers import (
    AnnouncementSerializer, AnnouncementListSerializer,
    AcademicCalendarSerializer, FAQSerializer,
    PageContentSerializer, ContactMessageSerializer, ContactMessageAdminSerializer,
    SenatorSerializer, CommitteeSerializer,
)
from apps.accounts.permissions import IsAdmin, IsFacultyOrAdmin


# ==================== ANNOUNCEMENTS ====================

class AnnouncementListView(generics.ListAPIView):
    """List all published announcements (public)."""
    queryset = Announcement.objects.filter(is_published=True)
    serializer_class = AnnouncementListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'priority']
    search_fields = ['title', 'content', 'excerpt']
    ordering_fields = ['published_at', 'created_at', 'priority']
    ordering = ['-is_pinned', '-published_at']


class AnnouncementDetailView(generics.RetrieveAPIView):
    """Retrieve a specific announcement (public)."""
    queryset = Announcement.objects.filter(is_published=True)
    serializer_class = AnnouncementSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class AnnouncementCreateUpdateView(generics.ListCreateAPIView):
    """Create announcement (Admin/Faculty only)."""
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsFacultyOrAdmin]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AnnouncementManageView(generics.RetrieveUpdateDestroyAPIView):
    """Update/Delete announcement (Admin/Faculty only)."""
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsFacultyOrAdmin]
    lookup_field = 'pk'


# ==================== ACADEMIC CALENDAR ====================

class CalendarEventListView(generics.ListAPIView):
    """List calendar events (public)."""
    queryset = AcademicCalendar.objects.all()
    serializer_class = AcademicCalendarSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['event_type', 'is_academic']
    ordering = ['start_date', 'start_time']


class CalendarEventDetailView(generics.RetrieveAPIView):
    """Retrieve calendar event (public)."""
    queryset = AcademicCalendar.objects.all()
    serializer_class = AcademicCalendarSerializer
    permission_classes = [AllowAny]


class CalendarEventManageView(generics.ListCreateAPIView):
    """Create calendar event (Admin only)."""
    queryset = AcademicCalendar.objects.all()
    serializer_class = AcademicCalendarSerializer
    permission_classes = [IsAdmin]


# ==================== FAQ ====================

class FAQListView(generics.ListAPIView):
    """List all published FAQs (public)."""
    queryset = FAQ.objects.filter(is_published=True)
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['question', 'answer']
    ordering = ['category', 'order']


class FAQDetailView(generics.RetrieveAPIView):
    """Retrieve FAQ (public)."""
    queryset = FAQ.objects.filter(is_published=True)
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count += 1
        instance.save(update_fields=['view_count'])
        return super().retrieve(request, *args, **kwargs)


class FAQManageView(generics.ListCreateAPIView):
    """Create FAQ (Admin/Faculty only)."""
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [IsFacultyOrAdmin]


# ==================== PAGE CONTENT ====================

class PageContentView(generics.RetrieveAPIView):
    """Retrieve page content by page identifier (public)."""
    queryset = PageContent.objects.all()
    serializer_class = PageContentSerializer
    permission_classes = [AllowAny]
    lookup_field = 'page'


class PageContentManageView(generics.ListCreateAPIView):
    """Create/Update page content (Admin only)."""
    queryset = PageContent.objects.all()
    serializer_class = PageContentSerializer
    permission_classes = [IsAdmin]

    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user)


# ==================== SENATORS ====================

class SenatorListView(generics.ListAPIView):
    """List active senators (public)."""
    queryset = Senator.objects.filter(is_active=True)
    serializer_class = SenatorSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['position', 'department']
    ordering = ['order', 'name']


class SenatorDetailView(generics.RetrieveAPIView):
    """Retrieve a senator (public)."""
    queryset = Senator.objects.filter(is_active=True)
    serializer_class = SenatorSerializer
    permission_classes = [AllowAny]


class SenatorManageListView(generics.ListCreateAPIView):
    """List/create senators (Admin/Faculty only)."""
    queryset = Senator.objects.all()
    serializer_class = SenatorSerializer
    permission_classes = [IsFacultyOrAdmin]


class SenatorManageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Update/delete a senator (Admin/Faculty only)."""
    queryset = Senator.objects.all()
    serializer_class = SenatorSerializer
    permission_classes = [IsFacultyOrAdmin]


# ==================== COMMITTEES ====================

class CommitteeListView(generics.ListAPIView):
    """List active committees, with chairperson and members (public)."""
    queryset = Committee.objects.filter(is_active=True).select_related('chairperson').prefetch_related('members')
    serializer_class = CommitteeSerializer
    permission_classes = [AllowAny]
    ordering = ['order', 'name']


class CommitteeDetailView(generics.RetrieveAPIView):
    """Retrieve a committee (public)."""
    queryset = Committee.objects.filter(is_active=True).select_related('chairperson').prefetch_related('members')
    serializer_class = CommitteeSerializer
    permission_classes = [AllowAny]


class CommitteeManageListView(generics.ListCreateAPIView):
    """List/create committees (Admin/Faculty only)."""
    queryset = Committee.objects.all().select_related('chairperson').prefetch_related('members')
    serializer_class = CommitteeSerializer
    permission_classes = [IsFacultyOrAdmin]


class CommitteeManageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Update/delete a committee (Admin/Faculty only)."""
    queryset = Committee.objects.all().select_related('chairperson').prefetch_related('members')
    serializer_class = CommitteeSerializer
    permission_classes = [IsFacultyOrAdmin]


# ==================== CONTACT ====================

class ContactMessageCreateView(generics.CreateAPIView):
    """Submit contact form (public)."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]


class ContactMessageListView(generics.ListAPIView):
    """List all contact messages (Admin only)."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageAdminSerializer
    permission_classes = [IsAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'category']
    ordering = ['-created_at']


class ContactMessageDetailView(generics.RetrieveUpdateAPIView):
    """Update contact message status (Admin only)."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageAdminSerializer
    permission_classes = [IsAdmin]


# ==================== DASHBOARD & STATS ====================

@api_view(['GET'])
@permission_classes([AllowAny])
def portal_stats(request):
    """Get public portal statistics."""
    today = timezone.now().date()
    upcoming_events = AcademicCalendar.objects.filter(
        start_date__gte=today,
        start_date__lte=today + timedelta(days=30)
    ).count()

    return Response({
        'total_announcements': Announcement.objects.filter(is_published=True).count(),
        'pinned_announcements': Announcement.objects.filter(is_published=True, is_pinned=True).count(),
        'upcoming_events': upcoming_events,
        'total_faqs': FAQ.objects.filter(is_published=True).count(),
        'recent_announcements': AnnouncementListSerializer(
            Announcement.objects.filter(is_published=True).order_by('-published_at')[:5],
            many=True
        ).data
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def search_portal(request):
    """Global search across portal content."""
    query = request.GET.get('q', '')
    if not query or len(query) < 3:
        return Response({'error': 'Search query must be at least 3 characters.'}, status=400)

    announcements = Announcement.objects.filter(
        is_published=True,
        title__icontains=query
    )[:5]

    faqs = FAQ.objects.filter(
        is_published=True,
        question__icontains=query
    )[:5]

    events = AcademicCalendar.objects.filter(
        title__icontains=query
    )[:5]

    return Response({
        'query': query,
        'announcements': AnnouncementListSerializer(announcements, many=True).data,
        'faqs': FAQSerializer(faqs, many=True).data,
        'events': AcademicCalendarSerializer(events, many=True).data,
        'total_results': len(announcements) + len(faqs) + len(events)
    })
