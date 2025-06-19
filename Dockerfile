# Use Node.js 20 as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock for dependency installation
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
# COPY . .

# this is for user rights
# Set ownership of the app directory to the node user
RUN chown -R node:node /app

# Switch to the node user
USER node

# Copy the rest of the application code (as node user)
COPY --chown=node:node . .
# this is the end of the user rights

# Ensure the database schema is synchronized before starting the Nuxt app
CMD ["sh", "-c", "yarn db:generate && yarn dev"]