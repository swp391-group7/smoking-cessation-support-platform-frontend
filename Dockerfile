# Stage 1: Build the Vite app
FROM node:22 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve using Node.js and Express
FROM node:22

WORKDIR /app

# Install only prod dependencies (optional, but not needed here)
COPY package*.json ./
RUN npm install

# Copy the built frontend
COPY --from=builder /app/dist ./dist

# Copy the server file to serve static content
COPY server.js .

# Expose app port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
