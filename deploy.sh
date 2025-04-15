#!/bin/bash
set -e

# Function to handle errors
error_handler() {
  echo "Error occurred at line $1"
  exit 1
}

# Set up error handling
trap 'error_handler $LINENO' ERR

APP_DIR="/home/ec2-user/elevate"
cd $APP_DIR

# Backup data if exists
if [ -d "./data" ] && [ "$(ls -A ./data 2>/dev/null)" ]; then
  echo "Backing up data..."
  mkdir -p ./backups
  tar -czf ./backups/data-$(date +%Y%m%d-%H%M%S).tar.gz ./data
fi

# Copy deployment files
echo "Copying deployment files..."
cp ./deployment_files/.env ./.env
cp ./deployment_files/docker-compose.prod.yml ./docker-compose.prod.yml

# Build and start containers
echo "Building and starting containers..."
docker-compose -f docker-compose.prod.yml down || true
docker-compose -f docker-compose.prod.yml up -d --build

echo "Deployment completed successfully!"
