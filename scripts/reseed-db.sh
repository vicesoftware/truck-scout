#!/bin/bash

set -e

# Ensure we're in the project root
cd "$(dirname "$0")/.."

echo "Resetting database using Prisma..."
npm run prisma:db:reset

echo "Seeding development database..."
npm run prisma:seed:dev

echo "Database reseeded successfully!"
