# Build用 コンテナ
FROM node:22-alpine AS builder

# Install corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# build時に必要な環境変数
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_APIKEY
ARG NEXT_PUBLIC_AUTHDOMAIN
ARG NEXT_PUBLIC_PROJECTID
ARG NEXT_PUBLIC_STORAGEBUCKET
ARG NEXT_PUBLIC_MESSAGINGSENDERID
ARG NEXT_PUBLIC_APPID
ARG NEXT_PUBLIC_MEASUREMENTID
ARG NEXT_PUBLIC_API_URL=http://localhost:8000/
ARG NEXT_PUBLIC_MAGAZINE_URL=http://localhost:9004/

ENV NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV} \
    NEXT_PUBLIC_APIKEY=${NEXT_PUBLIC_APIKEY} \
    NEXT_PUBLIC_AUTHDOMAIN=${NEXT_PUBLIC_AUTHDOMAIN} \
    NEXT_PUBLIC_PROJECTID=${NEXT_PUBLIC_PROJECTID} \
    NEXT_PUBLIC_STORAGEBUCKET=${NEXT_PUBLIC_STORAGEBUCKET} \
    NEXT_PUBLIC_MESSAGINGSENDERID=${NEXT_PUBLIC_MESSAGINGSENDERID} \
    NEXT_PUBLIC_APPID=${NEXT_PUBLIC_APPID} \
    NEXT_PUBLIC_MEASUREMENTID=${NEXT_PUBLIC_MEASUREMENTID} \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_MAGAZINE_URL=${NEXT_PUBLIC_MAGAZINE_URL}

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

