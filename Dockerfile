# Stage 1: Build the Vite app
FROM node:22 AS builder

WORKDIR /app

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy all source code
COPY . .

# Rebuild esbuild after all files are copied
RUN npm rebuild esbuild

# Build the app
RUN npx vite build

# Stage 2: Serve using Node.js and Express
FROM node:22

WORKDIR /app

# Install only prod dependencies (optional, but not needed here)
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm rebuild esbuild

# Copy the built frontend
COPY --from=builder /app/dist ./dist

# Copy the server file to serve static content
COPY server.js .

# Expose app port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
