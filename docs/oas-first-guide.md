## OAS設計ファースト運用ガイド

このドキュメントは、 を唯一の真実源として、Rails と Web（user）を自動生成・実行時検証で同期させる手順をまとめたものです。

### 1. ディレクトリと編集境界
- OAS: （OpenAPI 3.1）
- Lint（将来用）: （現状は空枠）
- Rails 実装（手書き）:  ほか
- Rails 生成（編集禁止）: 
- Web 生成（編集禁止）: 

### 2. 命名・運用ルール
- operationId:  例) 
- レスポンス: 、エラー: 
- 生成ゾーンの編集禁止。必要時は1行ラッパーのみ（将来削除前提）

### 3. 主要コマンド
- Rails スタブ生成（Dockerで実行）
  docker run --rm -v $(PWD):/local openapitools/openapi-generator-cli:v7.10.0 generate 	  -g ruby-on-rails 	  -i /local/openapi/openapi.yaml 	  -o /local/api/generated/server 	  --skip-validate-spec
- Web 型/クライアント生成（Orval）
  docker compose run --rm user pnpm api:generate
- 両方まとめて
  docker run --rm -v $(PWD):/local openapitools/openapi-generator-cli:v7.10.0 generate 	  -g ruby-on-rails 	  -i /local/openapi/openapi.yaml 	  -o /local/api/generated/server 	  --skip-validate-spec
- Lint（プレースホルダ）
  TODO: spectral rules are not configured yet - openapi/.spectral.yaml

### 4. 初期設定・前提
- , Usage:  docker compose [OPTIONS] COMMAND

Define and run multi-container applications with Docker

Options:
      --all-resources              Include all resources, even those not
                                   used by services
      --ansi string                Control when to print ANSI control
                                   characters ("never"|"always"|"auto")
                                   (default "auto")
      --compatibility              Run compose in backward compatibility mode
      --dry-run                    Execute command in dry run mode
      --env-file stringArray       Specify an alternate environment file
  -f, --file stringArray           Compose configuration files
      --parallel int               Control max parallelism, -1 for
                                   unlimited (default -1)
      --profile stringArray        Specify a profile to enable
      --progress string            Set type of progress output (auto,
                                   tty, plain, json, quiet)
      --project-directory string   Specify an alternate working directory
                                   (default: the path of the, first
                                   specified, Compose file)
  -p, --project-name string        Project name

Management Commands:
  bridge      Convert compose files into another model

Commands:
  attach      Attach local standard input, output, and error streams to a service's running container
  build       Build or rebuild services
  commit      Create a new image from a service container's changes
  config      Parse, resolve and render compose file in canonical format
  cp          Copy files/folders between a service container and the local filesystem
  create      Creates containers for a service
  down        Stop and remove containers, networks
  events      Receive real time events from containers
  exec        Execute a command in a running container
  export      Export a service container's filesystem as a tar archive
  images      List images used by the created containers
  kill        Force stop service containers
  logs        View output from containers
  ls          List running compose projects
  pause       Pause services
  port        Print the public port for a port binding
  ps          List containers
  publish     Publish compose application
  pull        Pull service images
  push        Push service images
  restart     Restart service containers
  rm          Removes stopped service containers
  run         Run a one-off command on a service
  scale       Scale services 
  start       Start services
  stats       Display a live stream of container(s) resource usage statistics
  stop        Stop services
  top         Display the running processes
  unpause     Unpause services
  up          Create and start containers
  version     Show the Docker Compose version information
  volumes     List volumes
  wait        Block until containers of all (or specified) services stop.
  watch       Watch build context for service and rebuild/refresh containers when files are updated

Run 'docker compose COMMAND --help' for more information on a command. が使えること
- Web 側  に  と  があること
- Rails 側に  が導入済み（, ）
- 環境変数:  に  を設定

### 5. 人間の作業フロー
1) OAS を編集（）
2) 生成を実行（docker run --rm -v $(PWD):/local openapitools/openapi-generator-cli:v7.10.0 generate 	  -g ruby-on-rails 	  -i /local/openapi/openapi.yaml 	  -o /local/api/generated/server 	  --skip-validate-spec）
3) Rails を起動し、未定義/不正入力が 4xx で弾かれることを確認
4) Web から生成クライアントで API を疎通確認
5) 仕様ズレが出たら OAS を直して再生成

### 6. トラブルシュート
- 生成に失敗する: OAS の 3.1 と  の整合性、 命名を確認
- Rails 起動時にルーティング不一致:  →  の解決規約を見直す
- Web でビルド失敗:  の input/output パス、 を確認

### 7. 将来の拡張（本番適用前に検討）
- Spectral ルール記述（）
- CI で  変更をトリガに docker run --rm -v $(PWD):/local openapitools/openapi-generator-cli:v7.10.0 generate 	  -g ruby-on-rails 	  -i /local/openapi/openapi.yaml 	  -o /local/api/generated/server 	  --skip-validate-spec を実行
- 契約テスト候補: Dredd / Schemathesis

### 付録: 重要ファイル一覧
- : 真実源
- : 実行時検証（Router/RequestValidation）
- Download 7.14.0 ...
Downloaded 7.14.0
Did set selected version to 7.14.0: Rails スタブ再生成スクリプト
- : Web 生成設定
- : , , , 
