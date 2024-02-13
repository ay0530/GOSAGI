# Stage 1: Build stage
FROM node:18.19.0-alpine AS build
# Set working directory
WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install --only=production
# Stage 2: Final stage
FROM node:18.19.0-alpine AS final
# Set working directory
WORKDIR /usr/src/app
# Copy dependencies from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
# Copy application code
COPY . .
# Expose port
EXPOSE 3000
# Run the application
CMD ["npm", "start"]