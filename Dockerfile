# Use Node.js 20 as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock for dependency installation
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Ensure the database schema is synchronized before starting the Nuxt app
CMD ["sh", "-c", "yarn db:generate && yarn db:push && yarn dev"]