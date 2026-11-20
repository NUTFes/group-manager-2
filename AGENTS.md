# Repository Guidelines
Group Manager は Rails API と Next.js / Nuxt フロントエンドで構成されています。以下を守って変更を進めてください。

## プロジェクト構成とモジュール整理
- `api/`: Rails 6.1 バックエンド。本体コードは `app/`、マイグレーションと Seed は `db/`、OpenAPI の元データは `oas_docs/` にあります。
- `user/`: 参加団体向け Next.js 15 クライアント。UI は `src/components`、状態管理は `src/hooks`、API 呼び出しは `src/api` に集約します。
- `user_front/`: 公開用 Nuxt 3 SPA。実行委員向け旧管理画面は `admin_view/nuxt-project` に残っています。
- `rental/`: 物品の貸出・返却記録用 Next.js クライアント(スタッフ向け)。Cloudflare Zero Trust でアクセス制御する前提のため、アプリ側にログイン画面・認証コードは持たせません。
- Docker 関連は `Makefile` と `compose*.yml`、各種 Dockerfile にまとまっています。インフラ設定はここで完結させてください。

## ビルド・テスト・開発コマンド
- `make build-gm3`: 依存関係のインストール、DB 作成、Seed 投入をまとめて実行します。
- `docker compose up api user user_front admin_view`: 主要サービスを起動します。`-d` でデタッチ実行できます。
- `docker compose run --rm api rails test`: Rails のテストを一括実行。`TEST=` で対象ファイルを限定できます。
- `docker compose run --rm user pnpm dev`: Next.js 開発サーバーを起動。コミット前に `pnpm run lint` と `pnpm run type-check` を忘れずに。
- `docker compose run --rm user_front npm run dev` / `docker compose run --rm admin_view npm run dev`: 各 Nuxt アプリのローカルサーバーを起動します。
- `make fmt` または `docker compose run --rm user pnpm run fmt`: Prettier と import 並び替えを適用します。

## Docker 開発環境の扱い
- 開発、テスト、動作確認は、原則としてルートの `compose.yml` と既存コンテナを使います。ホストへ Ruby・Node.js・DB の依存を追加したり、別の開発環境を新設したりしません。
- 最初に `docker compose ps` で状態を確認し、必要なサービスだけを `docker compose up -d <service...>` で起動します。すでに動いているサービスは作り直しません。
- 一回限りのコマンドは `docker compose run --rm <service> ...`、起動済みサービスの状態を使う確認は `docker compose exec -T <service> ...` を使います。
- 依存関係、Dockerfile、DB 初期化に関係しない変更で `make build-gm3` や全サービスの再 build を行いません。必要なら対象サービスだけを build します。
- `docker compose down -v`、volume の削除、DB の作り直し、`docker system prune` は、ユーザーから明示的に依頼されない限り実行しません。既存データを保ったまま検証します。
- `compose.prod.yml` と `compose.stage.yml` は、ユーザーが本番・stage の操作を明示した場合だけ使います。認証情報や不足している環境変数を推測して作りません。
- 動作確認に必要なデータはローカルDBへ作成して構いません。作成・更新したデータ、再現手順、後始末の要否を報告し、既存データの破壊やDB全体の初期化は避けます。
- ローカルの入口は API `http://localhost:3000`、admin `http://localhost:8000`、user_front `http://localhost:8002`、user `http://localhost:8003`、rental `http://localhost:8004` です。
- 起動確認は `docker compose ps` と対象サービスの `docker compose logs --tail=100 <service>` で行います。作業前から動いていたコンテナを停止しません。

## コーディングスタイルと命名ルール
- Ruby は 2 スペースインデント、`snake_case` 命名、RESTful コントローラ、変更ごとのマイグレーション作成を徹底します。
- TypeScript / React は `PascalCase` コンポーネント、`camelCase` フックとユーティリティ、スタイルは Tailwind。UI 作成は `make gen-component` でスキャフォールド。
- Vue は `<template>/<script>/<style>` 順、2 スペースインデント。共通処理は各アプリの `utils/` にまとめます。
- ESLint と Prettier の警告は必ず解消し、CI で落ちない状態にしてから PR を作成します。

## テスト方針
- バックエンド変更には `api/test` 配下で対応するテストを追加し、正常系・バリデーション・失敗ケースを抑えてください。
- フロント変更は lint / 型チェックを通し、UI 変更があれば `pnpm run storybook` で Storybook を更新・確認します。
- API 仕様を更新した場合は `make openapi` でドキュメントを再生成し、成果物をコミットします。

## コミットとプルリクエスト方針
- Git の履歴に倣い、`fix:` や `feat:` などの短いプレフィックスと簡潔な日本語・英語の要約を組み合わせます。件名は 72 文字以内、必要なら本文で背景を説明します。
- PR では「課題と解決策」「関連 Issue（例: `Close #123`）」「検証結果（テストログ・スクリーンショット）」「データや設定変更時の導入手順」をセットで記載します。
- UI 変更時は before/after のスクリーンショットを添付し、該当面（API / Next.js / Nuxt）のレビュアーをアサインしてください。
