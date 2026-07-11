from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Course, CourseOffering, Enrollment, Grade, Room, RoomReservation
from .serializers import (
    CourseSerializer, CourseOfferingSerializer, EnrollmentSerializer,
    GradeSerializer, GradeEntrySerializer, StudentGradeViewSerializer,
    RoomSerializer, RoomReservationSerializer, RoomReservationAdminSerializer
)
from apps.accounts.permissions import IsAdmin, IsFaculty, IsStudent, IsFacultyOrAdmin, IsOwnerOrFaculty


# ==================== COURSES ====================

class CourseListView(generics.ListAPIView):
    """List all active courses (public)."""
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department', 'level', 'semester_offered', 'year_level']
    search_fields = ['code', 'title', 'description']
    ordering = ['code']


class CourseDetailView(generics.RetrieveAPIView):
    """Retrieve course details (public)."""
    queryset = Course.objects.filter(is_active=True)
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


class CourseManageView(generics.ListCreateAPIView):
    """Create/Update courses (Admin only)."""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdmin]


# ==================== COURSE OFFERINGS ====================

class CourseOfferingListView(generics.ListAPIView):
    """List course offerings for current semester."""
    queryset = CourseOffering.objects.all()
    serializer_class = CourseOfferingSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['semester', 'status', 'course__department']
    search_fields = ['course__code', 'course__title', 'instructor__first_name', 'instructor__last_name']
    ordering = ['course__code', 'section']


class CourseOfferingDetailView(generics.RetrieveAPIView):
    """Retrieve course offering details."""
    queryset = CourseOffering.objects.all()
    serializer_class = CourseOfferingSerializer
    permission_classes = [IsAuthenticated]


class CourseOfferingManageView(generics.ListCreateAPIView):
    """Manage course offerings (Admin/Faculty)."""
    queryset = CourseOffering.objects.all()
    serializer_class = CourseOfferingSerializer
    permission_classes = [IsFacultyOrAdmin]


# ==================== ENROLLMENT ====================

class EnrollmentListView(generics.ListAPIView):
    """List enrollments for current user."""
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_student:
            return Enrollment.objects.filter(student=user)
        elif user.is_faculty:
            return Enrollment.objects.filter(course_offering__instructor=user)
        elif user.is_admin_staff:
            return Enrollment.objects.all()
        return Enrollment.objects.none()


class EnrollmentCreateView(generics.CreateAPIView):
    """Enroll in a course (Student only)."""
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsStudent]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class EnrollmentManageView(generics.RetrieveUpdateDestroyAPIView):
    """Update/Delete enrollment (Admin only)."""
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAdmin]


# ==================== GRADES ====================

class StudentGradeListView(generics.ListAPIView):
    """Students view their own grades."""
    serializer_class = StudentGradeViewSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        return Grade.objects.filter(
            enrollment__student=self.request.user,
            status__in=[Grade.GradeStatus.SUBMITTED, Grade.GradeStatus.VERIFIED, Grade.GradeStatus.FINALIZED]
        )


class FacultyGradeListView(generics.ListAPIView):
    """Faculty view grades for their courses."""
    serializer_class = GradeEntrySerializer
    permission_classes = [IsFaculty]

    def get_queryset(self):
        return Grade.objects.filter(
            enrollment__course_offering__instructor=self.request.user
        )


class FacultyGradeUpdateView(generics.UpdateAPIView):
    """Faculty enter/update grades."""
    queryset = Grade.objects.all()
    serializer_class = GradeEntrySerializer
    permission_classes = [IsFaculty]

    def perform_update(self, serializer):
        serializer.save(
            entered_by=self.request.user,
            entered_at=timezone.now(),
            status=Grade.GradeStatus.SUBMITTED
        )


class AdminGradeVerifyView(generics.UpdateAPIView):
    """Admin verify submitted grades."""
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsAdmin]

    def perform_update(self, serializer):
        serializer.save(
            verified_by=self.request.user,
            verified_at=timezone.now(),
            status=Grade.GradeStatus.VERIFIED
        )


class AdminGradeFinalizeView(generics.UpdateAPIView):
    """Admin finalize grades (irreversible)."""
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsAdmin]

    def perform_update(self, serializer):
        serializer.save(status=Grade.GradeStatus.FINALIZED)


# ==================== ROOMS ====================

class RoomListView(generics.ListAPIView):
    """List all active rooms."""
    queryset = Room.objects.filter(is_active=True)
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['room_type', 'building', 'has_projector', 'has_aircon']
    search_fields = ['name', 'code', 'building']
    ordering = ['building', 'floor', 'code']


class RoomDetailView(generics.RetrieveAPIView):
    """Retrieve room details."""
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]


class RoomManageView(generics.ListCreateAPIView):
    """Manage rooms (Admin only)."""
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAdmin]


# ==================== ROOM RESERVATIONS ====================

class RoomReservationListView(generics.ListAPIView):
    """List reservations for current user."""
    serializer_class = RoomReservationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin_staff:
            return RoomReservation.objects.all()
        return RoomReservation.objects.filter(requested_by=user)


class RoomReservationCreateView(generics.CreateAPIView):
    """Create room reservation (Faculty/Staff)."""
    queryset = RoomReservation.objects.all()
    serializer_class = RoomReservationSerializer
    permission_classes = [IsFacultyOrAdmin]

    def perform_create(self, serializer):
        serializer.save(requested_by=self.request.user)


class RoomReservationDetailView(generics.RetrieveAPIView):
    """Retrieve reservation details."""
    queryset = RoomReservation.objects.all()
    serializer_class = RoomReservationSerializer
    permission_classes = [IsAuthenticated]


class RoomReservationApproveView(generics.UpdateAPIView):
    """Approve/reject reservation (Admin only)."""
    queryset = RoomReservation.objects.all()
    serializer_class = RoomReservationAdminSerializer
    permission_classes = [IsAdmin]

    def perform_update(self, serializer):
        serializer.save(
            approved_by=self.request.user,
            approved_at=timezone.now()
        )


# ==================== ACADEMIC STATS ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def academic_stats(request):
    """Get academic statistics for dashboard."""
    user = request.user
    stats = {}

    if user.is_student:
        enrollments = Enrollment.objects.filter(student=user, status=Enrollment.Status.ENROLLED)
        stats = {
            'enrolled_courses': enrollments.count(),
            'total_units': sum(e.course_offering.course.units for e in enrollments),
            'current_gpa': 0.0,  # Would calculate from finalized grades
            'pending_grades': Grade.objects.filter(
                enrollment__student=user,
                status=Grade.GradeStatus.PENDING
            ).count(),
        }
    elif user.is_faculty:
        offerings = CourseOffering.objects.filter(instructor=user)
        stats = {
            'courses_teaching': offerings.count(),
            'total_students': Enrollment.objects.filter(
                course_offering__instructor=user,
                status=Enrollment.Status.ENROLLED
            ).count(),
            'pending_grade_submissions': Grade.objects.filter(
                enrollment__course_offering__instructor=user,
                status=Grade.GradeStatus.PENDING
            ).count(),
        }
    elif user.is_admin_staff:
        stats = {
            'total_courses': Course.objects.filter(is_active=True).count(),
            'total_offerings': CourseOffering.objects.count(),
            'total_enrollments': Enrollment.objects.filter(status=Enrollment.Status.ENROLLED).count(),
            'pending_reservations': RoomReservation.objects.filter(status=RoomReservation.Status.PENDING).count(),
        }

    return Response(stats)
