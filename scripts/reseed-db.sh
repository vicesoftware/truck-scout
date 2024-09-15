#!/bin/bash

echo "Stopping Docker containers..."
docker-compose down -volumes

echo "Deleting contents of pgdata directory..."
sudo rm -rf ./pgdata/*

echo "Rebuilding and starting containers..."
docker-compose up -d --build

echo "Waiting for database to be ready..."
sleep 8

echo "Database reseeded successfully!"