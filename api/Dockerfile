FROM ruby:2.7.1

# ビルド時の引数としてPLATFORMを定義
ARG PLATFORM

# 環境変数PLATFORMを設定
ENV PLATFORM=${PLATFORM}


# M1 Mac 対策として必要なパッケージのインストール
RUN wget --quiet -O - /tmp/pubkey.gpg https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo 'deb http://dl.yarnpkg.com/debian/ stable main' > /etc/apt/sources.list.d/yarn.list \
      && apt-get update \
      && apt-get install -y nodejs npm yarn \
      && apt-get install -y build-essential libpq-dev libgtk-3.0 libnss3 libatk-bridge2.0-0\
      && mkdir /myapp

# PLATFORMが'arm64-darwin'の場合のみ、特定のコマンドを実行
RUN if [ "$PLATFORM" = "arm64-darwin" ]; then \
      apt-get install -y wget xz-utils fontconfig libxrender1 libxext6 libfreetype6 xfonts-75dpi xfonts-base && \
      wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.stretch_arm64.deb && \
      dpkg -i wkhtmltox_0.12.6-1.stretch_arm64.deb && \
      rm wkhtmltox_0.12.6-1.stretch_arm64.deb; \
    fi

# 日本語フォントのインストール
RUN apt-get install fonts-ipa*

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
