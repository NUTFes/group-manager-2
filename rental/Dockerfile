# ベースイメージとして Node.js 22.13.0 を指定
FROM node:22.13.0

# corepack経由でpnpmを有効化
RUN npm install -g corepack@0.34.0 \
  && corepack enable \
  && corepack prepare pnpm@10.7.0 --activate

# 作業ディレクトリを設定
WORKDIR /app
RUN chown node:node /app

# 非rootユーザーで実行する
USER node

# コンテナ起動時に実行するデフォルトコマンド
CMD ["pnpm", "run", "dev"]
