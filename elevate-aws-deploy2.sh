#!/bin/bash
# elevate-ec2-transfer.sh - Transfer and deploy Elevate application to EC2

set -e  # Exit on any error

# Configuration
EC2_USERNAME="ec2-user"
EC2_IP="13.219.99.99"  # Replace with your EC2 instance's public IP
KEY_FILE="elevate-key.pem"  # Path to your key file
LOCAL_APP_DIR="."  # Current directory with all application files

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting transfer of Elevate application to EC2...${NC}"

# Ensure the application directories exist on the EC2 instance
echo -e "${YELLOW}Setting up application directories on EC2...${NC}"
ssh -i $KEY_FILE $EC2_USERNAME@$EC2_IP "mkdir -p ~/elevate/deployment_files ~/elevate/data ~/elevate/backups"

# Create the environment file
echo -e "${YELLOW}Creating configuration files...${NC}"
cat > .env.prod << EOL
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
cat > docker-compose.prod.yml << EOL
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

# Transfer configuration files
echo -e "${YELLOW}Transferring configuration files...${NC}"
scp -i $KEY_FILE .env.prod $EC2_USERNAME@$EC2_IP:~/elevate/deployment_files/.env
scp -i $KEY_FILE docker-compose.prod.yml $EC2_USERNAME@$EC2_IP:~/elevate/deployment_files/docker-compose.prod.yml

# Create a temporary directory for syncing
echo -e "${YELLOW}Creating temporary directory for application files...${NC}"
TEMP_DIR=$(mktemp -d)
mkdir -p $TEMP_DIR/backend $TEMP_DIR/frontend

# Copy the application files to the temporary directory
echo -e "${YELLOW}Preparing application files for transfer...${NC}"
cp -r backend/* $TEMP_DIR/backend/
cp -r frontend/* $TEMP_DIR/frontend/

# Exclude node_modules and other large directories 
echo -e "${YELLOW}Transferring backend files...${NC}"
rsync -av --exclude=node_modules --exclude=__pycache__ --exclude=venv \
  -e "ssh -i $KEY_FILE" $TEMP_DIR/backend/ $EC2_USERNAME@$EC2_IP:~/elevate/backend/

echo -e "${YELLOW}Transferring frontend files...${NC}"
rsync -av --exclude=node_modules --exclude=build \
  -e "ssh -i $KEY_FILE" $TEMP_DIR/frontend/ $EC2_USERNAME@$EC2_IP:~/elevate/frontend/

# Clean up
rm -rf $TEMP_DIR

# Create the deployment script on EC2
echo -e "${YELLOW}Creating deployment script on EC2...${NC}"
cat > deploy.sh << 'EOF'
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
EOF

# Transfer the deployment script
scp -i $KEY_FILE deploy.sh $EC2_USERNAME@$EC2_IP:~/deploy.sh

# Run the deployment
echo -e "${YELLOW}Running deployment on EC2...${NC}"
ssh -i $KEY_FILE $EC2_USERNAME@$EC2_IP "chmod +x ~/deploy.sh && ~/deploy.sh"

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${GREEN}Your application is now running at http://$EC2_IP${NC}"