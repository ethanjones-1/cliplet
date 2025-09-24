# Use Node.js LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy client package files
COPY client/package*.json ./client/

# Install frontend dependencies and build
COPY client/ ./client/
WORKDIR /app/client
RUN npm ci --only=production && npm run build

# Go back to app root
WORKDIR /app

# Copy server files
COPY server/ ./server/
COPY .env.example .env

# Create uploads directory
RUN mkdir -p server/uploads

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "server/index.js"]