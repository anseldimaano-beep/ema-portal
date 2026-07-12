"""
Serializers for authentication and user management
"""
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from .models import User, StudentProfile, FacultyProfile
import re


class UserSerializer(serializers.ModelSerializer):
    """Base user serializer for read operations."""
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    initials = serializers.CharField(source='get_initials', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'middle_name', 'full_name', 'initials', 'role', 'department',
            'phone', 'profile_picture', 'year_level', 'program', 
            'section', 'enrollment_status', 'position', 'specialization',
            'leadership_position', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = '__all__'
        read_only_fields = ['user']


class FacultyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacultyProfile
        fields = '__all__'
        read_only_fields = ['user']


class UserDetailSerializer(UserSerializer):
    """Detailed user serializer with profile data."""
    student_profile = StudentProfileSerializer(read_only=True)
    faculty_profile = FacultyProfileSerializer(read_only=True)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['student_profile', 'faculty_profile']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration.

    Registration only offers three self-service classifications:
    Student, Teacher (faculty), and Organization (EEMG). Admin can never be
    selected directly - it is only unlocked automatically when a Teacher or
    Organization registrant also selects a leadership `position`
    (Department Head, Principal, or President).
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[
        (User.Role.STUDENT, User.Role.STUDENT.label),
        (User.Role.FACULTY, User.Role.FACULTY.label),
        (User.Role.ORGANIZATION, User.Role.ORGANIZATION.label),
    ])
    leadership_position = serializers.ChoiceField(
        choices=User.Position.choices, required=False, default=User.Position.REGULAR
    )
    year_level = serializers.ChoiceField(
        choices=[(1, '1st Year'), (2, '2nd Year'), (3, '3rd Year'), (4, '4th Year')],
        required=False, allow_null=True
    )
    program = serializers.CharField(required=False, allow_blank=True, max_length=100)
    section = serializers.CharField(required=False, allow_blank=True, max_length=20)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name', 'role', 'leadership_position', 'department',
            'year_level', 'program', 'section',
        ]

    def validate_username(self, value):
        # Validate student ID format (e.g., 2023-12345 or EMP-001)
        if not re.match(r'^(\d{4}-\d{5}|EMP-\d{3}|ADMIN-\d{3})$', value):
            raise serializers.ValidationError(
                'Username must be in format: YYYY-XXXXX (students) or EMP-XXX (faculty)'
            )
        return value

    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})

        role = data.get('role')
        position = data.get('leadership_position', User.Position.REGULAR)

        if role == User.Role.STUDENT:
            # Students have no leadership position; force it regardless of input.
            data['leadership_position'] = User.Position.REGULAR
        elif role in User.ADMIN_ELIGIBLE_ROLES:
            data['leadership_position'] = position
            # Academic fields only apply to students; ignore if sent for other roles.
            data.pop('year_level', None)
            data.pop('program', None)
            data.pop('section', None)
        else:
            # Should be unreachable since the role ChoiceField above already
            # restricts options, but guard explicitly anyway.
            raise serializers.ValidationError({'role': 'Invalid classification selected.'})

        return data

    def create(self, validated_data):
        # Registration NEVER grants Admin directly, even for an admin-eligible
        # position (Department Head / Principal / President). At this scale
        # (hundreds of self-registering students/teachers) auto-elevating on
        # a self-reported title would let anyone claim to be "Principal" and
        # get instant Admin access. Instead the account is created as
        # Teacher/Organization, and an existing Admin must approve the
        # elevation via the pending-admin-requests endpoint.
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('Account is disabled.')
        if not user.email_verified and user.role != User.Role.GUEST:
            raise serializers.ValidationError('Please verify your email before logging in.')
        data['user'] = user
        return data


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError('New passwords do not match.')
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    new_password_confirm = serializers.CharField()

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError('Passwords do not match.')
        return data
