# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy full project
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "app.js"]