"""
Cloudinary-aware storage backends for the Portal app.

Falls back to plain local filesystem storage automatically when Cloudinary
credentials aren't configured (e.g. local development via docker compose),
so nothing breaks for anyone without a Cloudinary account. Once
CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET are set as environment
variables (e.g. on Render), uploads switch to Cloudinary automatically on
next deploy — no code changes needed.

These are passed as *callables* (not storage instances) to each FileField's
`storage=` argument, per Django's supported pattern for environment-dependent
storage selection. This matters because passing an already-instantiated
storage class would get "frozen" into migration files at whatever the
environment happened to be when `makemigrations` was run; a callable instead
gets re-evaluated fresh in every environment.
"""
from django.conf import settings
from django.core.files.storage import FileSystemStorage


def _cloudinary_configured():
    return bool(getattr(settings, 'CLOUDINARY_STORAGE', {}).get('CLOUD_NAME'))


def get_attachment_storage():
    """Raw (non-image, non-video) file storage — used for the Attachment field."""
    if _cloudinary_configured():
        from cloudinary_storage.storage import RawMediaCloudinaryStorage
        return RawMediaCloudinaryStorage()
    return FileSystemStorage()


def get_video_storage():
    """Video file storage — used for the Video file field."""
    if _cloudinary_configured():
        from cloudinary_storage.storage import VideoMediaCloudinaryStorage
        return VideoMediaCloudinaryStorage()
    return FileSystemStorage()
