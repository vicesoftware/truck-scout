#!/bin/sh

# Prisma Migration Deployment Script for Digital Ocean

set -e  # Exit immediately if a command exits with a non-zero status

# Environment Configuration
ENVIRONMENT=${ENVIRONMENT:-development}
DATABASE_URL=${DATABASE_URL:-}
PRISMA_SCHEMA_PATH=${PRISMA_SCHEMA_PATH:-/app/prisma/schema.prisma}

# Validate required environment variables
validate_env() {
    if [ -z "$DATABASE_URL" ]; then
        echo "Error: DATABASE_URL is not set"
        exit 1
    fi

    if [ ! -f "$PRISMA_SCHEMA_PATH" ]; then
        echo "Error: Prisma schema not found at $PRISMA_SCHEMA_PATH"
        echo "Current directory: $(pwd)"
        echo "Listing prisma directory:"
        ls -la /app/prisma || true
        exit 1
    fi
}

# Perform database migration
run_migrations() {
    echo "Running migrations for $ENVIRONMENT environment"
    
    # Generate Prisma client to ensure type safety
    npx prisma generate --schema="$PRISMA_SCHEMA_PATH"

    # Deploy migrations to the database
    npx prisma migrate deploy --schema="$PRISMA_SCHEMA_PATH"

    # Optional: Add migration status check
    migration_status=$(npx prisma migrate status --schema="$PRISMA_SCHEMA_PATH")
    echo "Migration Status:"
    echo "$migration_status"
}

# Main deployment workflow
main() {
    echo "Starting Prisma Migration Deployment"
    validate_env
    run_migrations

    if [ $? -eq 0 ]; then
        echo "Migration deployed successfully to $ENVIRONMENT"
        exit 0
    else
        echo "Migration failed"
        exit 1
    fi
}

# Execute main workflow
main
