# Playwright MCP を Docker で使う

Playwright MCP はローカルに Chrome を入れず、Docker コンテナ上の MCP サーバーとして起動します。
WSL / macOS どちらでも Chrome のローカルパス分岐を避けるため、このリポジトリでは `.mcp.json` に Docker 版 Playwright MCP の設定を置いています。

## 前提

- Docker が起動している
- MCP クライアントがリポジトリルートの `.mcp.json` を読み込める
- 確認対象のサービスをホスト側の公開ポートで起動している

```bash
docker compose up -d api user
```

## MCP からアクセスする URL

MCP は Docker コンテナ内で動くため、コンテナ内の `localhost` はホストではなく MCP コンテナ自身を指します。
ホスト側で公開されている各サービスへアクセスする場合は、次の URL を使います。

```txt
API:        http://host.docker.internal:3000
admin:      http://host.docker.internal:8000
user_front: http://host.docker.internal:8002
user:       http://host.docker.internal:8003
rental:     http://host.docker.internal:8004
```

`--add-host=host.docker.internal:host-gateway` を `.mcp.json` に含めているため、Docker Desktop ではない Linux / WSL 環境でも解決しやすくしています。

## 設定

`.mcp.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "--add-host=host.docker.internal:host-gateway",
        "mcp/playwright",
        "--headless"
      ]
    }
  }
}
```

## E2E テストとの違い

`pnpm run test:e2e` は `user` コンテナ内で Playwright のテストを実行します。
Playwright MCP は、AI エージェントがブラウザを操作するための MCP サーバーです。

通常の CI / 動作確認は E2E テストを使い、AI に画面操作させたい場合だけ Playwright MCP を使います。

## 動作確認

Docker イメージが取得でき、MCP サーバーのオプションが確認できれば Docker 版 Playwright MCP の起動準備はできています。

```bash
docker run --rm mcp/playwright --help
```
