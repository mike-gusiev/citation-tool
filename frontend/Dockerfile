# Use Node.js for the build stage
FROM node:16 AS build

# Set working directory
WORKDIR /frontend

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the built files
FROM nginx:alpine
COPY --from=build /frontend/build /usr/share/nginx/html

# Expose port 80 to access the app in the container
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]