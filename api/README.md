# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

## OpenAPI Generator (スキーマファースト開発)

OpenAPI Specification (OAS) からAPIの雛形を生成するRakeタスクを利用できます。

### 使い方

```bash
# Docker Compose環境で実行する場合
docker-compose exec api bundle exec rake api:generate_stubs

# または、ホストから直接実行する場合
cd api
bundle exec rake api:generate_stubs
```

### 生成される内容

- **入力ファイル**: `doc/openapi.yaml`
- **出力先**: `tmp/api_stub/`
- **生成物**: 
  - コントローラー (`app/controllers/`)
  - ルーティング (`config/routes.rb`)
  - モデル (`app/models/`)
  - その他Rails関連ファイル

### 生成後の手順

1. `tmp/api_stub/` 配下の生成されたファイルを確認
2. 必要なコントローラーやルーティングを既存の `app/` ディレクトリにコピー
3. 実装をカスタマイズ

### 注意事項

- 出力先は `tmp/api_stub/` で、既存のファイルを上書きしません
- Docker環境が必要です
- OpenAPI定義ファイルは `doc/openapi.yaml` に配置してください

...
