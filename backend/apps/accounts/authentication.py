"""
JWT Authentication for Django REST Framework
Production-ready with refresh tokens and blacklist support
"""
import uuid
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication, exceptions

User = get_user_model()


class JWTAuthentication(authentication.BaseAuthentication):
    """Custom JWT authentication class."""

    keyword = 'Bearer'

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).split()

        if not auth_header or auth_header[0].lower() != self.keyword.lower().encode():
            return None

        if len(auth_header) == 1:
            msg = 'Invalid token header. No credentials provided.'
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth_header) > 2:
            msg = 'Invalid token header. Token string should not contain spaces.'
            raise exceptions.AuthenticationFailed(msg)

        try:
            token = auth_header[1].decode('utf-8')
        except UnicodeError:
            msg = 'Invalid token header. Token string should not contain invalid characters.'
            raise exceptions.AuthenticationFailed(msg)

        return self.authenticate_credentials(token)

    def authenticate_credentials(self, token):
        """Validate JWT token and return user."""
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired. Please login again.')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token. Please login again.')

        # Reject refresh tokens (or anything else) presented as an access token.
        # Without this check, a stolen/leaked refresh token could be used
        # directly against every API endpoint instead of only /auth/refresh/.
        if payload.get('type') != 'access':
            raise exceptions.AuthenticationFailed('Invalid token type. An access token is required.')

        jti = payload.get('jti')
        if jti:
            from .models import BlacklistedToken
            if BlacklistedToken.objects.filter(jti=jti).exists():
                raise exceptions.AuthenticationFailed('Token has been revoked. Please login again.')

        try:
            user = User.objects.get(id=payload['user_id'], is_active=True)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('User not found or inactive.')

        # Stash the decoded payload so views (e.g. logout) can blacklist this
        # exact token without re-decoding it.
        request_token_payload = payload
        user.token_payload = request_token_payload

        return (user, token)


class JWTTokenGenerator:
    """Utility class for generating and managing JWT tokens."""

    @staticmethod
    def generate_access_token(user):
        """Generate short-lived access token."""
        payload = {
            'user_id': user.id,
            'username': user.username,
            'role': user.role,
            'jti': uuid.uuid4().hex,
            'exp': datetime.utcnow() + timedelta(hours=settings.JWT_EXPIRATION_HOURS),
            'iat': datetime.utcnow(),
            'type': 'access'
        }
        return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    @staticmethod
    def generate_refresh_token(user):
        """Generate long-lived refresh token."""
        payload = {
            'user_id': user.id,
            'jti': uuid.uuid4().hex,
            'exp': datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_EXPIRATION_DAYS),
            'iat': datetime.utcnow(),
            'type': 'refresh'
        }
        return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    @staticmethod
    def decode_token(token):
        """Decode and validate token."""
        try:
            return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
