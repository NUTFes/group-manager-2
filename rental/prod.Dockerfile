# Build用 コンテナ
FROM node:22-alpine AS builder

# Install corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# build時に必要な環境変数
ARG NODE_ENV=production
ARG APP_ENV=production
ARG NEXT_PUBLIC_API_URL
ARG SSR_API_URL

ENV NODE_ENV=${NODE_ENV} \
    APP_ENV=${APP_ENV} \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    SSR_API_URL=${SSR_API_URL}

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

# サーバー実行時に process.env から読む値。builder ステージの ENV は runner に
# 引き継がれないため、ビルド引数を runner でも ENV にしておく（env_file にこれらを
# 持たない環境でも参照できる。実行時に env_file / environment で上書き可能）。
# APP_ENV が未設定だと Access の検証を飛ばしてしまう: docs/rental/design.md 6章。
ARG APP_ENV=production
ARG SSR_API_URL
ENV APP_ENV=${APP_ENV} \
    SSR_API_URL=${SSR_API_URL}

COPY --from=builder --chown=65532:65532 /app/.next/standalone /app/
COPY --from=builder --chown=65532:65532 /app/.next/static /app/.next/static
COPY --from=builder --chown=65532:65532 /app/public /app/public

ARG PORT=3000
ENV HOSTNAME=0.0.0.0
ENV PORT=${PORT}
EXPOSE ${PORT}

ENTRYPOINT [ "/nodejs/bin/node", "server.js" ]
