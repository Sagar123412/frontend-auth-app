# Use an official Node runtime as the base image
FROM node:24-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package management files to leverage Docker caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the default port Vite uses
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]
