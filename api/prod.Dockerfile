ARG RUBY_VERSION=3.0.7

# ランタイム用のベースイメージ
FROM ruby:${RUBY_VERSION}-slim-bullseye AS runtime

RUN mkdir -p /usr/local/bundle/bin && chmod 777 /usr/local/bundle/bin
WORKDIR /api

# ランタイムに必要なパッケージのみインストール（postgresql-dev の代わりに postgresql-libs）
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    curl \
    libjemalloc2 \
    libvips42 \
    libpq5 \
    tzdata \
    bash \
    && apt-get install fonts-ipa*

# 環境変数の設定
ENV RAILS_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_WITHOUT=development:test \
    BUNDLE_FROZEN=true

# ビルド用ステージ：ランタイムの上にビルド依存パッケージを追加
FROM runtime AS build

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libgtk-3-dev \
    libnss3 \
    libatk-bridge2.0-dev \
    git \
    pkg-config \
    default-libmysqlclient-dev


# Gemfile のコピーと gem インストール
COPY Gemfile Gemfile.lock ./

RUN bundle install

RUN bundle exec bootsnap precompile --gemfile

# アプリケーションコードのコピーと bootsnap のプリコンパイル
COPY . .
RUN bundle exec bootsnap precompile app/ lib/

# 最終ステージ：ランタイムイメージをベースに、ビルド成果物をコピー
FROM runtime

WORKDIR /api

COPY --from=build ${BUNDLE_PATH} ${BUNDLE_PATH}
COPY --from=build /api /api

COPY entrypoint.sh /usr/bin/

RUN chmod +x /usr/bin/entrypoint.sh \
 && addgroup --system rails \
 && adduser --system --ingroup rails rails \
 && chown -R rails:rails /api \
 && ln -s "${BUNDLE_PATH}/ruby/${RUBY_VERSION}/bin/rails" "${BUNDLE_PATH}/bin/rails"

USER 1000:1000

# Puma サーバーの起動
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
