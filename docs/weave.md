# Weave 導入メモ

このリポジトリでは、`weave` を使って構文認識ベースのコンフリクト解消を行います。

## 方針

- Git 操作は `docker compose` の `devtools` サービスで実行します。
- ルートの `.gitattributes` で、`weave` を適用するファイル種別を管理します。
- `weave setup` は使いません。merge driver の Git 設定は `devtools` イメージ側で持ち、対象ファイルはリポジトリ側で固定します。

この構成にしている理由は、既存の `api` / `user` / `user_front` / `admin_view` サービスがサブディレクトリのみを bind mount しており、リポジトリルートの `.git` と `.gitattributes` を直接扱う用途に向いていないためです。

## 対象ファイル

ルートの `.gitattributes` で、以下のファイルに `merge=weave` を設定しています。

- Ruby: `*.rb`
- JavaScript / TypeScript: `*.js`, `*.jsx`, `*.mjs`, `*.ts`, `*.tsx`
- Vue / Rails view: `*.vue`, `*.erb`
- 宣言的フォーマット: `*.json`, `*.yml`, `*.yaml`, `*.toml`

`Gemfile`、`Rakefile`、`*.jbuilder`、`Makefile` などの拡張子外ファイルは、現時点では通常の Git マージに任せています。

## セットアップ

初回のみ `devtools` イメージをビルドしてください。

```bash
docker compose build devtools
```

`devtools` イメージには以下を含めています。

- `git`
- `weave`
- `weave-driver`
- `merge.weave.*` の system-level Git 設定

ローカル PC に `weave` を直接インストールする必要はありません。

## 基本操作

作業開始時は `devtools` から `gm3/develop` を最新化し、その後に作業ブランチを切ってください。

```bash
docker compose run --rm devtools git checkout gm3/develop
docker compose run --rm devtools git pull --ff-only origin gm3/develop
docker compose run --rm devtools git checkout -b feat/example
```

通常の Git 操作でも、`.gitattributes` で対象になっているファイルでは自動的に `weave` が使われます。

```bash
docker compose run --rm devtools git merge origin/gm3/develop
docker compose run --rm devtools git rebase origin/gm3/develop
docker compose run --rm devtools git cherry-pick <commit>
```

マージ前に `weave` の判定を確認したい場合は `preview` を使ってください。

```bash
docker compose run --rm devtools weave preview origin/gm3/develop
```

## 運用上の注意

- Git 操作は `devtools` から行ってください。アプリ用コンテナには `weave` を入れていません。
- `devtools` はホストの UID / GID で動かすため、Git 操作でルート所有ファイルを作らない設計にしています。
- `origin` が SSH リモートなので、`devtools` ではホストの `~/.ssh` を read-only で参照します。
- ユーザー名やメールアドレスなどの Git 設定は、ホストの `~/.gitconfig` を `devtools` へ read-only で渡します。

## 参考

- 公式ドキュメント: <https://ataraxy-labs.github.io/weave/docs.html>
- 公式リポジトリ: <https://github.com/Ataraxy-Labs/weave>
