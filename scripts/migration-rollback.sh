#!/bin/bash

set -e

# Check if Prisma is installed
if ! command -v npx &> /dev/null
then
    echo "Error: npx could not be found. Please ensure Node.js is installed."
    exit 1
fi

# Function to list recent migrations
list_migrations() {
    echo "Recent Migrations:"
    npx prisma migrate status
}

# Function to provide rollback guidance
rollback_guidance() {
    echo ""
    echo "Prisma Migration Rollback Guidance:"
    echo "-----------------------------------"
    echo "1. Prisma does not support automatic migration rollbacks."
    echo "2. To revert changes, you have several options:"
    echo ""
    echo "   a) Manual Reversion:"
    echo "      - Modify your Prisma schema to the previous state"
    echo "      - Create a new migration that undoes the changes"
    echo "      - Run 'npx prisma migrate dev --name revert_previous_changes'"
    echo ""
    echo "   b) Reset Development Database:"
    echo "      - Use 'npx prisma migrate reset' (DEVELOPMENT ONLY)"
    echo "      - This will delete all data and re-apply migrations"
    echo ""
    echo "   c) Restore from Backup:"
    echo "      - If you have a database backup, restore it"
    echo "      - Reapply migrations from that point"
    echo ""
    echo "CAUTION: Always backup your database before making significant changes!"
}

# Main script
main() {
    echo "Prisma Migration Rollback Helper"
    echo "================================"
    
    list_migrations
    rollback_guidance
}

main
