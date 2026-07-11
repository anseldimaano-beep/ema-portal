"""
Creates (or updates) a superuser from environment variables.

Designed to run automatically on every deploy (see Dockerfile CMD).
Safe to run repeatedly: if the account already exists, it just makes
sure the password/staff/superuser flags are correct and exits quietly.

Required env vars:
    DJANGO_SUPERUSER_EMAIL
    DJANGO_SUPERUSER_PASSWORD
Optional (fall back to sensible defaults):
    DJANGO_SUPERUSER_USERNAME   (default: "admin")
    DJANGO_SUPERUSER_FIRST_NAME (default: "Admin")
    DJANGO_SUPERUSER_LAST_NAME  (default: "User")

If DJANGO_SUPERUSER_EMAIL / DJANGO_SUPERUSER_PASSWORD are not set,
the command does nothing (so it's safe to leave in the startup
command permanently, even after you've created your admin account).
"""
import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update a superuser from DJANGO_SUPERUSER_* environment variables."

    def handle(self, *args, **options):
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if not email or not password:
            self.stdout.write("DJANGO_SUPERUSER_EMAIL/PASSWORD not set, skipping admin creation.")
            return

        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
        first_name = os.environ.get("DJANGO_SUPERUSER_FIRST_NAME", "Admin")
        last_name = os.environ.get("DJANGO_SUPERUSER_LAST_NAME", "User")

        User = get_user_model()
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
            },
        )
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f"Created superuser: {email}"))
        else:
            self.stdout.write(self.style.SUCCESS(f"Updated existing superuser: {email}"))
