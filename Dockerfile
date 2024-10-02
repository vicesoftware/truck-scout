FROM node:18

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create cert directory and copy certificate if it exists
RUN mkdir -p /app/cert
COPY ./cert/ca-certificate.crt /app/cert/ca-certificate.crt || true

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]