"""
Authentication and User Management Views
"""
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from .serializers import (
    UserSerializer, UserDetailSerializer, RegisterSerializer,
    LoginSerializer, PasswordChangeSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer, StudentProfileSerializer, FacultyProfileSerializer
)
from .authentication import JWTTokenGenerator
from .permissions import IsAdmin, IsFaculty, IsStudent, IsOwnerOrAdmin
from .models import BlacklistedToken, PasswordResetToken
import uuid
import jwt
import hashlib
from datetime import datetime, timedelta, timezone as dt_timezone
from django.utils import timezone

User = get_user_model()


class RegisterView(APIView):
    """User registration endpoint."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Send welcome email
            try:
                send_mail(
                    subject='Welcome to EMA EMITS College Portal',
                    message=f'Hi {user.first_name}, your account has been created. Please verify your email.',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,
                )
            except Exception:
                pass

            pending_admin = (
                user.role in (User.Role.FACULTY, User.Role.ORGANIZATION)
                and user.leadership_position in User.ADMIN_ELIGIBLE_POSITIONS
            )
            message = 'Registration successful. Please check your email to verify your account.'
            if pending_admin:
                message += ' Your selected position requires approval from an existing Admin before Admin access is granted.'

            return Response({
                'message': message,
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """User login endpoint with JWT token generation."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            # Generate tokens
            access_token = JWTTokenGenerator.generate_access_token(user)
            refresh_token = JWTTokenGenerator.generate_refresh_token(user)

            return Response({
                'message': 'Login successful',
                'access_token': access_token,
                'refresh_token': refresh_token,
                'token_type': 'Bearer',
                'expires_in': settings.JWT_EXPIRATION_HOURS * 3600,
                'user': UserDetailSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(APIView):
    """Refresh access token using refresh token."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        payload = JWTTokenGenerator.decode_token(refresh_token)
        if not payload or payload.get('type') != 'refresh':
            return Response({'error': 'Invalid or expired refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = User.objects.get(id=payload['user_id'], is_active=True)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_access_token = JWTTokenGenerator.generate_access_token(user)
        return Response({
            'access_token': new_access_token,
            'token_type': 'Bearer',
            'expires_in': settings.JWT_EXPIRATION_HOURS * 3600
        })


class LogoutView(APIView):
    """Logout endpoint. Blacklists the presented access token so it can't be reused."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        raw_token = request.auth
        if raw_token:
            payload = JWTTokenGenerator.decode_token(raw_token)
            jti = payload.get('jti') if payload else None
            exp = payload.get('exp') if payload else None
            if jti and exp:
                BlacklistedToken.objects.get_or_create(
                    jti=jti,
                    defaults={
                        'user': request.user,
                        'expires_at': datetime.fromtimestamp(exp, tz=dt_timezone.utc),
                    }
                )
        return Response({'message': 'Logout successful. Please remove tokens from client storage.'})


class UserProfileView(APIView):
    """Get and update current user profile."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordChangeView(APIView):
    """Change password for authenticated user."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully. Please login again.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    """Request password reset email."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            generic_response = Response({
                'message': 'If an account exists with this email, you will receive reset instructions.'
            })
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Don't reveal whether the email exists.
                return generic_response

            # Only the hash is stored, mirroring password storage, so a DB
            # read alone can't be used to complete a reset.
            raw_token = uuid.uuid4().hex
            PasswordResetToken.objects.create(
                user=user,
                token_hash=hashlib.sha256(raw_token.encode()).hexdigest(),
                expires_at=timezone.now() + timedelta(hours=1),
            )

            try:
                send_mail(
                    subject='Reset your EMA EMITS password',
                    message=(
                        f'Hi {user.first_name}, use this code to reset your password: {raw_token}\n'
                        'This code expires in 1 hour. If you did not request this, ignore this email.'
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.email],
                    fail_silently=True,
                )
            except Exception:
                pass

            return generic_response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """Confirm a password reset using the token emailed by PasswordResetRequestView."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            token_hash = hashlib.sha256(serializer.validated_data['token'].encode()).hexdigest()
            reset_token = (
                PasswordResetToken.objects
                .filter(token_hash=token_hash)
                .order_by('-created_at')
                .first()
            )
            if not reset_token or not reset_token.is_valid:
                return Response({'error': 'Invalid or expired reset code.'}, status=status.HTTP_400_BAD_REQUEST)

            user = reset_token.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()

            reset_token.used_at = timezone.now()
            reset_token.save(update_fields=['used_at'])

            return Response({'message': 'Password reset successful. Please login with your new password.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    """List all users (Admin only)."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]
    filterset_fields = ['role', 'department', 'is_active', 'enrollment_status']
    search_fields = ['username', 'email', 'first_name', 'last_name']


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a specific user."""
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [IsOwnerOrAdmin]
    lookup_field = 'pk'


class StudentListView(generics.ListAPIView):
    """List all students (Faculty and Admin)."""
    queryset = User.objects.filter(role=User.Role.STUDENT)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['year_level', 'program', 'section', 'enrollment_status']
    search_fields = ['username', 'first_name', 'last_name', 'email']


class FacultyListView(generics.ListAPIView):
    """List all faculty members."""
    queryset = User.objects.filter(role=User.Role.FACULTY)
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['department']
    search_fields = ['first_name', 'last_name', 'specialization']


class PendingAdminRequestsView(generics.ListAPIView):
    """
    Teacher/Organization accounts that selected an admin-eligible position
    (Department Head, Principal, President) but have not yet been approved
    for Admin access. Admin-only.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        return User.objects.filter(
            role__in=[User.Role.FACULTY, User.Role.ORGANIZATION],
            leadership_position__in=list(User.ADMIN_ELIGIBLE_POSITIONS),
        )


class ApproveAdminView(APIView):
    """Promote a pending Teacher/Organization account to Admin. Admin-only."""
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            candidate = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if candidate.role not in (User.Role.FACULTY, User.Role.ORGANIZATION):
            return Response({'error': 'Only Teacher/Organization accounts can be approved for Admin.'},
                             status=status.HTTP_400_BAD_REQUEST)
        if candidate.leadership_position not in User.ADMIN_ELIGIBLE_POSITIONS:
            return Response({'error': 'This account did not select an admin-eligible position.'},
                             status=status.HTTP_400_BAD_REQUEST)

        candidate.role = User.Role.ADMIN
        candidate.save(update_fields=['role'])
        return Response({'message': f'{candidate.get_full_name()} approved as Admin.',
                          'user': UserSerializer(candidate).data})


class DashboardStatsView(APIView):
    """Get dashboard statistics for the current user."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        stats = {
            'role': user.role,
            'full_name': user.get_full_name(),
            'department': user.department,
            'notifications_count': 0,  # Would query Notification model
            'pending_tasks': 0,
        }

        if user.is_student:
            stats.update({
                'enrollment_status': user.enrollment_status,
                'year_level': user.year_level,
                'program': user.program,
                'section': user.section,
                'gpa': 0.0,  # Would calculate from grades
                'units_enrolled': 0,
            })
        elif user.is_faculty:
            stats.update({
                'classes_today': 0,
                'students_total': 0,
                'pending_grades': 0,
            })
        elif user.is_admin_staff:
            stats.update({
                'total_students': User.objects.filter(role=User.Role.STUDENT).count(),
                'total_faculty': User.objects.filter(role=User.Role.FACULTY).count(),
                'pending_enrollments': User.objects.filter(enrollment_status='pending').count(),
                'active_users_today': 0,
            })

        return Response(stats)
