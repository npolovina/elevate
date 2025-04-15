#!/bin/bash
set -e

# Update system
echo "Updating system packages..."
sudo yum update -y

# Install necessary packages
echo "Installing Docker and Git..."
sudo yum install -y docker git
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create app directory and clean it if it exists
echo "Setting up application directory..."
sudo mkdir -p /home/ec2-user/elevate
sudo rm -rf /home/ec2-user/elevate/*

# Create deployment files directory
sudo mkdir -p /home/ec2-user/elevate/deployment_files

# Create .env file
cat > /home/ec2-user/elevate/deployment_files/.env << EOL
# DeepSeek API Configuration
DEEPSEEK_API_KEY=sk-c03808cf0b4544d7ae15e4bed8d5fddc
DEEPSEEK_API_BASE_URL=https://api.deepseek.com/v1
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_REQUEST_TIMEOUT=30
DEEPSEEK_MAX_RETRIES=3

# API Request Configuration
AI_REQUEST_LOGGING=true
AI_RESPONSE_CACHE_ENABLED=true
AI_RESPONSE_CACHE_TTL=3600

# Application Settings
APP_NAME=Elevate
APP_ENV=production
LOG_LEVEL=INFO

# Database Configuration
DATABASE_URL=sqlite:///./elevate.db

# JWT Secret Key
JWT_SECRET_KEY=$(openssl rand -hex 32)
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOL

# Create docker-compose.prod.yml
cat > /home/ec2-user/elevate/deployment_files/docker-compose.prod.yml << EOL
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: elevate-backend
    env_file:
      - .env
    restart: always
    volumes:
      - ./data:/app/data

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: elevate-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
EOL

# Set ownership
sudo chown -R ec2-user:ec2-user /home/ec2-user/elevate

# Done
echo "Server setup completed!"
