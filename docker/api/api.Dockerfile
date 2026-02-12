# Define base image
FROM php:8.3-fpm-alpine3.23

# Define build arguments
ARG USER_ID
ARG GROUP_ID

# Define environment variables
ENV DOCUMENT_ROOT=/var/www/html/public
ENV USER_NAME=vvuser
ENV GROUP_NAME=vvuser
ENV USER_ID=$USER_ID
ENV GROUP_ID=$GROUP_ID
ENV USER_ID=${USER_ID:-1001}
ENV GROUP_ID=${GROUP_ID:-1001}
ENV PS1='\u@\h \W \[\033[1;33m\]\$ \[\033[0m\]'
ENV PHP_OPCACHE_VALIDATE_TIMESTAMPS="0"

# Add group and user based on build arguments
RUN addgroup --gid ${GROUP_ID} ${GROUP_NAME}
RUN adduser --disabled-password --gecos '' --uid ${USER_ID} --ingroup ${GROUP_NAME} ${USER_NAME}

# Set user and group of working directory
RUN chown -R ${USER_NAME}:${GROUP_NAME} /var/www/html

# Set nginx document root
RUN mkdir ${DOCUMENT_ROOT}

# Update and install packages
RUN apk update && apk add \
    bash \
    icu-dev \
    nginx \
    libzip-dev \
    zip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    pkgconfig \
    libpng \
    libjpeg-turbo \
    freetype \
    imagemagick \
    imagemagick-dev \
    ghostscript \
    autoconf \
    g++ \
    make

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-configure intl && docker-php-ext-install intl zip
RUN docker-php-ext-install opcache zip

# Configure and install GD extension for image processing
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Install additional extensions for media processing
RUN docker-php-ext-install bcmath exif

# Install Imagick (Required for media PDF preview generation)
RUN pecl install imagick \
    && docker-php-ext-enable imagick

# Set nginx and PHP-FPM user
RUN sed -ri -e "s!user nginx!user ${USER_NAME}!g" /etc/nginx/nginx.conf
RUN sed -ri -e "s!user = www-data!user = ${USER_NAME}!g" /usr/local/etc/php-fpm.d/www.conf
RUN sed -ri -e "s!group = www-data!group = ${GROUP_NAME}!g" /usr/local/etc/php-fpm.d/www.conf

# Manualy expose port 80 for outside access to nginx
EXPOSE 80

# Copy configuration to application container
COPY docker/api/nginx.conf /etc/nginx/http.d/default.conf

# Use the default production configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
# zzz-custom-php.ini is loaded last (because of the zzz) and can override any setting.
COPY docker/api/php.ini "$PHP_INI_DIR/conf.d/zzz-custom-php.ini"
# Copy php-fpm configuration
COPY docker/api/php-fpm-www.conf /usr/local/etc/php-fpm.d/zzz-www.conf

# Copy app content
COPY --chown=${USER_NAME}:${GROUP_NAME} api/ /var/www/html
COPY --chown=${USER_NAME}:${GROUP_NAME} docker/api/entrypoint.sh /var/www/docker/entrypoint.sh
COPY --chown=${USER_NAME}:${GROUP_NAME} docker/api/startup.sh /var/www/docker/startup.sh

# Make scripts executeable
RUN chmod +x /var/www/docker/entrypoint.sh
RUN chmod +x /var/www/docker/startup.sh

# Start app
ENTRYPOINT ["bash", "/var/www/docker/entrypoint.sh"]
CMD ["bash", "/var/www/docker/startup.sh"]
