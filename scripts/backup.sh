#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p backups
docker-compose exec -T db pg_dump -U ema_emits_user ema_emits_db > backups/db_$DATE.sql
tar -czf backups/media_$DATE.tar.gz backend/media/
echo 'Backup: backups/*_$DATE.*'