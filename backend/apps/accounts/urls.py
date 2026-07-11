from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('refresh/', views.RefreshTokenView.as_view(), name='refresh-token'),
    path('logout/', views.LogoutView.as_view(), name='logout'),

    # User Management
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('password/change/', views.PasswordChangeView.as_view(), name='password-change'),
    path('password/reset/', views.PasswordResetRequestView.as_view(), name='password-reset'),
    path('password/reset/confirm/', views.PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

    # Admin/User Management
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('students/', views.StudentListView.as_view(), name='student-list'),
    path('faculty/', views.FacultyListView.as_view(), name='faculty-list'),
    path('admin-requests/', views.PendingAdminRequestsView.as_view(), name='pending-admin-requests'),
    path('admin-requests/<int:pk>/approve/', views.ApproveAdminView.as_view(), name='approve-admin'),

    # Dashboard
    path('dashboard/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
]
