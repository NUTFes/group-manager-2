FROM ruby:3.3.12

# ビルド時の引数としてPLATFORMを定義
ARG PLATFORM

# 環境変数PLATFORMを設定
ENV PLATFORM=${PLATFORM}


# M1 Mac 対策として必要なパッケージのインストール
RUN apt-get update \
      && apt-get install -y --no-install-recommends \
        nodejs npm build-essential libpq-dev libgtk-3-0 libnss3 \
        libatk-bridge2.0-0 fonts-ipa* \
      && rm -rf /var/lib/apt/lists/* \
      && mkdir /myapp

# GraphViz is required by rails-erd
RUN apt-get update && apt-get install -y graphviz

# PLATFORMが'arm64-darwin'の場合のみ、特定のコマンドを実行
# wkhtmltopdf/packaging 0.12.6-1のarm64版はstretch/buster/bionic/focal/xenial向けのみ配布されており、
# 現行ベースイメージ(Debian trixie)向けビルドは存在しない。配布物の中で最も新しいDebian向けのbuster版を使用する。
RUN if [ "$PLATFORM" = "arm64-darwin" ]; then \
      apt-get install -y --no-install-recommends wget xz-utils fontconfig libxrender1 libxext6 libfreetype6 xfonts-75dpi xfonts-base && \
      rm -rf /var/lib/apt/lists/* && \
      wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_arm64.deb && \
      dpkg -i wkhtmltox_0.12.6-1.buster_arm64.deb && \
      rm wkhtmltox_0.12.6-1.buster_arm64.deb; \
    fi


# ワーキングディレクトリの設定
WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock
RUN mkdir /myapp/tmp
RUN mkdir /myapp/tmp/pids
RUN bundle install
COPY . /myapp

# エントリーポイントスクリプトのコピーと実行権限の付与
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Railsサーバーの起動コマンド
CMD ["rails", "server", "-b", "0.0.0.0"]
