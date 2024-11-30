#!/bin/bash

# Exit on any error
set -e

# Bring down existing test database
npm run test:db:down

# Remove any existing volumes to ensure clean slate
docker volume rm truck-scout_postgres_data || true

# Bring up the test database
npm run test:db:up

# Optional: Add a small delay to ensure database is fully initialized
sleep 5

echo "Database reseeded successfully!"
