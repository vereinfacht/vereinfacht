#!/bin/bash

echo "Starting the app"
nginx && docker-php-entrypoint php-fpm
