#!/bin/bash
set -e
echo 'Setting up EMA EMITS Portal...'
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
cd backend
python manage.py migrate
python manage.py createsuperuser --noinput --username admin --email admin@emaemits.edu.ph || true
cd ..
cd frontend
npm install
cd ..
echo 'Setup complete!'