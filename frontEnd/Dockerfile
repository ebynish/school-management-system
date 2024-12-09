# Use the official Node.js image as the base image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Set environment variable for the port
ENV PORT=${PORT:-3000}

# Expose the application port
EXPOSE ${PORT}

# Start the React application on the specified port
CMD ["npx", "serve", "-s", "build", "-l", "${PORT}"]
