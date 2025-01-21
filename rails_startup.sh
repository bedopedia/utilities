#!/bin/bash
set -e

# Wait for database to be ready
until nc -z -v -w30 db 3306
do
  echo "Waiting for database connection..."
  # wait for 5 seconds before check again
  sleep 5
done

# Run database migrations
bundle exec rake db:create db:migrate

# Then exec the container's main process (what's set as CMD in the Dockerfile)
exec "$@"
