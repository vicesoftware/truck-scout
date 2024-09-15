#!/bin/bash

echo "Stopping Docker containers..."
docker-compose down

echo "Removing existing volume..."
docker volume rm ship-wise-tms_postgres_data || true

echo "Deleting contents of pgdata directory..."
sudo rm -rf ./pgdata/*

echo "Rebuilding and starting containers..."
docker-compose up -d --build

echo "Waiting for database to be ready..."
sleep 20

echo "Database reseeded successfully!"