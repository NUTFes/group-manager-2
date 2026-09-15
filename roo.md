# roo code 開発ガイドライン
Group Manager は Rails API と Next.js / Nuxt フロントエンドで構成されています。roo code を使用して開発する際は、以下のガイドラインに従ってください。

## プロジェクト構成とモジュール整理
- `api/`: Rails 6.1 バックエンド。本体コードは `app/`、マイグレーションと Seed は `db/`、OpenAPI の元データは `oas_docs/` にあります。
- `user/`: 参加団体向け Next.js 15 クライアント。UI は `src/components`、状態管理は `src/hooks`、API 呼び出しは `src/api` に集約します。
- `user_front/`: 公開用 Nuxt 3 SPA。実行委員向け旧管理画面は `admin_view/nuxt-project` に残っています。
- Docker 関連は `Makefile` と `compose*.yml`、各種 Dockerfile にまとまっています。インフラ設定はここで完結させてください。

## ビルド・テスト・開発コマンド
- `make build-gm3`: 依存関係のインストール、DB 作成、Seed 投入をまとめて実行します。
- `docker compose up api user user_front admin_view`: 主要サービスを起動します。`-d` でデタッチ実行できます。
- `docker compose run --rm api rails test`: Rails のテストを一括実行。`TEST=` で対象ファイルを限定できます。
- `docker compose run --rm user pnpm dev`: Next.js 開発サーバーを起動。コミット前に `pnpm run lint` と `pnpm run type-check` を忘れずに。
- `docker compose run --rm user_front npm run dev` / `docker compose run --rm admin_view npm run dev`: 各 Nuxt アプリのローカルサーバーを起動します。
- `make fmt` または `docker compose run --rm user pnpm run fmt`: Prettier と import 並び替えを適用します。

## コーディングスタイルと命名ルール
- Ruby は 2 スペースインデント、`snake_case` 命名、RESTful コントローラ、変更ごとのマイグレーション作成を徹底します。
- TypeScript / React は `PascalCase` コンポーネント、`camelCase` フックとユーティリティ、スタイルは Tailwind。UI 作成は `make gen-component` でスキャフォールド。
- Vue は `<template>/<script>/<style>` 順、2 スペースインデント。共通処理は各アプリの `utils/` にまとめます。
- ESLint と Prettier の警告は必ず解消し、CI で落ちない状態にしてから PR を作成します。

## roo code 活用時の注意点
- コード生成時は既存のアーキテクチャパターンとコーディング規約に従ってください。
- 生成されたコードは必ずテストを実行し、lint チェックを通してください。
- 複雑な機能は段階的に実装し、各段階でテストを実行してください。
- 既存のコードベースの一貫性を保つため、生成されたコードのスタイルを確認してください。
- パフォーマンスを考慮した効率的なコード生成を心がけてください。

## テスト方針
- バックエンド変更には `api/test` 配下で対応するテストを追加し、正常系・バリデーション・失敗ケースを抑えてください。
- フロント変更は lint / 型チェックを通し、UI 変更があれば `pnpm run storybook` で Storybook を更新・確認します。
- API 仕様を更新した場合は `make openapi` でドキュメントを再生成し、成果物をコミットします。

## コミットとプルリクエスト方針
- Git の履歴に倣い、`fix:` や `feat:` などの短いプレフィックスと簡潔な日本語・英語の要約を組み合わせます。件名は 72 文字以内、必要なら本文で背景を説明します。
- PR では「課題と解決策」「関連 Issue（例: `Close #123`）」「検証結果（テストログ・スクリーンショット）」「データや設定変更時の導入手順」をセットで記載します。
- UI 変更時は before/after のスクリーンショットを添付し、該当面（API / Next.js / Nuxt）のレビュアーをアサインしてください。
