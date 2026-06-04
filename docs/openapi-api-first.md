# OpenAPI API-first development

Group Manager の API-first 開発では、Rails の実装より先に
`api/oas_docs/src` の OpenAPI YAML を編集します。

## Workflow

1. `api/oas_docs/src/paths` と `api/oas_docs/src/components` に API 定義を追加する
2. Docker 経由で結合 YAML とフロント API クライアントを生成する

```bash
make openapi-codegen
```

3. `user/src/api/generated` に生成された型、fetch 関数、SWR hook を使って usecase 層を実装する
4. view 層は usecase 層を呼び出し、手書きの endpoint 文字列や response 型を増やさない
5. Rails 側の controller/usecase を OpenAPI 定義に合わせて実装する

## Commands

- `make openapi`: `make openapi-codegen` と同じ API-first 生成フロー
- `make openapi-build`: `api/oas_docs/src` から `api/oas_docs/dist/oas_doc.yml` を生成する
- `make openapi-codegen`: `openapi-build` 後に orval で `user/src/api/generated` を生成する

`user` コンテナは `/openapi-src/openapi.yml` を source root として参照します。
`make openapi-build` は Redocly CLI で `/openapi/oas_doc.yml` を生成し、
`make openapi-codegen` は同じ source root を orval に渡してフロント API
クライアントを生成します。

`routes:oas:docs` は通常の開発フローでは使いません。Rails routes から
OpenAPI を上書き生成すると、手書きした `api/oas_docs/src` の設計が崩れるためです。
`routes:oas:build` も通常フローでは使いません。`make openapi-build` は
`api/oas_docs/src/openapi.yml` を root manifest として Redocly CLI の
`bundle` を実行します。

## Layout

`paths` は 1 URI につき 1 ファイルに分割します。

```txt
api/oas_docs/src/paths/groups.yml
api/oas_docs/src/paths/groups/_id.yml
api/oas_docs/src/paths/api/v1/current_user.yml
api/oas_docs/src/paths/api/v1/current_user/groups.yml
```

パスパラメータはファイル名では `{id}` ではなく `_id.yml` として保存します。

`components/schemas` と `components/requestBodies` は domain/resource 配下に
分割し、URI 定義から `$ref` で参照します。ファイル名は component 名に
縛られないため、resource 名で保存します。

`api/oas_docs/src/openapi.yml` は分割ファイルを束ねる root manifest です。
新しい path や component ファイルを追加した場合は、対応する `$ref` を
`openapi.yml` に追加します。
