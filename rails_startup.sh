#!/bin/bash
set -e

# Wait for database to be ready
until nc -z -v -w30 db 3306
do
  echo "Waiting for database connection..."
  # wait for 5 seconds before check again
  sleep 5
done

# Print gem environment for debugging
echo "Gem Environment:"
gem env
echo "Installed Gems:"
gem list

# Run database migrations with explicit bundle exec
RAILS_ENV=development bundle exec rake db:create db:migrate

# Then exec the container's main process (what's set as CMD in the Dockerfile)
exec "$@"
