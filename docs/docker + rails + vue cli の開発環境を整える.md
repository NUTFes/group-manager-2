# docker + rails + vue cli の開発環境を整える

## まずは，ディレクトリの作成

`mkdir MyApp-rails-vue`

`cd MyApp-rails-vue`



## apiの部分であるバックエンド(rails)を作る

### 行うこと

- api用のディレクトリ作成

- Dockerfileの作成
- docker-composeを用いて，railsアプリの作る(dbをmysqlにする)
- dockerのコンテナ内でrailsが動くようにする



### api用のディレクトリ作成

`mkdir api`

`cd api` 



### Dockerfileの作成

```dockerfile
FROM ruby:2.5.3

# 必要なパッケージのインストール（基本的に必要になってくるものだと思うので削らないこと）
RUN apt-get update -qq && \
    apt-get install -y build-essential \ 
                       libpq-dev \        
                       nodejs           

# 作業ディレクトリの作成、設定
RUN mkdir /app_name 
##作業ディレクトリ名をAPP_ROOTに割り当てて、以下$APP_ROOTで参照
ENV APP_ROOT /app_name 
WORKDIR $APP_ROOT

# ホスト側（ローカル）のGemfileを追加する（ローカルのGemfileは【３】で作成）
ADD ./Gemfile $APP_ROOT/Gemfile
ADD ./Gemfile.lock $APP_ROOT/Gemfile.lock

# Gemfileのbundle install
RUN bundle install
ADD . $APP_ROOT
```



### 空のGemfile & Gemfile.lock作成

```Gemfile
source 'https://rubygems.org'
gem 'rails', '5.2.4'
```

` touch Gemfile.lock`



### docker-compose.ymlの作成

```yaml
version: '3'
services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: root
    ports:
      - "3306:3306"

  api:
    build: ./api
    command: rails s -p 3000 -b '0.0.0.0'
    volumes:
      - ./api:/app_name
    ports:
      - "3000:3000"
    links:
      - db
```



### rails newをdockerで実行

`docker-compose run api rails new . --force --database=mysql --skip-bundle`



### api/config/database.ymlを編集

```yaml
default: &default
  adapter: mysql2
  encoding: utf8
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: root
  password: password # docker-compose.ymlのMYSQL_ROOT_PASSWORD
  host: db # docker-compose.ymlのservice名
```



### Docker起動

` docker-compose build`

`docker-compose up`



### データベース作成

`docker-compose run api rails db:create`



### 確認

`localhost:3000`にアクセス．無事に立ち上がっていることが確認できた．



## フロントエンドをvue cliで作る

### 行うこと

- front用のディレクトリ作成

- Dockerfileの作成
- docker-composeを用いて，vue cliアプリを作る
- dockerのコンテナ内でvueが動くようにする



### front用のディレクトリ作成

`mkdir front`

`cd front`



### Dockerfileの作成

```dockerfile
FROM node:12.4.0-alpine

WORKDIR /app

RUN apk update && \
    npm install -g npm && \
    npm install -g @vue/cli

CMD ["/bin/ash"]
```



### docker-compose.ymlの編集

```yaml
version: '3'
services:
	:
  front:
    build: ./front
    ports:
      - 1234:8080
    volumes:
      - ./front:/app
    stdin_open: true
    tty: true
```

をすでにある`docker-compose.yml`に追加



### Dockerの起動

`docker-compose build`

`docker-compose up`



### Vue projectを作るためにコンテナに入る

`docker-compose exec front /bin/ash`



### コンテナ内での操作

`vue create vue-project`

`y ` → `default` → `npm`を選択

`cd vue-project`

`npm run serve`

立ち上がらなかった．．



### 追記

webpackを使いたいため，`@vue/cli-init@3.0.1`というパッケージがいるみたいなので，Dockerfileに書いてインストールする．

```dockerfile
FROM node:12.4.0-alpine

WORKDIR /app

RUN apk update && \
    npm install -g npm && \
    npm install -g @vue/cli && \
    npm install -g @vue/cli-init@3.0.1

CMD ["/bin/ash"]
```

そのあと，dockerを立ち上げてコンテナの中に入る

`docker-compose build`

`docker-compose up`

`docker-compose exec front /bin/ash`

dockerのコンテナ内で以下のコマンドでVueアプリ生成

`vue init webpack vue-project`

### Dockerfileとdocker-compose.ymlを編集

```dockerfile
FROM node:8.15.0-alpine

WORKDIR /app/vue-project

RUN apk update && \
    npm install -g npm && \
    npm install -g @vue/cli

CMD ["/bin/ash"]
```

仮説：`vue-project`という名前のvueアプリができたのではないか？そのため，それを`WORKDIR`に追加すれば，docker-composeするときに参照するはず．

```yaml
services:
	:
  front:
    build: ./front
    command: npm run serve
    ports:
      - 8080:8080
    volumes:
      - ./front:/app
    stdin_open: true
    tty: true
```

`command`に`npm run serve`を追加して，`docker-compose up`をしたときに呼び出せるようにする．



### 追記

webpackを用いたあとは，`npm run serve` ではなく`npm run dev`を使う(`npm start`でもいいっぽい)

ということで，Dockerfileを訂正

```yaml
services:
	:
  front:
    build: ./front
    command: npm run dev
    ports:
      - 8080:8080
    volumes:
      - ./front:/app
    stdin_open: true
    tty: true
```



### 立ち上がっているか確認

`localhost:3000` (rails)

`localhost:8080` (vue cli)

両方並立して立ち上がっている (うれしい)



## 最終的な`docker-compose.yml`

```yaml
version: '3'
services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: root
    ports:
      - "3306:3306"

  api:
    build: ./api
    command: rails s -p 3000 -b '0.0.0.0'
    volumes:
      - ./api:/app_name
    ports:
      - "3000:3000"
    links:
      - db
   
   front:
    build: ./front
    command: npm run serve
    ports:
      - 8080:8080
    volumes:
      - ./front:/app
    stdin_open: true
    tty: true
```



## 追記

railsで飛ばした」APIはHTTPに送られるので，Vue側はそのポートを参照しなければいけないため，80番からＡPIをとってくる．

```yaml
version: '3'
services:
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: root
    ports:
      - "3306:3306"

  api:
    build: ./api
    command: rails s -p 3000 -b '0.0.0.0'
    volumes:
      - ./api:/app_name
    ports:
      - "80:3000"
    links:
      - db
   
   front:
    build: ./front
    command: npm run serve
    ports:
      - 8080:8080
    volumes:
      - ./front:/app
    stdin_open: true
    tty: true
```
