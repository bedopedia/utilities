# Application Setup Guide

## Prerequisites

1. Initialize git submodules:
  ```bash
  git submodule update --init --recursive
  ```

2. Download database dump file (`mydump.sql`) and place it in the repository root directory.

3. Create configuration files:
   - Create a `.env` file in the `utilities/` directory with the following content:
     ```
     # Database Configuration
     DB_USERNAME=skolera
     DB_PASSWORD=skolera
     DB_NAME=skolera

     # Redis Configuration
     REDIS_HOST=redis
     REDIS_PASSWORD=skolera

     # Sidekiq Configuration
     SIDEKIQ_WEB_PASSWORD=skolera

     # Application Specific
     AFS_BASE_URL=
     ENCRYPTION_KEY=skolera
     ```
   - Create `utilities/legacy_app/config/database.yml` with the following content:
     ```yaml
     default: &default
       adapter: mysql2
       encoding: utf8
       pool: 5
       username: <%= ENV['DB_USERNAME'] || 'root' %>
       password: <%= ENV['DB_PASSWORD'] %>
       host: <%= ENV['DB_HOST'] || 'db' %>
       port: <%= ENV['DB_PORT'] || 3306 %>
       socket: <%= ENV['DB_SOCKET'] %>

     development:
       <<: *default
       database: <%= ENV['DB_NAME'] %>

     test:
       <<: *default
       database: <%= ENV['DB_NAME'] %>_test

     staging:
       <<: *default
       database: <%= ENV['DB_NAME'] %>

     production:
       <<: *default
       database: <%= ENV['DB_NAME'] %>
       pool: <%= ENV['DB_POOL'] || 5 %>
     ```
   - Download the SQL dump (eis 20-04-2024) and place it at `utilities/mydump.sql`

4. Modify configuration files:
   - Edit `utilities/legacy_app/config/initializers/airbrake.rb` and wrap the Airbrake.configure block with:
     ```ruby
     if ENV['AIRBRAKE_PROJECT_ID'].present? && ENV['AIRBRAKE_PROJECT_KEY'].present?
       Airbrake.configure do |config|
         # existing configuration
       end
     end
     ```
   - Update `utilities/legacy_app/config/redis.yml` to use environment variables:
     ```yaml
     host: <%= ENV['REDIS_HOST'] %>
     password: <%= ENV['REDIS_PASSWORD'] %>
     ```

## Running the Application
### Full Stack Setup
Launch all services:
```bash
docker-compose up
```

To run in daemon mode (background):
```bash
docker-compose up -d
```
### Individual Services
Run specific services with their dependencies:
```bash
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
```bash
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
```bash
# View logs for specific service
docker-compose logs -f [service_name]
# View logs for all services
docker-compose logs -f
```
### Service Management
```bash
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

All services are connected through a bridge network named `app_network`.