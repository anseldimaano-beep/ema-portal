from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import StudentAccount, ExamPermit
from .serializers import (
    StudentAccountSerializer, StudentAccountManageSerializer, ExamPermitSerializer,
)
from apps.accounts.permissions import IsStudent, IsFacultyOrAdmin


# ==================== STUDENT SELF-SERVICE ====================

class MyAccountsView(generics.ListAPIView):
    """List the logged-in student's fee accounts, most recent term first."""
    serializer_class = StudentAccountSerializer
    permission_classes = [IsAuthenticated, IsStudent]

    def get_queryset(self):
        return StudentAccount.objects.filter(student=self.request.user).prefetch_related('exam_permits')


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsStudent])
def my_current_account(request):
    """
    Convenience endpoint for the portal dashboard: returns the student's
    most recent term account (with tuition, misc fee, balance, exam
    permits) plus their enrollment status. Returns nulled-out defaults
    instead of a 404 if no account has been set up yet, so the UI can
    render an empty state gracefully.
    """
    account = (
        StudentAccount.objects.filter(student=request.user)
        .prefetch_related('exam_permits')
        .order_by('-term')
        .first()
    )

    if not account:
        return Response({
            'exists': False,
            'enrollment_status': request.user.enrollment_status,
            'enrollment_status_display': request.user.get_enrollment_status_display(),
            'term': None,
            'tuition_fee': '0.00', 'tuition_paid': '0.00', 'tuition_balance': '0.00',
            'misc_fee': '0.00', 'misc_paid': '0.00', 'misc_balance': '0.00',
            'total_fee': '0.00', 'total_paid': '0.00', 'total_balance': '0.00',
            'percent_paid': '0.00',
            'exam_permits': [],
        })

    data = StudentAccountSerializer(account).data
    data['exists'] = True
    data['enrollment_status_display'] = request.user.get_enrollment_status_display()
    return Response(data)


# ==================== CASHIER / ADMIN MANAGEMENT ====================

class StudentAccountManageListView(generics.ListCreateAPIView):
    """List all fee accounts / create a new one (Staff, Faculty admins, Admin only)."""
    queryset = StudentAccount.objects.select_related('student').prefetch_related('exam_permits')
    permission_classes = [IsFacultyOrAdmin]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['term', 'student']

    def get_serializer_class(self):
        return StudentAccountSerializer if self.request.method == 'GET' else StudentAccountManageSerializer

    def perform_create(self, serializer):
        account = serializer.save()
        # Auto-create the four exam permit rows for the new account.
        for exam_type, _label in ExamPermit.ExamType.choices:
            ExamPermit.objects.get_or_create(account=account, exam_type=exam_type)


class StudentAccountManageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve/update/delete a specific fee account (Staff/Faculty admins, Admin only)."""
    queryset = StudentAccount.objects.select_related('student').prefetch_related('exam_permits')
    permission_classes = [IsFacultyOrAdmin]

    def get_serializer_class(self):
        return StudentAccountSerializer if self.request.method == 'GET' else StudentAccountManageSerializer


class ExamPermitManageView(generics.RetrieveUpdateAPIView):
    """Release/withhold a single exam permit, or leave it on auto (Staff, Admin only)."""
    queryset = ExamPermit.objects.select_related('account__student')
    serializer_class = ExamPermitSerializer
    permission_classes = [IsFacultyOrAdmin]
