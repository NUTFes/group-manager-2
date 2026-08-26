# AI 支援 Playwright E2E 設計

このディレクトリは、Claude Code などの AI エージェントに Playwright E2E テストの調査、計画、実装、実行結果整理を任せるための作業台です。

参考: https://recruit.group.gmo/engineer/jisedai/blog/claude-code-playwright-e2e-test-automation/

## 目的

- E2E テストの対象、前提データ、認証情報、実行結果を Markdown で明示する
- AI がいきなりテストコードを変更せず、計画レビューを挟んでから実装する
- Playwright MCP で画面を探索し、安定した Playwright テストへ落とし込む
- 本番 URL や本物の個人情報を誤って操作しない運用にする

## ディレクトリ構成

```txt
docs/e2e-ai/
  README.md
  references/
    group-manager-e2e-context.md
  plans/
    template.md
    initial-user-login-smoke.md
  reports/
    template.md
```

`references/` はリポジトリ固有の前提知識です。AI に渡してよい情報だけを書き、秘密値は書きません。

`plans/` は実装前のテスト計画です。目的、対象画面、操作手順、検証観点、触るファイルを明確にして、人間が承認してからコード変更します。

`reports/` は実装後の結果です。実行コマンド、成功/失敗、失敗時の原因、次の改善候補を残します。

## 標準ワークフロー

1. `references/group-manager-e2e-context.md` を読む
2. 追加したい E2E の対象画面とユーザー価値を決める
3. `plans/template.md` をコピーして `plans/YYYYMMDD-<scenario>.md` を作る
4. Playwright MCP でローカル画面を探索し、セレクタと遷移を確認する
5. 計画に「操作手順」「検証観点」「必要なテストデータ」「リスク」を書く
6. 計画レビュー後に `user/e2e/*.spec.ts` を実装する
7. `make test-e2e` または `docker compose run --rm user pnpm run test:e2e` を実行する
8. `reports/template.md` をコピーして結果を記録する

## AI に依頼するときのプロンプト例

```txt
docs/e2e-ai/references/group-manager-e2e-context.md と
docs/e2e-ai/plans/initial-user-login-smoke.md を読んでください。
まだテストコードは変更せず、Playwright MCP でローカル画面を確認して、
計画の不足点と実装方針を docs/e2e-ai/plans/initial-user-login-smoke.md に追記してください。
本番 URL にはアクセスしないでください。
```

実装まで進める場合:

```txt
docs/e2e-ai/plans/initial-user-login-smoke.md の内容に沿って
user/e2e に Playwright テストを実装してください。
認証情報は環境変数名だけを参照し、秘密値はファイルに書かないでください。
実行結果を docs/e2e-ai/reports/YYYYMMDD-user-login-smoke.md に記録してください。
```

## 安全ルール

- 本番 URL には Playwright MCP と E2E テストのどちらからもアクセスしない
- メールアドレス、パスワード、トークンなどの秘密値を Markdown や spec に書かない
- ログインに必要な値は `PLAYWRIGHT_E2E_USER_EMAIL` などの環境変数名だけを書く
- テストが作るデータ名には `e2e-` 接頭辞を付ける
- 後始末できるデータは `test.afterEach` か API 経由で削除する
- 既存データに依存する場合は Seed の出所と ID を plan に明記する

## 実行コマンド

Docker Compose でまとめて確認する場合:

```bash
docker compose up -d api user
make test-e2e
```

`user` コンテナ内で直接実行する場合:

```bash
docker compose run --rm user pnpm run test:e2e
```

Playwright MCP で画面探索する場合は、MCP コンテナからホストの `user` 画面へアクセスするため次の URL を使います。

```txt
http://host.docker.internal:8003
```

詳細は `docs/playwright_mcp_docker.md` を参照してください。
