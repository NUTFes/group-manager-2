# ベースイメージとして Node.js 22.13.0 を指定
FROM node:22.13.0

# 必要なツールをインストール
RUN npm install -g pnpm

# 作業ディレクトリを設定
WORKDIR /app

# コンテナ起動時に実行するデフォルトコマンド
CMD ["pnpm", "run", "dev"]
