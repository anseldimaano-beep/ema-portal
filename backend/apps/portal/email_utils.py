import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

RESEND_API_URL = 'https://api.resend.com/emails'


def send_via_resend(to_email, subject, text_body):
    """
    Send an email through Resend's HTTP API (works over normal HTTPS,
    so it isn't affected by hosts that block outbound SMTP like Render).
    Fails silently and logs the error rather than raising, so a broken
    email never breaks the request that triggered it.
    """
    api_key = getattr(settings, 'RESEND_API_KEY', '')
    from_email = getattr(settings, 'RESEND_FROM_EMAIL', 'onboarding@resend.dev')

    if not api_key:
        logger.warning('RESEND_API_KEY is not set; skipping email to %s', to_email)
        return False

    try:
        response = requests.post(
            RESEND_API_URL,
            headers={'Authorization': f'Bearer {api_key}'},
            json={
                'from': from_email,
                'to': [to_email],
                'subject': subject,
                'text': text_body,
            },
            timeout=10,
        )
        if response.status_code >= 400:
            logger.error('Resend API error %s: %s', response.status_code, response.text)
            return False
        return True
    except requests.RequestException as exc:
        logger.error('Resend request failed: %s', exc)
        return False
