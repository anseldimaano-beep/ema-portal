from django.urls import path
from . import views

urlpatterns = [
    # Student self-service
    path('my-accounts/', views.MyAccountsView.as_view(), name='my-accounts'),
    path('my-account/', views.my_current_account, name='my-current-account'),

    # Cashier / Admin management
    path('accounts/', views.StudentAccountManageListView.as_view(), name='account-manage-list'),
    path('accounts/<int:pk>/', views.StudentAccountManageDetailView.as_view(), name='account-manage-detail'),
    path('permits/<int:pk>/', views.ExamPermitManageView.as_view(), name='permit-manage-detail'),
]
