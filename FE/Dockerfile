# Use Node.js 14.20.0 as the base image
FROM node:14.20.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install global dependencies
RUN npm install -g @angular/cli@7.3.6 @angular/compiler-cli@7.2.10 @angular-devkit/build-angular typescript

# Install project dependencies
RUN npm install --legacy-peer-deps

# Install specific version of node-sass
RUN npm uninstall node-sass && npm install node-sass@4.14.1

# Copy the rest of the application
COPY . .

# Expose port 4200
EXPOSE 4200

# Start the application in development mode
CMD ["npm", "start"]
