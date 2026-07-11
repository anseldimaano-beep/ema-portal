"""
Core Views - System health and shared utilities
"""
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Basic liveness/readiness check for load balancers and uptime monitors."""
    db_ok = True
    try:
        connection.ensure_connection()
    except Exception:
        db_ok = False

    status_code = 200 if db_ok else 503
    return Response({
        'status': 'ok' if db_ok else 'degraded',
        'database': 'ok' if db_ok else 'unavailable',
        'debug': settings.DEBUG,
    }, status=status_code)
