# Group Manager E2E 参照情報

AI 支援 E2E の前提情報です。秘密値はこのファイルに書かず、環境変数名だけを記載します。

## 対象アプリ

- `api/`: Rails 6.1 API
- `user/`: 参加団体向け Next.js 15 クライアント
- `user_front/`: 公開用 Nuxt 3 SPA
- `admin_view/nuxt-project`: 旧管理画面

当面の E2E 対象は `user/` です。Playwright の設定とテストは `user/playwright.config.ts` と `user/e2e/` にあります。

## ローカル URL

Docker Compose 起動時:

- API: `http://localhost:3000`
- user: `http://localhost:8003`
- user_front: `http://localhost:8002`
- admin_view: `http://localhost:8000`

Playwright MCP は Docker コンテナ内で動くため、`user` 画面は次の URL で開きます。

```txt
http://host.docker.internal:8003
```

## 起動と実行

主要サービス起動:

```bash
docker compose up -d api user
```

E2E 一括実行:

```bash
make test-e2e
```

`user` コンテナ内での Playwright 実行:

```bash
docker compose run --rm user pnpm run test:e2e
```

`user/playwright.config.ts` は `PLAYWRIGHT_BASE_URL` が未指定なら `http://127.0.0.1:${PLAYWRIGHT_PORT}` を使い、webServer で Next.js dev server を起動します。

既存の API ベース URL:

```txt
PLAYWRIGHT_API_BASE_URL=http://api:3000
```

## 認証情報の扱い

ログイン E2E で使う想定の環境変数名:

```txt
PLAYWRIGHT_E2E_USER_EMAIL
PLAYWRIGHT_E2E_USER_PASSWORD
```

値は `.env.local` や Markdown に書きません。CI に載せる場合は GitHub Actions Secrets などの秘密情報ストアで管理します。

## テストデータ方針

- 可能なら API 経由で前提データを作成する
- データ名には `e2e-` 接頭辞を付ける
- テスト後に削除できるものは `test.afterEach` で削除する
- Seed データを使う場合は、plan に Seed ファイル、ID、変更リスクを書く

既存の E2E は `user/e2e/cooking-process-order.spec.ts` です。API 経由で食品と調理工程を作成し、`afterEach` で削除する実装例として参照します。

## セレクタ方針

優先順:

1. ユーザーが認識できる role/name
2. ラベル、placeholder、表示テキスト
3. 安定した `data-testid`
4. CSS セレクタ

`data-testid` を追加する場合は、UI 実装に自然に閉じる最小範囲にします。

## 禁止事項

- 本番ドメインへアクセスしない
- 本物の団体や個人情報を作成、編集、削除しない
- 秘密値を Markdown、spec、スクリーンショット名、ログに出さない
- flaky な `waitForTimeout` を基本手段にしない
- 画面探索の結果だけで spec を確定せず、計画 Markdown に検証観点を書く
