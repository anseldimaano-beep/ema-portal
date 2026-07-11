from django.urls import path
from . import views

urlpatterns = [
    # Courses
    path('courses/', views.CourseListView.as_view(), name='course-list'),
    path('courses/<int:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('courses/manage/', views.CourseManageView.as_view(), name='course-manage'),

    # Course Offerings
    path('offerings/', views.CourseOfferingListView.as_view(), name='offering-list'),
    path('offerings/<int:pk>/', views.CourseOfferingDetailView.as_view(), name='offering-detail'),
    path('offerings/manage/', views.CourseOfferingManageView.as_view(), name='offering-manage'),

    # Enrollment
    path('enrollments/', views.EnrollmentListView.as_view(), name='enrollment-list'),
    path('enrollments/create/', views.EnrollmentCreateView.as_view(), name='enrollment-create'),
    path('enrollments/<int:pk>/', views.EnrollmentManageView.as_view(), name='enrollment-manage'),

    # Grades
    path('grades/student/', views.StudentGradeListView.as_view(), name='grades-student'),
    path('grades/faculty/', views.FacultyGradeListView.as_view(), name='grades-faculty'),
    path('grades/faculty/<int:pk>/', views.FacultyGradeUpdateView.as_view(), name='grades-faculty-update'),
    path('grades/<int:pk>/verify/', views.AdminGradeVerifyView.as_view(), name='grades-verify'),
    path('grades/<int:pk>/finalize/', views.AdminGradeFinalizeView.as_view(), name='grades-finalize'),

    # Rooms
    path('rooms/', views.RoomListView.as_view(), name='room-list'),
    path('rooms/<int:pk>/', views.RoomDetailView.as_view(), name='room-detail'),
    path('rooms/manage/', views.RoomManageView.as_view(), name='room-manage'),

    # Room Reservations
    path('reservations/', views.RoomReservationListView.as_view(), name='reservation-list'),
    path('reservations/create/', views.RoomReservationCreateView.as_view(), name='reservation-create'),
    path('reservations/<int:pk>/', views.RoomReservationDetailView.as_view(), name='reservation-detail'),
    path('reservations/<int:pk>/approve/', views.RoomReservationApproveView.as_view(), name='reservation-approve'),

    # Stats
    path('stats/', views.academic_stats, name='academic-stats'),
]
