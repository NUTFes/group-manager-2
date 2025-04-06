# ステージ1：依存関係のインストールとプロジェクトのビルド
FROM node:16-bookworm-slim AS builder
WORKDIR /app

# ビルド時の環境変数として API URL を受け取る
ARG API_URL
ARG APP_API_URL

# 環境変数を設定する
ENV VUE_APP_URL=${API_URL} \
    VUE_APP_API_URL=${APP_API_URL}

# package.json と package-lock.json（または npm-shrinkwrap.json）をコピーする
COPY ./admin_view/nuxt-project/package*.json ./

# 依存関係をインストールする
RUN --mount=type=cache,id=npm,target=/root/.npm npm ci

# Nuxt.js アプリケーションのソースコードをコピーする
COPY ./admin_view/nuxt-project/ ./

# アプリケーションをビルドする
RUN npm run build

# ステージ2：Node.js サーバーを使用してアプリを提供する
FROM node:16-bookworm-slim AS runner
WORKDIR /app
LABEL org.opencontainers.image.source="https://github.com/NUTFes/group-manager-2"


# ビルド済みのサーバーとクライアントのコードをコピーする
COPY --from=builder /app/nuxt.config.js ./nuxt.config.js
COPY --from=builder --chown=nonroot:nonroot /app/.nuxt ./.nuxt
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/store ./store
COPY --from=builder /app/static ./static
COPY --from=builder /app/assets ./assets

# 環境変数を設定する
ENV NODE_ENV production

# アプリが動作するポートを公開する
EXPOSE 8000

# アプリケーションを起動する
CMD ["node_modules/.bin/nuxt", "start"]
