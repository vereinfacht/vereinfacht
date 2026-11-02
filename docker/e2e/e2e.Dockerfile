# Define base image
FROM cypress/browsers:latest

WORKDIR /var/www/html/e2e

COPY e2e/ .

RUN npm ci && npx cypress install
