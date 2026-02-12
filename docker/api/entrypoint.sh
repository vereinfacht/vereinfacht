#!/bin/bash

mkdir -p /var/www/html/storage/framework/{sessions,views,cache}
php /var/www/html/artisan storage:link
php /var/www/html/artisan optimize:clear
php /var/www/html/artisan filament:clear
php -r 'opcache_reset();'
php /var/www/html/artisan config:cache
php /var/www/html/artisan route:cache
php /var/www/html/artisan view:cache
php /var/www/html/artisan event:cache
# Wait until db is online
echo "Wait for DB to be ready"
while ! nc -z database 3306; do
    sleep 0.5
    echo "Wait 0.5 seconds"
done
echo "DB is ready"
sleep 1
php /var/www/html/artisan migrate --force

exec "$@"
