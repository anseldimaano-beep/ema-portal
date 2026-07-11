"""
Role-Based Access Control Permissions
"""
from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Allow access only to admin users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsFaculty(permissions.BasePermission):
    """Allow access only to faculty users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'faculty'


class IsStudent(permissions.BasePermission):
    """Allow access only to student users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'student'


class IsFacultyOrAdmin(permissions.BasePermission):
    """Allow access to faculty and admin users."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ['faculty', 'admin', 'staff']


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow users to access their own data, or admins to access any data."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj.id == request.user.id


class IsOwnerOrFaculty(permissions.BasePermission):
    """Allow students to access their own data, or faculty to access student data."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.user.role in ['faculty', 'admin', 'staff']:
            return True
        # For grade records, check if the student owns it
        if hasattr(obj, 'student'):
            return obj.student == request.user
        return obj.id == request.user.id
