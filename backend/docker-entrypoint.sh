#!/bin/sh
set -e

echo "Running database migration..."
npm run db:migrate

echo "Starting server..."
exec "$@"

