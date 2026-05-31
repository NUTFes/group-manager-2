# ベースイメージとして Node.js 20.11.0 を指定
FROM node:22.13.0

# 必要なツールと Playwright Chromium の実行ライブラリをインストール
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm

# 作業ディレクトリを設定
WORKDIR /app

# コンテナ起動時に実行するデフォルトコマンド
CMD ["pnpm", "run", "dev"]
