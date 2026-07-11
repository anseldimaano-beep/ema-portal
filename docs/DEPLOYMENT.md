# Deployment

## Docker
```bash
docker-compose up --build
```

## Manual
1. Install Python 3.12+, Node 20+, PostgreSQL 16
2. pip install -r requirements.txt
3. cd backend
4. python manage.py migrate
5. python manage.py createsuperuser
6. python manage.py runserver
7. cd ../frontend && npm start

## Production
- Change SECRET_KEY
- Set DEBUG=False
- Configure ALLOWED_HOSTS
- Set up SSL/HTTPS