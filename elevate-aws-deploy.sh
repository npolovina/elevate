#!/bin/bash
# elevate-aws-deploy.sh - Deploy Elevate Career Coach to AWS EC2

set -e  # Exit on any error

# AWS Configuration
AWS_REGION="us-east-1"
INSTANCE_TYPE="t2.micro"
KEY_NAME="elevate-key"
SECURITY_GROUP_NAME="elevate-sg"
APP_NAME="elevate"
DOMAIN_NAME="" # Optional: Set your domain name here

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment of Elevate Career Coach to AWS EC2...${NC}"

# Create security group
echo -e "${YELLOW}Creating security group...${NC}"
SG_ID=$(aws ec2 create-security-group \
  --group-name $SECURITY_GROUP_NAME \
  --description "Security group for Elevate Career Coach" \
  --region $AWS_REGION \
  --output text --query 'GroupId' 2>/dev/null || \
  aws ec2 describe-security-groups \
  --group-names $SECURITY_GROUP_NAME \
  --region $AWS_REGION \
  --output text --query 'SecurityGroups[0].GroupId')

echo "Security Group ID: $SG_ID"

# Configure security group rules
echo -e "${YELLOW}Configuring security group rules...${NC}"
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION 2>/dev/null || true

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION 2>/dev/null || true

aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION 2>/dev/null || true

# Create key pair if it doesn't exist
echo -e "${YELLOW}Setting up key pair...${NC}"
aws ec2 describe-key-pairs --key-name $KEY_NAME --region $AWS_REGION 2>/dev/null || \
aws ec2 create-key-pair \
  --key-name $KEY_NAME \
  --query 'KeyMaterial' \
  --output text \
  --region $AWS_REGION > ${KEY_NAME}.pem

# Set correct permissions for key file
if [ -f "${KEY_NAME}.pem" ]; then
  chmod 400 ${KEY_NAME}.pem
  echo "Key pair saved to ${KEY_NAME}.pem"
fi

# Launch EC2 instance
echo -e "${YELLOW}Launching EC2 instance...${NC}"
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ami-0c101f26f147fa7fd \
  --instance-type $INSTANCE_TYPE \
  --key-name $KEY_NAME \
  --security-group-ids $SG_ID \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$APP_NAME}]" \
  --region $AWS_REGION \
  --output text \
  --query 'Instances[0].InstanceId')

echo "Instance ID: $INSTANCE_ID"

# Wait for instance to be running
echo -e "${YELLOW}Waiting for instance to start...${NC}"
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $AWS_REGION

# Get instance public IP
PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --region $AWS_REGION \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text)

echo "Instance running at IP: $PUBLIC_IP"

# Wait for SSH to be available
echo -e "${YELLOW}Waiting for SSH to be available...${NC}"
while ! nc -z $PUBLIC_IP 22; do
  sleep 5
done

# Allow some more time for SSH to fully initialize
sleep 10

# Create user data script
cat > setup.sh << 'EOF'
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
EOF

# Copy setup script to instance
echo -e "${YELLOW}Copying setup script to instance...${NC}"
scp -o StrictHostKeyChecking=no -i ${KEY_NAME}.pem setup.sh ec2-user@$PUBLIC_IP:/home/ec2-user/

# Execute setup script
echo -e "${YELLOW}Executing setup script...${NC}"
ssh -o StrictHostKeyChecking=no -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP "chmod +x /home/ec2-user/setup.sh && /home/ec2-user/setup.sh"

# Create deploy script on the EC2 instance
echo -e "${YELLOW}Creating deploy script on EC2...${NC}"
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
if [ -d "./data" ]; then
  echo "Backing up data..."
  mkdir -p ./backups
  tar -czf ./backups/data-$(date +%Y%m%d-%H%M%S).tar.gz ./data
fi

# Clone the repository
echo "Cloning/updating repository..."
if [ ! -d "./backend" ] || [ ! -d "./frontend" ]; then
  # Empty the directory first but keep deployment files
  find . -maxdepth 1 -not -name . -not -name deployment_files -not -name backups -not -name data -exec rm -rf {} \;
  
  # Clone the repository in a temp directory
  TMP_DIR=$(mktemp -d)
  git clone https://github.com/your-username/elevate.git $TMP_DIR
  
  # Move files to app directory, excluding .git
  find $TMP_DIR -maxdepth 1 -not -name .git -not -name . -exec mv {} $APP_DIR \;
  
  # Clean up
  rm -rf $TMP_DIR
else
  # If repository exists, just pull the latest
  if [ -d ".git" ]; then
    git pull
  else
    echo "Warning: Repository exists but .git directory is missing. Consider a fresh clone."
  fi
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

# Copy deploy script to instance
echo -e "${YELLOW}Copying deploy script to instance...${NC}"
scp -o StrictHostKeyChecking=no -i ${KEY_NAME}.pem deploy.sh ec2-user@$PUBLIC_IP:/home/ec2-user/

# Execute deploy script
echo -e "${YELLOW}Executing initial deployment...${NC}"
ssh -o StrictHostKeyChecking=no -i ${KEY_NAME}.pem ec2-user@$PUBLIC_IP "chmod +x /home/ec2-user/deploy.sh && /home/ec2-user/deploy.sh"

echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${GREEN}Application is running at http://$PUBLIC_IP${NC}"

# Setup GitHub Actions workflow file
mkdir -p .github/workflows
cat > .github/workflows/deploy-to-ec2.yml << EOF
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
      
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: $AWS_REGION
    
    - name: Deploy to EC2
      uses: appleboy/ssh-action@master
      with:
        host: $PUBLIC_IP
        username: ec2-user
        key: \${{ secrets.EC2_PRIVATE_KEY }}
        script: |
          chmod +x /home/ec2-user/deploy.sh
          /home/ec2-user/deploy.sh
EOF

echo -e "${GREEN}GitHub Actions workflow created at .github/workflows/deploy-to-ec2.yml${NC}"
echo -e "${YELLOW}You need to add the following secrets to your GitHub repository:${NC}"
echo "- AWS_ACCESS_KEY_ID"
echo "- AWS_SECRET_ACCESS_KEY"
echo "- EC2_PRIVATE_KEY (contents of ${KEY_NAME}.pem)"

echo -e "${GREEN}All done! Your Elevate application is deployed to AWS EC2.${NC}"