# Build用 コンテナ
FROM node:22-alpine AS builder

# Install corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# build時に必要な環境変数
ARG NODE_ENV=production
ARG APP_ENV=production
ARG NEXT_PUBLIC_IMGUR_CLIENT_ID
ARG IMGUR_CLIENT_SECRET
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

ENV NODE_ENV=${NODE_ENV} \
    APP_ENV=${APP_ENV} \
    NEXT_PUBLIC_IMGUR_CLIENT_ID=${NEXT_PUBLIC_IMGUR_CLIENT_ID} \
    IMGUR_CLIENT_SECRET=${IMGUR_CLIENT_SECRET} \
    NEXTAUTH_URL=${NEXTAUTH_URL} \
    NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Create runner image
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner

WORKDIR /app
LABEL org.opencontainers.image.source="https://github.com/NUTFes/group-manager-2"
ENV NODE_ENV=production

COPY --from=builder --chown=65532:65532 /app/.next/standalone /app/
COPY --from=builder --chown=65532:65532 /app/.next/static /app/.next/static
COPY --from=builder --chown=65532:65532 /app/public /app/public

ARG PORT=3000
ENV HOSTNAME=0.0.0.0
ENV PORT=${PORT}
EXPOSE ${PORT}

ENTRYPOINT [ "/nodejs/bin/node", "server.js" ]
