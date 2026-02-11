# use to copy alpine node binaries later
FROM node:20-alpine3.23 AS node

# Define base image
FROM php:8.3-cli-alpine3.23

# Define build arguments
ARG USER_ID
ARG GROUP_ID

# Define environment variables
ENV USER_NAME=vvuser
ENV GROUP_NAME=vvuser
ENV USER_ID=$USER_ID
ENV GROUP_ID=$GROUP_ID
ENV USER_ID=${USER_ID:-1001}
ENV GROUP_ID=${GROUP_ID:-1001}
ENV PS1='\u@\h \W \[\033[1;33m\]\$ \[\033[0m\]'

# Add group and user based on build arguments
RUN addgroup --gid ${GROUP_ID} ${GROUP_NAME}
RUN adduser --disabled-password --gecos '' --uid ${USER_ID} --ingroup ${GROUP_NAME} ${USER_NAME}

# Set user and group of working directory
RUN chown -R ${USER_NAME}:${GROUP_NAME} /var/www/html

# Update and install packages
RUN apk update && apk add \
    bash \
    git \
    gnupg \
    libzip-dev \
    unzip \
    libstdc++ \
    icu-dev \
    pkgconfig \
    libpng-dev \
    libjpeg-turbo-dev \
    libpng \
    libjpeg-turbo \
    freetype-dev \
    freetype \
    zip \
    imagemagick \
    imagemagick-dev \
    ghostscript \
    autoconf \
    g++ \
    make

# Copy files from node image
COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

# Install Composer manually
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

# Show some usefull versions
RUN php -v && \
    composer --version && \
    node --version && \
    npm --version && \
    cat /etc/os-release | grep PRETTY_NAME

# Configure GD (Required for media processing)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# Install PHP extensions
RUN docker-php-ext-install gd zip pdo_mysql bcmath exif

# Install intl extension
RUN docker-php-ext-configure intl && docker-php-ext-install intl

# Install Imagick (Required for media PDF preview generation)
RUN pecl install imagick \
    && docker-php-ext-enable imagick
