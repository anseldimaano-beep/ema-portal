FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Ensure logs directory exists (Django logging handler writes here)
RUN mkdir -p /app/logs

# Collect static files
RUN python backend/manage.py collectstatic --noinput

# Run migrations and start server with gunicorn (production-grade WSGI server)
# Render (and most PaaS hosts) inject a $PORT env var at runtime; default to 8000 for local/docker-compose use
CMD ["sh", "-c", "python backend/manage.py migrate && cd backend && gunicorn ema_emits.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3"]
