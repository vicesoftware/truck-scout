#!/bin/bash

# Prisma Migration Deployment Script for Digital Ocean

set -e  # Exit immediately if a command exits with a non-zero status

# Environment Configuration
ENVIRONMENT=${ENVIRONMENT:-development}
DATABASE_URL=${DATABASE_URL:-}

# Validate required environment variables
validate_env() {
    if [ -z "$DATABASE_URL" ]; then
        echo "Error: DATABASE_URL is not set"
        exit 1
    fi
}

# Perform database migration
run_migrations() {
    echo "Running migrations for $ENVIRONMENT environment"
    
    # Generate Prisma client to ensure type safety
    npx prisma generate

    # Deploy migrations to the database
    npx prisma migrate deploy

    # Optional: Add migration status check
    migration_status=$(npx prisma migrate status)
    echo "Migration Status:"
    echo "$migration_status"
}

# Rollback mechanism (for emergency scenarios)
rollback_migration() {
    echo "Attempting to rollback last migration"
    # Note: Prisma doesn't support direct rollbacks, 
    # so this is a placeholder for potential future implementation
    echo "Warning: Direct migration rollback not supported by Prisma"
    echo "Manual intervention may be required"
}

# Performance and error logging
log_migration_performance() {
    # Capture migration start and end times
    start_time=$(date +%s)
    run_migrations
    end_time=$(date +%s)

    duration=$((end_time - start_time))
    echo "Migration completed in $duration seconds"
}

# Main deployment workflow
main() {
    echo "Starting Prisma Migration Deployment"
    validate_env
    log_migration_performance

    # Check migration success
    if [ $? -eq 0 ]; then
        echo "Migration deployed successfully to $ENVIRONMENT"
        exit 0
    else
        echo "Migration failed"
        rollback_migration
        exit 1
    fi
}

# Execute main workflow
main
