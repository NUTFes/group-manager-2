# Stage 1: Install dependencies and build the project
FROM node:16-bookworm-slim AS builder
WORKDIR /app

# Accept API URL as a build-time environment variable
ARG API_URL
ARG APP_API_URL

# Set the environment variable
ENV VUE_APP_URL=${API_URL}
ENV VUE_APP_API_URL=${APP_API_URL}

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY ./admin_view/nuxt-project/package*.json ./

# Install dependencies
RUN npm ci

# Copy Nuxt.js application source code
COPY ./admin_view/nuxt-project/ ./

# Build the application
RUN npm run build

# Stage 2: Serve the app using a Node.js server
FROM node:16-bookworm-slim AS runner
WORKDIR /app

# Copy the built server and client code
COPY --from=builder /app/nuxt.config.js ./nuxt.config.js
COPY --from=builder --chown=nonroot:nonroot /app/.nuxt ./.nuxt
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/store ./store
COPY --from=builder /app/static ./static
COPY --from=builder /app/assets ./assets
# Set environment variables
ENV NODE_ENV production

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["node_modules/.bin/nuxt", "start"]
