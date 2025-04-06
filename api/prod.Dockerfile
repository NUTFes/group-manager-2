# syntax=docker/dockerfile:1
ARG RUBY_VERSION=2.7.1

# ランタイム用のベースイメージ
FROM ruby:${RUBY_VERSION}-alpine AS runtime

# 必要なディレクトリ作成とパーミッション設定
RUN mkdir -p /usr/local/bundle/bin && chmod 777 /usr/local/bundle/bin

WORKDIR /api

# ランタイムに必要なパッケージのみインストール（postgresql-dev の代わりに postgresql-libs）
RUN apk add --no-cache \
    curl \
    jemalloc \
    vips \
    postgresql-libs \
    tzdata \
    ttf-ipaexfont \
    bash

# 環境変数の設定
ENV RAILS_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_WITHOUT=development:test \
    BUNDLE_FROZEN=true

# ビルド用ステージ：ランタイムの上にビルド依存パッケージを追加
FROM runtime AS build

RUN apk add --no-cache \
    build-base \
    git \
    pkgconfig \
    postgresql-dev

# Gemfile のコピーと gem インストール
COPY Gemfile Gemfile.lock ./
RUN bundle install --deployment && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# アプリケーションコードのコピーと bootsnap のプリコンパイル
COPY . .
RUN bundle exec bootsnap precompile app/ lib/

# 最終ステージ：ランタイムイメージをベースに、ビルド成果物をコピー
FROM runtime

WORKDIR /api
LABEL org.opencontainers.image.source="https://github.com/NUTFes/group-manager-2"

COPY --from=build ${BUNDLE_PATH} ${BUNDLE_PATH}
COPY --from=build /api /api

RUN chmod +x /api/bin/docker-entrypoint && \
    addgroup -S rails && adduser -S -G rails rails && \
    chown -R rails:rails /api && \
    ln -s ${BUNDLE_PATH}/ruby/2.7.0/bin/rails ${BUNDLE_PATH}/bin/rails

USER 1000:1000

# Puma サーバーの起動
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
