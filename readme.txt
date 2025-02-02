# Application Setup Guide

## Prerequisites

Install the wkhtmltopdf-binary gem manually:

```
gem fetch wkhtmltopdf-binary -v 0.12.6.8
```

Place the downloaded gem in the base folder of the utilities repository.

Initialize git submodules:

```
git submodule update --init --recursive
```

## Running the Application

### Full Stack Setup

Launch all services:

```
docker-compose up
```

### Individual Services

Run specific services with their dependencies:

```
# Database only
docker-compose up db

# Redis only
docker-compose up redis

# Legacy Rails application
docker-compose up db redis sidekiq legacy_rails

# Next Rails application
docker-compose up db redis sidekiq next_rails
```

## Useful Commands

### Container Access

```
# Access Legacy Rails console
docker-compose exec legacy_rails rails c

# Access Next Rails console
docker-compose exec next_rails rails c

# Access MySQL
docker-compose exec db mysql -u root -p

# Access Redis CLI
docker-compose exec redis redis-cli
```

### Logs

```
# View logs for specific service
docker-compose logs -f [service_name]

# View logs for all services
docker-compose logs -f
```

### Service Management

```
# Restart specific service
docker-compose restart [service_name]

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose up -d --build [service_name]
```

## Service Architecture

The application consists of multiple services:

- MySQL Database (port 3306)
- Redis (port 6379)
- Sidekiq for background jobs
- Legacy Rails application (port 3001)
- Next Rails application (port 3002)
- Nginx reverse proxy (port 80)

All services are connected through a bridge network named `app_network`
