# Stage 1: Install dependencies and build the project
FROM node:18-bookworm-slim AS builder
WORKDIR /app

# Accept API URL as a build-time environment variable
ARG API_URL
ARG APP_API_URL
ARG IMGUR_ID
ARG IMGUR_SECRET

# Set the environment variable
ENV VUE_APP_URL=${API_URL}
ENV VUE_APP_API_URL=${APP_API_URL}
ENV NUXT_IMGUR_CLIENT_ID=${IMGUR_ID}
ENV NUXT_IMGUR_CLIENT_SECRET=${IMGUR_SECRET}

# Install postinstall necessary for Nuxt 3
COPY ./user_front/package*.json ./
RUN npm ci
# Copy the rest of your Vue.js application source code
COPY ./user_front/ ./
# Build the application
RUN npm run build

# Stage 2: Serve the app using a Node.js server
FROM node:18-bookworm-slim AS runner
WORKDIR /app

# Copy the built server and client code
COPY --from=builder /app/.output ./output
# Set environment variables
ENV NODE_ENV production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "output/server/index.mjs"]
