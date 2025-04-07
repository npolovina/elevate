# Build stage
FROM node:16-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Set the API URL for production
ENV REACT_APP_API_URL=/api

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]