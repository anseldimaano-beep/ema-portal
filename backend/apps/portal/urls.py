from django.urls import path
from . import views

urlpatterns = [
    # Announcements
    path('announcements/', views.AnnouncementListView.as_view(), name='announcement-list'),
    path('announcements/<slug:slug>/', views.AnnouncementDetailView.as_view(), name='announcement-detail'),
    path('announcements/manage/', views.AnnouncementCreateUpdateView.as_view(), name='announcement-manage-list'),
    path('announcements/manage/<int:pk>/', views.AnnouncementManageView.as_view(), name='announcement-manage-detail'),

    # Calendar
    path('calendar/', views.CalendarEventListView.as_view(), name='calendar-list'),
    path('calendar/<int:pk>/', views.CalendarEventDetailView.as_view(), name='calendar-detail'),
    path('calendar/manage/', views.CalendarEventManageView.as_view(), name='calendar-manage'),

    # FAQ
    path('faqs/', views.FAQListView.as_view(), name='faq-list'),
    path('faqs/<int:pk>/', views.FAQDetailView.as_view(), name='faq-detail'),
    path('faqs/manage/', views.FAQManageView.as_view(), name='faq-manage'),

    # Senators
    path('senators/', views.SenatorListView.as_view(), name='senator-list'),
    path('senators/<int:pk>/', views.SenatorDetailView.as_view(), name='senator-detail'),
    path('senators/manage/', views.SenatorManageListView.as_view(), name='senator-manage-list'),
    path('senators/manage/<int:pk>/', views.SenatorManageDetailView.as_view(), name='senator-manage-detail'),

    # Committees
    path('committees/', views.CommitteeListView.as_view(), name='committee-list'),
    path('committees/<int:pk>/', views.CommitteeDetailView.as_view(), name='committee-detail'),
    path('committees/manage/', views.CommitteeManageListView.as_view(), name='committee-manage-list'),
    path('committees/manage/<int:pk>/', views.CommitteeManageDetailView.as_view(), name='committee-manage-detail'),

    # Pages
    path('pages/<str:page>/', views.PageContentView.as_view(), name='page-content'),
    path('pages/manage/', views.PageContentManageView.as_view(), name='page-manage'),

    # Contact
    path('contact/', views.ContactMessageCreateView.as_view(), name='contact-create'),
    path('contact/messages/', views.ContactMessageListView.as_view(), name='contact-list'),
    path('contact/messages/<int:pk>/', views.ContactMessageDetailView.as_view(), name='contact-detail'),

    # Stats & Search
    path('stats/', views.portal_stats, name='portal-stats'),
    path('search/', views.search_portal, name='portal-search'),
]
