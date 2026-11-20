# Claude Code Guidelines

`AGENTS.md` のリポジトリ構成、コーディング規約、テスト方針、PR 方針を先に読んで従ってください。会話と成果物は、ユーザーから別の指定がない限り日本語にします。

## Docker 開発環境

- 開発、テスト、動作確認にはルートの `compose.yml` と既存コンテナを使います。ホストへ Ruby・Node.js・DB の依存を追加せず、別の開発環境も作りません。
- 最初に `docker compose ps` を確認し、必要なサービスだけを `docker compose up -d <service...>` で起動します。起動済みサービスを理由なく再作成しません。
- 一回限りのコマンドは `docker compose run --rm <service> ...`、起動済みサービスの状態を使う確認は `docker compose exec -T <service> ...` を使います。
- 依存関係、Dockerfile、DB 初期化に関係しない変更では `make build-gm3` や全サービスの再 build を行いません。必要なら対象サービスだけを build します。
- `docker compose down -v`、volume の削除、DB の作り直し、`docker system prune` は、ユーザーから明示的に依頼されない限り実行しません。
- `compose.prod.yml` と `compose.stage.yml` は、ユーザーが対象環境の操作を明示した場合だけ使います。秘密値や不足している環境変数は推測しません。
- 動作確認に必要なデータはローカルDBへ作成して構いません。作成・更新したデータ、再現手順、後始末の要否を報告し、既存データの破壊やDB全体の初期化は避けます。
- ローカルの入口は API `http://localhost:3000`、admin `http://localhost:8000`、user_front `http://localhost:8002`、user `http://localhost:8003`、rental `http://localhost:8004` です。
- `docker compose ps` と `docker compose logs --tail=100 <service>` で状態を確かめ、作業前から動いていたコンテナは停止しません。

## 作業範囲

コード実装、テスト追加、branch・Issue・PR 作成、レビュー、動作確認は別の作業として扱います。ユーザーが依頼していない commit、push、Issue・PR 投稿、merge まで勝手に広げません。
