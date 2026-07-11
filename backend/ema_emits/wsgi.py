"""
WSGI config for ema_emits project.
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ema_emits.settings')

application = get_wsgi_application()
