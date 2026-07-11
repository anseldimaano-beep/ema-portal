"""
ASGI config for ema_emits project.
"""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ema_emits.settings')

application = get_asgi_application()
