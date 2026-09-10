# ベースイメージとして Node.js 22.13.0 を指定
FROM node:22.13.0

# corepack経由でpnpmを有効化（全ユーザーが読めるディレクトリにキャッシュさせる）
ENV COREPACK_HOME=/usr/local/corepack
RUN npm install -g corepack@0.34.0 \
  && corepack enable \
  && corepack prepare pnpm@10.7.0 --activate \
  && chmod -R a+rX /usr/local/corepack

# 作業ディレクトリを設定
WORKDIR /app
# node_modules・.next・.pnpm-store は named volume として上書きされるため、先に node ユーザー所有で作成しておく
RUN mkdir -p /app/node_modules /app/.next /app/.pnpm-store \
  && chown -R node:node /app

# ホスト側チェックアウトの所有者に関わらず node ユーザーで実行できるようにする
# （entrypoint内でrootとして/appの所有権を修正した後、nodeユーザーへ切り替える）
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

# コンテナ起動時に実行するデフォルトコマンド
CMD ["pnpm", "run", "dev"]
