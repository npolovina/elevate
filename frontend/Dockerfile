# Use official Node.js LTS image
FROM node:18-alpine3.17

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    bash \
    python3 \
    build-base

# Set environment to production by default
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
# Use ci for clean, reproducible builds
RUN npm ci && \
    npm cache clean --force

# Copy the rest of the application
COPY . .

# Set correct permissions
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port for development
EXPOSE 3000

# Default command for development
CMD ["npm", "start"]