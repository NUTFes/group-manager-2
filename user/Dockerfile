# ベースイメージとして Node.js 24.22.2 を指定（Playwright 用の apt パッケージ名が変わらないよう bookworm 版）
FROM node:24.22.2-bookworm

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
  && npm install -g corepack@0.34.0 \
  && corepack enable \
  && corepack prepare pnpm@10.7.0 --activate

# 作業ディレクトリを設定
WORKDIR /app

# コンテナ起動時に実行するデフォルトコマンド
CMD ["pnpm", "run", "dev"]
