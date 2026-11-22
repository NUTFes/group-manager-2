# Group Manager 抜本的リファクタリング診断・改善計画

作成日: 2026-07-10

版・最終更新日: 2026-07-15

再検証日: 2026-07-15

対象リポジトリ: `NUTFes/group-manager-2`

診断方法: リポジトリ内コード・設定・スキーマの静的読解

方針: 本文は診断と実行計画のみを扱い、アプリケーションコードや DB には変更を加えない。
計画状態: **改訂版 / 実装開始条件付き**。Phase -1 の緊急封じ込めと、本文で定義する実行前ゲートを完了するまで全面改修へ着手しない。

## 1. 結論

本計画は認証周りだけを対象とするものではない。最優先事項は認証・認可の欠落だが、根本原因は次の設計負債が相互に結び付いていることにある。

- Rails の Controller と Active Record Model に、認可、ユースケース、検索、整形、外部通知が集中している。
- Rails 内に業務モジュールの所有範囲、公開インターフェース、許可依存がなく、`Group` を中心に複数領域が直接結合している。
- 未バージョン route 群には REST CRUD、submit/upsert、登録状況 RPC、帳票、auth が混在し、その一部を user/admin の両フロントが共有している。`/api/v1` には管理画面向けの画面依存 RPC が集中する一方、current-user API と共有 master 取得 API も混在し、API version・consumer・業務境界が対応していない。
- 参加団体向け Next.js、旧公開用 Nuxt 3、旧管理画面 Nuxt 2 が併存し、API・認証・型・UI の実装が重複している。
- DB の大部分で外部キー、NOT NULL、UNIQUE、検索用インデックスが不足し、モデルの関連定義だけではデータ整合性を保証できない。
- エラーレスポンス、HTTP ステータス、入力検証、ログ、外部 I/O の失敗処理に統一方針がない。
- CI がテストを品質ゲートとして実行しておらず、旧フロントには lint/typecheck のゲートもない。
- 可観測性、レート制限、非同期ジョブ、冪等性の共通基盤が確認できない。

したがって、局所的な認証修正だけではなく、Rails API を境界強制されたモジュラーモノリスへ再構成し、API 契約の再定義、DB の再設計、2 つの Next.js アプリへの集約、品質ゲートと運用基盤の整備を一体で進める。Rails API は単一 deployable/version・共有 DB を維持し、web/worker は同じ code/version から起動する。業務モジュールをマイクロサービス化しない。モジュールは user/admin ではなく業務能力で分け、各モジュールの所有データ、公開 API、許可依存を明示し、複数の検査手段で境界を守る。

Target DB のtable・cardinality・制約・全49 source tableのdispositionは、[database-erd-current-and-target-2026-07-15.md](./database-erd-current-and-target-2026-07-15.md) と [target-database-proposal-2026-07-15.erd.mmd](./target-database-proposal-2026-07-15.erd.mmd) を正本候補とする。ETL、reconcile、cutover、rollbackは [database-redesign-and-migration-plan-2026-07-15.md](./database-redesign-and-migration-plan-2026-07-15.md) を正本とする。モジュール所有権と依存方向は本書 6.3 を正本とし、DB詳細文書が新しい逆依存や循環依存を作ってはならない。

再検証の結果、方向性は維持するが、現状の計画をそのまま実装することは承認しない。現行 production の Critical な認証・認可問題を全面改修と切り離して先に封じ込める。また、Ruby/Rails と境界検査 gem の互換性、申請・審査状態の正本、HTTP adapter の公開境界、非同期 worker、API consumer、新 DB schema/ETL の成立、cutover 後のデータ保全を実行前ゲートとして確定する。

フロントエンドは「単一 Git リポジトリ・単一 pnpm workspace・2 つの Next.js app・2 つの subdomain・独立 deploy」を採用する。単一リポジトリであることは、単一 Next.js app や `/admin` 配下への URL 統合を意味しない。user/admin の分離は presentation、browser origin、deployment、障害範囲の境界であり、Rails の業務モジュール境界または認可境界の代替にはしない。

## 2. 診断スコープと確認状態

### 確認済み

- Rails 6.1 API: `api/app`, `api/config`, `api/db/schema.rb`, `api/test`, `api/oas_docs`
- 参加団体向け Next.js 15: `user/src`, `user/package.json`, NextAuth 設定
- 公開用 Nuxt 3: `user_front`
- 旧管理画面 Nuxt 2: `admin_view/nuxt-project`
- Docker Compose: 開発、stage、production の各 compose ファイル
- GitHub Actions: API/Next のコード品質、Chromatic、release

### 未確認

- 実データ量、実行計画、スロークエリ、N+1 の本番計測値
- 本番の Cloudflare、MySQL、バックアップ、アラート、外部ログ基盤の実設定
- 全エンドポイントを実リクエストした場合のレスポンス内容とシリアライズ結果
- Gem/npm の依存脆弱性スキャン結果。バージョンの古さは確認したが、CVE の有無は監査未実施
- 全マイグレーションの `down` 可否と、本番相当データでのロールバック所要時間
- OpenAPI と実装の全エンドポイント差分
- 実際のフロントバンドルサイズ、Core Web Vitals、ブラウザメモリ使用量
- 外部 API consumer の有無。コードからは断定できないため、access log、他 repository、運用 script、Spreadsheet/BI、Webhook を Phase 0 で調査する。調査完了前に既存 `/api/v1` を破壊的に再定義しない

## 3. 現状マップ

### 3.1 コンポーネント

| 領域 | 現状 | 主な責務 |
|---|---|---|
| `api/` | Rails 6.1 API + MySQL | 認証、申請 CRUD、管理検索、CSV/PDF、メール、Slack、DeepL |
| `user/` | Next.js 15 Pages Router | 参加団体の登録・申請、NextAuth、SWR、フォーム |
| `admin_view/nuxt-project/` | Nuxt 2 | 管理、検索、割当、帳票、審査、マスタ管理 |
| `user_front/` | Nuxt 3 | 旧参加団体/公開画面。production compose では旧扱い、stage では起動対象 |
| `api/oas_docs/` | 手書き OpenAPI | API 文書。クライアント型生成との接続は確認できない |
| `.github/workflows/` | GitHub Actions | RuboCop、Next lint/typecheck、Chromatic、release |

### 3.2 データフロー

```text
Browser
  ├─ Next.js user ─ NextAuth Credentials ─┐
  ├─ Nuxt 2 admin ─ @nuxtjs/auth ─────────┼─ Rails API ─ Active Record ─ MySQL
  └─ Nuxt 3 legacy/public ────────────────┘       │
                                                  ├─ SMTP/Gmail
                                                  ├─ Slack API
                                                  └─ DeepL API
```

Next.js のログインは `user/src/pages/api/auth/[...nextauth].ts` から Rails の `/api/auth/sign_in` を呼び、Devise Token Auth の `access-token`, `client`, `uid` を NextAuth JWT とクライアントセッションへ転記する。ブラウザ側 API クライアントはその値を Rails へのリクエストヘッダーに付与する。

Rails は、REST CRUD、submit/upsert、登録状況 RPC、帳票、auth が混在する未バージョン route 群と、管理画面向け RPC を中心としながら current-user/共有 master も混在する `/api/v1` を同一アプリで処理する。両 route 群の一部を user/admin が共有している。`api/app/services`, `queries`, `serializers`, `policies` は存在せず、処理の多くが Controller または Active Record Model に置かれている。現在は標準的な単一 Rails アプリであり、業務モジュール、公開 API、データ所有権、依存制約は存在しないため、現状をモジュラーモノリスとはみなさない。user/admin の分離は presentation/deployment 境界であり、Rails 内部のモジュール境界ではない。

## 4. 影響度 × 修正工数

`P0-S` は現行 production の即時セキュリティリスクであり、Phase -1 でゼロにする。`G0` は全面改修の実行可能性・データ安全性を妨げる設計ゲートであり、対応する Phase へ進む前に解消する。`P1` 以下は後続 Phase の品質ゲートで管理する。

| 優先度 | 問題 | 影響度 | 工数 | 判断 |
|---|---|---:|---:|---|
| P0-S | 公開 registration/create で任意 `role_id` を受け付ける自己権限昇格 | Critical | 小 | Phase -1 で入力契約から除外し、一般権限をサーバー固定 |
| P0-S | 未認証の更新・削除と任意 `role_id` 更新 | Critical | 小〜中 | 新 API を待たず Phase -1 で現行 endpoint を閉じる |
| P0-S | ログイン利用者による任意ユーザーのロール・パスワード変更 | Critical | 中 | Policy と専用管理ユースケースへ分離 |
| P0-S | 多数の CRUD/Admin API に認証・所有権検査がない | Critical | 中〜大 | default-deny と全エンドポイント認可表を導入 |
| P0-S | 本番用 fixture に固定管理者資格情報が存在 | Critical | 小〜中 | 利用有無を確認し、ローテーション・token 失効・監査 |
| P0-S | 公開 runtime config にクライアントシークレット候補 | Critical | 小 | 旧 Nuxt 廃止まで値を渡さず、サーバー側へ隔離 |
| G0 | 現行 Ruby/Rails と予定する Packwerk 関連 gem の非互換 | Critical | 大 | runtime 更新と固定 version の compatibility gate を先行 |
| G0 | 新 DB cutover 後の旧 DB rollback で新規書き込みが消失 | Critical | 中〜大 | point of no return と roll-forward 原則を明示 |
| G0 | `applications` と `review_workflow` の状態二重所有 | Critical | 中 | schema 作成前に状態の正本を分離 |
| G0 | root routes と private package Controller の矛盾 | Critical | 中 | HTTP adapter を Rails host に置く |
| P1 | BFF、Cookie、CSRF、Rails ingress の境界が未定義 | 高 | 中〜大 | app 別 host-only session と same-origin BFF を定義 |
| P1 | outbox を処理する durable queue/worker が未定義 | 高 | 中 | adapter、worker、retry、監視を先に決定 |
| P1 | 長期 branch と現行 CI/stage の不整合 | 高 | 中 | 短命 PR を基本とし、全構成を deploy できる stage を整備 |
| P1 | 外部 consumer 未確認のまま旧 API を廃止 | 高 | 小〜中 | Phase 0 consumer discovery を compatibility facade 廃止の gate にする |
| P1 | DB 制約・索引不足 | 高 | 大 | 移行方式を実測で決定し、制約・backfill/ETL を段階適用 |
| P1 | 業務モジュール境界の欠如と Controller/Model の責務集中 | 高 | 大 | モジュール所有権を定義し、内部を Command/Query/Serializer/Policy へ分離 |
| P1 | API 契約・エラー形式の不統一 | 高 | 中〜大 | `/api/v2` OpenAPI を単一情報源化し、consumer 調査で旧 facade と廃止期限を決める |
| P1 | 一括 upsert の検証回避・競合・部分失敗 | 高 | 中 | Transaction、制約、Command に集約 |
| P1 | 旧フロント併存と認証/API 実装の重複 | 高 | 大 | user/admin の 2 Next アプリへ集約 |
| P1 | CI に API/フロントテストがない | 高 | 中 | lint/typecheck/test/build を必須化 |
| P2 | 外部 API/メール/Slack の同期実行 | 中〜高 | 中 | timeout、retry、Job、outbox/idempotency |
| P2 | エラー境界、loading/empty/error UI の不統一 | 中 | 中 | 共通 UI 状態と境界を導入 |
| P2 | ログ・メトリクス・ヘルスチェック不足 | 中〜高 | 中 | 構造化ログ、監視、readiness/liveness |
| P2 | 巨大コンポーネント・巨大 Model | 中 | 中〜大 | 機能単位の垂直分割 |
| P3 | i18n ハードコード、デッドコード、命名揺れ | 中 | 中 | 共通辞書と削除フェーズで解消 |

## 5. 詳細診断

### 5.1 認証・認可・テナント境界

#### [Critical] 未認証でユーザー更新・削除・ロール変更が可能

- 該当箇所: `api/app/controllers/users_controller.rb` の `before_action`, `update`, `destroy`, `user_params`
- エンドポイント: `PUT /users/:id`, `DELETE /users/:id`
- 根拠: `authenticate_api_user!` は `index`, `show`, `get_current_user` だけに限定され、`update` と `destroy` は対象外である。`user_params` は `role_id` を許可している。
- 再現条件: 認証ヘッダーなしで既存ユーザー ID を指定し、`PUT /users/:id` に別の `role_id` を送るか、`DELETE /users/:id` を送る。
- 影響: 権限昇格、アカウント改変、アカウント削除。
- 推奨方針: 新 API は全 Controller を認証必須にし、公開アクションだけを明示的に除外する。自己編集と管理編集を別 endpoint/command に分け、`role_id` は管理者専用 Policy を通す。削除は監査可能な管理ユースケースに限定する。

#### [Critical] 公開ユーザー登録から自己権限昇格できる

- 該当箇所: `api/app/controllers/api/auth/registrations_controller.rb` の sign-up parameter、`api/app/controllers/users_controller.rb#create/user_params`、`api/config/routes.rb`、`api/db/fixtures/production/01_role.rb`
- 根拠: 公開 registration と別の未認証ユーザー作成 endpoint が入力された `role_id` を許可し、production fixture では管理者権限を表す role ID が固定されている。
- 再現条件: 未認証でユーザー登録 body に管理者 role ID を含める。
- 影響: 管理者アカウントの自己作成、以後の全管理 API への権限拡大。
- 推奨方針: 全公開 registration の契約から `role_id` を除外し、一般ユーザーの安定 role key をサーバー側で固定する。管理者作成は既存管理者の再認証、専用 Policy、監査ログを通る別ユースケースに限定する。この修正は新 API を待たず Phase -1 で実施する。

#### [Critical] 任意ユーザーのロール変更とパスワードリセット

- 該当箇所: `api/app/controllers/api/v1/users_controller.rb` の `update`, `edit_user_info`, `reset_password`
- エンドポイント: `GET /api/v1/update_user/:id/:role_id`, `POST /api/v1/users/edit_user_info`, `POST /api/v1/users/reset_password`
- 根拠: 対象アクションは認証されるが、`require_admin!` や対象ユーザーとの一致検査がない。パスや body の任意 ID から `User.find` している。さらに更新操作が GET に割り当てられている。
- 再現条件: 一般ロールのログイン済みユーザーが他ユーザーの ID を指定する。
- 影響: 権限昇格、他者アカウントの乗っ取り、キャッシュやプリフェッチによる意図しない更新。
- 推奨方針: Phase -1 では現行 route に Policy/本人性検査を加えて直ちに封じる。target は `PATCH /api/v2/admin/users/:id/role` と管理者専用 Policy、`PATCH /api/v2/me/password` と本人確認済み自己変更に分ける。管理者によるリセットは一時 token 発行方式と監査ログを採用し、平文 password の直接指定を廃止する。

#### [Critical] CRUD と管理 API の広範な認可欠落

- 該当例:
  - `api/app/controllers/groups_controller.rb`: 全アクションに認証なし。`user_id` も入力可能
  - `api/app/controllers/rental_orders_controller.rb`: 任意 `group_id` の CRUD
  - `api/app/controllers/food_products_controller.rb`: 任意 group の作成・upsert・更新・削除
  - `api/app/controllers/purchase_lists_controller.rb`: 任意 purchase list の CRUD/upsert
  - `api/app/controllers/venue_maps_controller.rb`: 任意 group の CRUD
  - `api/app/controllers/api/v1/groups_api_controller.rb`: 管理画面用一覧・検索に認証なし
- 根拠: 対象 Controller に `authenticate_api_user!` と所有権/管理権限検査がない。ID または `group_id` をリクエストから直接受け取る。
- 再現条件: 未認証または別団体のユーザーが対象 ID を指定する。
- 影響: IDOR/BOLA、個人情報・申請情報の閲覧、越境更新・削除、データ破壊。
- 推奨方針: 認証を default-deny にし、Policy の `scope` で取得可能集合を制限する。参加団体 API は常に `current_user.groups` から対象を検索し、管理 API は role/capability を検査する。全 route を「公開・本人・団体・管理者」の認可表にして request spec を対応させる。

#### [Warning] ロール判定が数値 ID に固定されている

- 該当箇所: `api/app/controllers/application_controller.rb#require_admin!`, `api/app/controllers/api/v1/mail_deliveries_controller.rb#require_admin!`
- 根拠: `[1, 2].include?(current_api_user&.role_id)` が重複している。ロールの意味が DB の採番とコードに分散する。
- 影響: Seed や移行後の ID 差による誤認可、権限追加時の修正漏れ。
- 推奨方針: `Role` の安定キーまたは enum/capability と Policy に集約し、許可理由を監査ログへ残す。

#### [Warning] Rails トークンがブラウザ JavaScript/storage から参照できる

- 該当箇所: `user/src/pages/api/auth/[...nextauth].ts` の `jwt`/`session` callback、`user/src/api/api.ts#buildHeaders`、`admin_view/nuxt-project/pages/index.vue`、`admin_view/nuxt-project/plugins/axios.js`
- 根拠: user は Rails の `access-token`, `client`, `uid` を NextAuth session にコピーし、React 側が直接利用する。admin は token を `localStorage` に保存し、Axios request へ付与する。
- 影響: XSS 成立時に Rails の bearer 相当トークンも窃取される。認証方式が NextAuth と Devise Token Auth の二層になり、失効・更新・ログアウトの責務も分散する。
- 推奨方針: Next.js の BFF 経由に統一し、Rails トークンを HttpOnly セッションから外へ出さない。直接 API を継続する場合は Devise Token Auth に一本化し、保存場所、更新、失効、ログアウトを明文化する。

### 5.2 シークレット・OWASP・入力境界

#### [Critical] 本番用 fixture に固定管理者資格情報が存在する

- 該当箇所: `api/db/fixtures/production/02_user.rb`、その fixture を実行する `Makefile` の production target
- 根拠: 本番用と名付けられた fixture に固定メールアドレスと固定パスワードが記載されている。実際の production で現在も有効か、過去に投入されたかは未確認。
- 影響: repository を閲覧できる者による管理者ログイン、漏えい後も残り続ける既知資格情報、既存 token を介した継続アクセス。
- 推奨方針: production での投入履歴と有効性を確認し、該当アカウントの資格情報ローテーション、全 session/token 失効、アクセス履歴確認を行う。production seed から固定資格情報を排除し、初期管理者作成は一回限りの運用手順または secret manager 経由にする。本文には実際の資格情報を転載しない。

#### [Critical] 旧 Nuxt の public runtime config にシークレット名の値を公開

- 該当箇所: `user_front/nuxt.config.ts` の `runtimeConfig.public.IMGUR_CLIENT_SECRET`
- 根拠: `NUXT_IMGUR_CLIENT_SECRET` が `public` 配下へ設定されている。値が設定された場合、クライアントバンドルまたは公開 runtime config から取得可能になる。
- 影響: Imgur クライアントシークレット漏えい。
- 推奨方針: public 設定から即時除外し、アップロードはサーバー側 endpoint か署名済み一時資格情報を経由する。旧 Nuxt 廃止まで stage/prod で当該値を渡さない。実際に過去の値が露出したかは未確認のため、運用側でローテーション要否を確認する。

#### [Warning] ログの機密情報・個人情報フィルタが不足

- 該当箇所: `api/config/initializers/filter_parameter_logging.rb`, `api/config/environments/production.rb`, `user/src/pages/api/auth/[...nextauth].ts`
- 根拠: Rails のフィルタ対象は `password` のみで、本番 log level は `debug`。NextAuth の sign-in event は user オブジェクトを `console.log` する。
- 影響: メールアドレス、uid、トークン、申請情報がログ基盤へ残る可能性。
- 推奨方針: `password_confirmation`, `token`, `access-token`, `client`, `uid`, reset token、メール本文等を共通 redact する。本番は原則 `info`、セキュリティイベントは構造化監査ログに分離する。

#### [Warning] 入力検証が Controller ごとに分散し、一括更新は Model 検証を迂回

- 該当箇所: `FoodProductsController#upsert`, `PurchaseListsController#upsert_all`, `CookingProcessOrdersController#upsert`
- 根拠: `upsert_all` は Active Record の validation/callback を実行しない。各 Controller が許可キー、nil 補完、時刻、検索を個別実装している。
- 影響: 不正な境界値、他団体 ID、重複、途中状態が DB に入る。巨大配列でメモリ・SQL 負荷も増える。
- 推奨方針: request schema で配列件数・文字数・数値範囲を制限し、Command 内の transaction と DB 制約を最終防衛線にする。bulk API は最大件数と idempotency key を定義する。

#### [Info] CORS は allowlist だが CSRF 全体方針は未確認

- 該当箇所: `api/config/initializers/cors.rb`
- 根拠: production origin は 2 ドメインに限定される一方、`credentials: true` で Devise custom headers を利用する。NextAuth 側の CSRF と Rails API 側のトークン運用が二層である。
- 推奨方針: BFF 方式なら SameSite/HttpOnly/Secure Cookie と CSRF token、直接 API 方式なら Authorization header と厳格な CORS に統一する。実ブラウザでの cookie/header 挙動は未確認。

#### [Info] 依存パッケージの既知脆弱性は未確認

- 該当例: Rails 6.1/Ruby 3.0、Nuxt 2、Axios 0.21、Webpack 4 など旧系統が残る。
- 根拠: manifest のバージョンは確認済みだが、lockfile を用いた `bundle audit`/`pnpm audit`/`npm audit` は未実施。
- 推奨方針: CI に lockfile ベースの依存監査と Dependabot/Renovate を追加し、Nuxt 2 は更新より廃止を優先する。

### 5.3 Rails アーキテクチャとバックエンド

#### [Warning] 業務モジュール境界と依存方向が存在しない

- 該当箇所: `api/app/models/group.rb`, `api/config/routes.rb`, `api/app/controllers/api/v1/*`
- 根拠: `Group` がユーザー、年度、会場、ステージ、電力、物品、食品、広報、保健所提出などを直接関連付け、検索とレスポンス整形まで担う。`/api/v1` は `get_*_for_admin_view` と current-user API が同一 namespace に混在し、業務能力ではなく画面利用者に結合している。モジュールごとの公開 API、所有テーブル、許可依存、境界検査は確認できない。
- 影響: 一領域の変更が `Group`、複数 Controller、管理/参加団体の両 API に波及する。循環依存や越境更新を検出できず、責任者と変更影響が不明確になる。
- 推奨方針: Rails API を単一デプロイ・共有 DB のモジュラーモノリスとして再構成する。Identity & Access、Festival Configuration、Participation、Applications、Inventory & Allocation、Program Allocation、Review Workflow、Communications、Reporting を業務モジュールの初期仮説とし、公開 API とデータ所有権を Phase 0 で検証する。互換性を確認した dependency/privacy tooling で定数境界を、SQL/テーブル越境は AST/table ownership test とレビュー規約で補完する。

#### [Warning] Active Record Model が Query/Presenter/集計を兼務

- 該当箇所: `api/app/models/group.rb`（約 940 行）、`api/app/models/user.rb#with_regist_info`
- 根拠: `Group` に一覧整形、検索、申請状況、表示用 Hash 構築、集計が多数置かれている。インスタンス変数を用いる class method もあり、モデルが永続化ルール以外の責務を抱えている。
- 影響: 関連追加時の N+1、画面変更によるドメインモデル変更、単体テスト困難、再利用時の巨大レスポンス。
- 推奨方針: DB 検索を Query Object、レスポンス整形を Serializer、更新手順を Command/Service、認可を Policy へ分ける。Repository 抽象は Active Record と重複するため原則導入せず、外部 I/O と複雑な永続化境界にだけ interface を置く。

#### [Warning] Controller にユースケースと外部通知が混在

- 該当箇所: `GroupsController#create/update/destroy`, `ApplicationController` の DeepL/保健所提出処理、`OutputCsvController`（約 683 行）
- 根拠: DB 更新、Slack 文面構築・送信、翻訳、レスポンス整形、CSV 列定義が Controller に直書きされる。
- 影響: 外部障害時の部分失敗、再送による重複通知、Controller test 以外での検証困難、変更影響拡大。
- 推奨方針: Controller は認証済み context、入力 DTO、Command 呼び出し、Serializer のみに限定する。通知は transaction commit 後の Job/outbox、CSV/PDF は Export Query と Renderer に分ける。

#### [Critical] DB 更新後の Slack 失敗でリクエストだけ失敗し得る

- 該当箇所: `GroupsController#create/update/destroy`
- 根拠: レコード保存/削除後に同期 `client.chat_postMessage` を実行し、transaction、timeout、retry、rescue がない。
- 再現条件: Slack timeout/5xx/資格情報不備の時に団体を作成・更新・削除する。
- 影響: DB は更新済みだがクライアントは失敗と認識し、再送で二重作成・二重操作が起こる。削除後の `@group.user` 参照も関連状態に依存する。
- 推奨方針: DB transaction 内で `platform_core` の public API から outbox event を作り、commit 後に Job が送信する。event ID を冪等性キーにし、指数バックオフ、上限回数、dead-letter、手動再送を用意する。

#### [Warning] DeepL/SMTP/Slack の timeout・retry 方針が共通化されていない

- 該当箇所: `ApplicationController#request_deepl_translation`, `GroupsController`, `MailDeliveriesController`, production mailer 設定
- 根拠: DeepL は例外時に原文へフォールバックするが明示 timeout/retry はない。メールと Slack は request 内同期実行である。
- 影響: 外部ネットワーク断で Web worker が滞留し、部分失敗やユーザーの連打を誘発する。
- 推奨方針: Adapter ごとに接続/読取 timeout、retry 対象、最大試行、circuit breaker を決める。ユーザー操作と切り離せる処理は Job 化し、送信状態を DB で追跡する。

#### [Warning] 例外・HTTP ステータスの扱いが不統一

- 該当箇所: `ApplicationController#fmt`, 各 CRUD Controller
- 根拠: JSON 内 `status.code` と実際の HTTP status が分離している。失敗でも HTTP 200 の箇所、raw JSON の箇所、`fmt` の箇所、`rescue StandardError` で内部例外文を返す箇所が混在する。
- 影響: フロントが HTTP status と body code のどちらを見るか揺れ、監視も失敗を成功として集計する。内部エラー情報が利用者に露出し得る。
- 推奨方針: `rescue_from` と共通 Error Serializer を境界に置き、`4xx/5xx` を実 HTTP status で返す。ドメイン例外と予期せぬ例外を分け、後者の詳細は request ID と共にサーバーログだけへ記録する。

### 5.4 潜在バグ・競合・データ不整合

#### [Critical] 調理工程作成の validation failure で未定義メソッドを呼ぶ

- 該当箇所: `api/app/controllers/cooking_process_orders_controller.rb#create`
- 根拠: 保存失敗分岐が `fmt(error, @cooking_process_order)` を呼ぶが、`ApplicationController` に `error` helper は定義されていない。
- 再現条件: `CookingProcessOrder#save` が false になる入力を送る。
- 影響: 本来 422 にすべき入力エラーが `NoMethodError` の 500 になる。
- 推奨方針: 共通 422 error response を利用し、この failure path の request spec を追加する。

#### [Warning] 未割当数の計算が品目単位になっていない

- 該当箇所: `api/app/models/group.rb#unallocated_rental_items`
- 根拠: 各 `rental_order` の `num` から `assign_rental_items.sum(&:num)`、すなわち団体全体の割当総数を引いている。対象 `rental_item` で絞っていない。
- 再現条件: 1 団体に複数種類の rental order と assign rental item が存在する。
- 影響: 品目ごとの未割当数が負数または誤値になる。
- 推奨方針: rental item ごとに requested/assigned を DB 集計し、負数禁止と在庫上限を transaction + lock + DB 制約で保証する。

#### [Warning] 一括 upsert に競合・所有権・重複防止がない

- 該当箇所: `FoodProductsController#upsert`, `PurchaseListsController#upsert_all`, `CookingProcessOrdersController#upsert`
- 根拠: クライアント指定 ID を直接 upsert し、対象団体への所属検査がない。複数 SQL と再検索は一つの transaction で囲まれていない。多くの自然キーに UNIQUE 制約がない。
- 再現条件: 二重送信、複数タブ、同時編集、途中での DB/ネットワーク失敗。
- 影響: 他団体レコードの更新、重複行、レスポンスと DB の不一致、last-write-wins による変更消失。
- 推奨方針: 所有権 scope、`lock_version` または条件付き更新、idempotency key、自然キー UNIQUE、単一 transaction を導入する。複数レコード置換 API は期待 version を必須にする。

#### [Warning] 自己情報更新が原子的でない

- 該当箇所: `Api::V1::CurrentUserApiController#edit_user_info`, `Api::V1::UsersController#edit_user_info`
- 根拠: `User` と `UserDetail` を別々に保存し、transaction がない。片方だけ成功し得る。
- 再現条件: email UNIQUE 違反や UserDetail validation/DB エラーが片方の保存後に発生する。
- 影響: ユーザー基本情報と詳細情報の不整合。
- 推奨方針: Command の transaction 内で両方を `save!` し、失敗時に全体 rollback する。

#### [Info] 巨大入力・連打・ブラウザバック対策が共通化されていない

- 根拠: bulk request の最大件数、本文長上限、idempotency key、optimistic locking の共通実装を確認できない。
- 影響: メモリ増大、長時間 transaction、二重送信、古い画面からの上書き。
- 推奨方針: reverse proxy と application の双方で body/array/string 上限を定義し、作成・通知・申請確定に冪等性キー、編集に version を導入する。

### 5.5 DB 設計

#### [Warning] Model の必須関連を DB が保証していない

- 該当箇所: `api/db/schema.rb` の `groups` ほか旧テーブル群
- 根拠: `Group` は `belongs_to :user, :fes_year, :group_category` だが、`groups.user_id`, `fes_year_id`, `group_category_id` は nullable で、index/foreign key もない。スキーマ全体でも外部キーは一部の新しいテーブルに限られる。
- 影響: orphan、関連先なし、同一性崩壊、join/filter の全表走査。
- 推奨方針: 新 DB の target schema では関連の必須/任意をデータ辞書にし、`null: false`, foreign key, UNIQUE/CHECK, index を定義する。旧データの orphan/duplicate/invalid は ETL reject report に出し、黙って補正しない。

#### [Warning] `has_one` を UNIQUE 制約が保証していない

- 該当例: `sub_reps.group_id`, `place_orders.group_id`, `public_relations.group_id`, `venue_maps.group_id`, `announcements.group_id`, `stage_common_options.group_id`, `user_details.user_id`
- 根拠: Model は `has_one` だが、対応 FK の UNIQUE index がない。`user_details.user_id` も通常 index のみ。
- 影響: 複数行が入り、取得順によって返る値が変わる。
- 推奨方針: 本当に 1:1 なら UNIQUE + FK + NOT NULL、履歴を持つなら状態/有効期間を持つ 1:N に再設計する。

#### [Warning] 日時・状態・数量の型と制約が弱い

- 該当例: `fes_dates.date`, `purchase_lists.purchase_date`, `assign_stages.time_point_*`, `stage_orders.*_time` が string。数量や boolean の多くが nullable。
- 影響: ソート・範囲検索・タイムゾーン処理の誤り、負数、三値 boolean、無効状態。
- 推奨方針: `date`, `time`, `datetime`, integer enum/check constraint を用途に合わせて採用し、数量は非負 check、boolean は default + NOT NULL にする。

#### [Warning] 削除方針が物理削除に偏り、監査要件がない

- 根拠: `dependent: :destroy` と公開 DELETE が多数あり、`deleted_at` や監査テーブルはスキーマで確認できない。
- 影響: 誤操作からの復元不能、誰がいつ何を削除したか追跡不能。
- 推奨方針: マスタ/下書きは物理削除可、提出済み申請/ユーザー/通知は取消状態または論理削除、といった分類を ADR で決める。監査対象変更は actor、before/after、request ID を保存する。

#### [Info] N+1 はコード上の候補を確認、実測は未確認

- 該当例: `OutputCsvController#output_groups_csv` がループ内で user/category/year を参照し、`Group#with_regist_info` が多数関連を走査する。
- 推奨方針: Query Object ごとに `includes/preload` を固定し、Bullet 相当の開発検出と query count test を導入する。実行計画と本番データ量に基づき index を決め、闇雲な追加は避ける。

### 5.6 API 設計と契約

#### [Warning] API version・consumer・業務境界が対応していない

- 該当箇所: `api/config/routes.rb:39-149`, `api/config/routes.rb:151-357`, `admin_view/nuxt-project/pages/groups/index.vue:237-248`, `user/src/api/groupApi.ts:6-10`, `user/src/api/useUserDetailApi.ts:55-57`
- 根拠: 未バージョンの `/groups`, `/rental_orders`, `/group_categories` 等は user/admin の双方が使う。`/api/v1` には `get_*_for_admin_view`, `get_refinement_*`, `get_search_*` が集中するが、同じ namespace に user が利用する `/api/v1/current_user` もある。admin の団体一覧も未バージョン API と `/api/v1/get_refinement_groups` を同一画面で併用する。さらに `GET /api/v1/update_user/:id/:role_id` のように HTTP semantics に反する route がある。
- 影響: キャッシュ/監視/認可規則を共通化できず、画面変更が API 名へ波及する。
- 推奨方針: 現行 URL を user/admin や DB table の所有境界に流用しない。新 API は `/api/v2` で resource 中心に再定義し、検索は query parameter、状態遷移は明示 subresource/action、更新は PATCH/POST、削除は DELETE に統一する。未バージョン API と旧 `/api/v1` は consumer ごとの期限を持つ compatibility facade とし、利用ゼロ確認後に廃止する。

#### [Warning] エラーレスポンス契約が複数存在

- 根拠: `{status, data}`、raw model/raw boolean、`{error: ...}`、HTTP 200 内の 404/422 code が混在する。
- 推奨契約:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "入力内容を確認してください",
    "details": [{ "field": "email", "code": "taken" }],
    "request_id": "..."
  }
}
```

成功は `{ "data": ..., "meta": ... }`、一覧は `meta.pagination` を持たせる。内部例外文は返さない。

#### [Warning] ページネーション・レート制限がない

- 根拠: `User.all`, `Group.all` 等の全件取得があり、Rack::Attack 等の rate limit 基盤を manifest/initializer から確認できない。
- 影響: データ増加時のメモリ/応答悪化、検索・ログイン・メール送信の濫用。
- 推奨方針: cursor または page/size の上限付きページネーションを全一覧に適用し、認証、検索、export、メールに actor/IP 単位の制限を設定する。

#### [Warning] OpenAPI と TypeScript の単一情報源がない

- 根拠: OpenAPI 文書は存在するが、`user` の API 型・レスポンス型は手書きで、型生成 script/dependency を確認できない。API client 実装も新旧が同じファイルに併存する。
- 影響: server/client の field、nullable、error shape のズレがコンパイルで検出されない。
- 推奨方針: OpenAPI を CI の source of truth とし、生成した schema/client types を workspace package として user/admin の両方から利用する。contract diff を破壊的変更ゲートにする。

### 5.7 フロントエンド

#### [Warning] API client が新旧 3 系統以上を同居させている

- 該当箇所: `user/src/api/api.ts`, `user/src/hooks/useApi.ts`
- 根拠: 汎用 `request`、`legacy*Fetcher`、`sendRequest/postData/putData` が併存し、`any` が広範囲に使われる。
- 影響: 認証ヘッダー、case 変換、error 処理、空 response の挙動が呼び出し経路で変わる。
- 推奨方針: 生成 API client + 薄い fetch adapter へ一本化し、legacy 呼び出しを feature 単位で置換する。エラーは discriminated union で扱う。

#### [Warning] 状態の単一情報源が曖昧

- 該当箇所: NextAuth `useSession`, `useUser`, SWR hooks、各フォーム hook
- 根拠: `useUser` は `/api/getUser` を再 fetch し、NextAuth session と別の user state を作る。SWR と大規模ローカル state が併用される。
- 影響: ログイン直後、プロフィール更新後、複数タブで user/申請状態がずれる。
- 推奨方針: server state は SWR/TanStack Query、session は auth provider、フォーム draft は local form state、横断 UI state だけ小さな store と境界を明記する。user identity は session/me query の一系統にする。

#### [Warning] 巨大ページ・フォームが機能境界を越えている

- 該当例: `user/src/pages/home/index.tsx`、RentItems hook 約 855 行、Employees hook 約 617 行、`api.ts` 約 486 行
- 根拠: home が全申請コンポーネントを静的 import し、カテゴリ分岐を一ファイルで保持する。
- 影響: 変更競合、再レンダリング範囲拡大、初期 bundle 増加、単体テスト困難。
- 推奨方針: `features/<domain>` 単位に query/form/view を閉じ、申請種別 metadata から構成する。画面下部の重い機能は route/interaction 単位で lazy load する。実 bundle 効果は計測して判断する。

#### [Warning] loading/error/empty と Error Boundary の共通方針がない

- 根拠: `AuthGuard` は loading 中に `null` を返す。`user/src` に共通 Error Boundary 実装は確認できず、各 hook/component が個別に toast/条件分岐する。
- 影響: 白画面、API failure の見落とし、再試行不能、空配列と取得失敗の混同。
- 推奨方針: App/route/feature の 3 段階 Error Boundary、共通 Skeleton、EmptyState、RetryableError、権限エラー画面を定義する。mutation は二重送信防止と成功後の invalidate を共通化する。

#### [Warning] user/admin の UI primitive が別実装で、Modal の accessibility 契約がない

- 該当箇所: `user/src/components/Button/Button.tsx`、`user/src/components/Modal/Modal.tsx`、`user/tailwind.config.ts`、`user/src/styles/globals.css`、`admin_view/nuxt-project/components/CommonButton.vue`、`admin_view/nuxt-project/assets/main.scss`
- 根拠: user/admin は異なる Button API と色定義を持つ。user の Modal には `role="dialog"`/`aria-modal`、focus trap、Escape、focus restoration を確認できない。admin にも個別 Modal 実装がある。
- 影響: `AdminButton`/`UserButton` の重複、role と見た目の結合、keyboard/screen reader 利用不能、画面ごとの focus/scroll 不具合。
- 推奨方針: `packages/design-tokens` と `packages/ui` に accessibility/interaction primitive を集約する。Button は `intent/appearance/size/loading` で表現し、`user/admin` prop を持たせない。業務 Modal の内容は各 app に残し、Dialog shell だけを共有する。移行と視覚的 redesign は分離する。

#### [Warning] client/server validation の契約が分離

- 該当箇所: `user/src/utils/validate/validate.ts` と各 component `schema.ts`、Rails models/controllers
- 根拠: Zod の文言・制約がフロント内にあり、Rails 側との共有 schema/contract がない。一部文言は日本語と英語を改行で連結し、一部は i18n key である。
- 影響: client で許可して server で拒否、またはその逆。locale 切替でも文言が固定される。
- 推奨方針: server を最終 authority とし、OpenAPI JSON Schema から基本制約を共有する。画面固有の相関検証だけ client に追加し、文言は i18n key に統一する。

#### [Warning] 旧管理画面の依存と成果物管理が技術負債

- 該当箇所: `admin_view/nuxt-project/package.json`, `.nuxt/`, 94 pages
- 根拠: Nuxt 2、Axios 0.21、Webpack 4 を使用し、生成 `.nuxt` と `node_modules` が作業ツリー内に存在する。管理画面は多数機能を持つため単純削除できない。
- 推奨方針: 旧画面の更新延命ではなく、新 Next admin への機能別移行と parity matrix を採用する。生成物は追跡対象から外し、最後に Nuxt 2 と関連 container を削除する。

### 5.8 テスト・CI/CD・運用

#### [Warning] CI がテストを品質ゲートにしていない

- 該当箇所: `.github/workflows/api-code-quality.yml`, `user-code-quality.yml`
- 根拠: API workflow は RuboCop のみ。user workflow は formatter/lint fix/typecheck だが、Playwright test と Next build を実行しない。Nuxt 2/3 の品質 workflow は確認できない。
- 影響: CI は通るが認可、DB transaction、runtime build、主要画面が壊れる。
- 推奨方針: API は lint + test + schema consistency + security scan、各 Next app は lint + typecheck + unit/component + build + 最小 E2E を必須 check にする。

#### [Warning] CI が PR ブランチを書き換える

- 根拠: RuboCop `-A`、Prettier、ESLint fix を実行し、bot が commit/push する。
- 影響: レビュー中の差分変化、同時 push 競合、formatter が品質チェックより副作用を持つ。
- 推奨方針: CI は check-only にし、修正は開発者の pre-commit/明示 workflow に分ける。`fmt:check` と lint no-fix を branch protection の required check にする。

#### [Warning] 認可・重要更新のテストが偏っている

- 根拠: Rails controller/model test は存在するが、多くの scaffold 系 controller test は約 40 行である。user の E2E は調理工程・再提出に集中し、認証、権限昇格、団体越境、二重送信を網羅する構成は確認できない。
- 推奨方針: endpoint × role × ownership matrix から request spec を生成し、401/403/404 の非漏えいを検証する。申請置換、在庫、メール、移行 ETL は並行・部分失敗を含む integration test を用意する。

#### [Warning] 可観測性の基盤が不足

- 根拠: request ID log はあるが、Sentry/APM/Prometheus、明示 health endpoint、queue monitoring、SLO を manifest/routes から確認できない。stage に Dozzle agent はある。
- 推奨方針: `/up`（process）、`/ready`（DB/queue）、構造化 JSON log、error tracking、RED metrics、job/外部 API metrics、認可拒否監査を導入する。Dozzle は閲覧手段であり監視・通知の代替にしない。

#### [Info] デプロイとロールバックの実態は未確認

- 根拠: compose 定義と Cloudflare tunnel は確認したが、image tag 固定、DB backup、migration gate、blue/green、承認フローはリポジトリから断定できない。
- 推奨方針: immutable image、migration job、stage rehearsal、backup restore test、旧系への切戻し手順を runbook 化する。

### 5.9 技術的負債

- `api/config/routes.rb` に「既存 API を消す」TODO が残り、新旧 endpoint が併存する。
- `Api::V1::UsersController#update` に利用有無不明のコメントがあり、危険な route が残る。
- `user/src/api/api.ts` と `user/src/hooks/useApi.ts` は legacy 実装の削除予定コメントがあるが、同居したままである。
- `user/src/pages/test_pr.tsx`, `test_venuemap.tsx` が production source tree にある。
- `api/app/models/group.rb` に表示形ごとの類似 mapping が大量にあり、重複と N+1 リスクを生む。
- `admin_view` と `user_front` は移行途中の旧実装であり、container、依存、認証、型の保守面を増やしている。

### 5.10 再検証で判明した計画上のブロッカー

#### [Critical] 現行 runtime と境界検査 tooling の互換性が成立していない

- 該当箇所: `api/Gemfile` の Ruby 3.0.7/Rails 6.1.3.1、旧計画の Packwerk・`packwerk-extensions`・`packs-rails` 導入手順
- 根拠: Packwerk、`packs-rails`、`packwerk-extensions` は release と main branch で Ruby/Railties の要求 version が異なる。確認した現行候補には Ruby 3.0.7/Rails 6.1.3.1 を満たさない組み合わせがあり、採用 version を指定しないまま 3 gem を追加できるとは判断できない。旧計画には候補 version と compatibility matrix がなかった。
- 再現条件: 現行 Ruby/Rails のまま、version を固定せず最新の 3 gem を bundle へ追加する。
- 影響: Phase 1 の開始時点で依存解決または Rails boot に失敗し、モジュール化作業を開始できない。
- 推奨方針: Ruby/Rails の対応 version への更新と、Packwerk 関連 gem の固定 version を Phase 1 より前の compatibility gate にする。代替として旧 runtime を維持する場合は、検証済みの Packwerk core と独自 loader/privacy test の構成を ADR に残す。ただし EOL runtime の継続を伴うため推奨しない。

#### [Critical] 申請状態と審査状態の正本が重複している

- 該当箇所: 旧計画の `applications` と `review_workflow` の所有責務、DB 状態集合、Phase 3 の state machine
- 根拠: `applications` が提出状態を持つ一方、`review_workflow` も review status と resubmission を持ち、単一 application に review状態まで重複保持する想定だった。
- 再現条件: 審査者が再提出を要求した直後に参加団体が再提出する、または審査完了と取消が並行する。
- 影響: 二つの状態列が乖離し、どちらが正本か判定できず、通知、一覧、再提出可否が不整合になる。
- 推奨方針: `applications` は application case の `active/cancelled` と submission version の `draft/submitted/withdrawn`、`review_workflow` は submission version/明細ごとの `pending/in_review/approved/changes_requested/rejected` と comment を所有する。提出 payload snapshot は immutable とし、withdraw 等は actor/time/reason 付き lifecycle metadata/event で表す。画面用の総合状態は projection として導出する。

#### [Critical] root routes と private package Controller が両立しない

- 該当箇所: 旧計画の Rails host/root による route 所有と、package 内 Controller の privacy strict 方針
- 根拠: root の routes は package 内 Controller 定数を解決する必要がある。Controller を private にしたまま文字列参照や動的 `constantize` で回避すると、Packwerk の検査対象外になる。
- 影響: privacy 違反を恒常的に許容するか、production boot 時に route 解決が失敗する。
- 推奨方針: routes、`Api::V1::BaseController`、薄い HTTP Controller/Serializer adapter を Rails host に置き、各 Controller は package の public Command/Query/DTO だけを利用する。package 内の Model、Command 実装、Query 実装、Policy は private のまま維持する。

#### [Critical] outbox を配送する実行基盤がない

- 該当箇所: `api/config/environments/production.rb`、`compose.prod.yml`、旧計画の outbox/background job 方針
- 根拠: durable な Active Job adapter、queue、worker service、dead-letter、queue 監視を production 構成から確認できない。
- 再現条件: DB transaction が outbox record を作成した後、web process が再起動する、外部 API が継続失敗する、poison message が先頭で失敗し続ける。
- 影響: DB 更新は成功しても通知・export が永続的に処理されないか、再試行で重複配送される。
- 推奨方針: durable queue、worker image/service、outbox dispatcher、retry/backoff、dead-letter、event ID による冪等性、queue depth/oldest age/error の監視を実装前 ADR で確定する。

#### [Critical] 新 DB 方式で cutover 後に旧 DB へ戻すと新規書き込みを失う

- 該当箇所: 旧計画の新 DB + ETL 方針における「dual-write は採用しない」「旧 DB を read-only 保持して切り戻す」という組み合わせ
- 根拠: 新系で受け付けた登録、申請、審査を旧 DB に戻す reverse ETL/change journal が存在しない。
- 再現条件: cutover 後に新系で 1 件以上更新し、その後 DNS/container を旧系へ戻す。
- 影響: 新系で成功した書き込みが利用者から見えなくなり、再処理や手作業復旧で二重更新・監査欠落を生む。
- 推奨方針: 新系が最初の書き込みを受理する時点を point of no return とする。書き込み前は旧系へ full rollback、書き込み後は原則 roll-forward とする。書き込み後の rollback が必須なら、append-only change journal と reverse ETL を別途実装・リハーサルする。

#### [Warning] 長期 branch と stage/CI の成立条件が不足している

- 該当箇所: `.github/workflows/user-code-quality.yml`、`compose.stage.yml`、`cloudflare/stage/config.yaml`、旧計画の `refactor/v1-architecture` 長期運用
- 根拠: user CI は主に `gm3/develop` 向け PR を対象とし、stage の Cloudflare 設定が参照する user service を `compose.stage.yml` では確認できない。別の stage 配備経路は未確認。
- 影響: 長期 branch が production との差分を蓄積し、最終 merge と同時 cutover で初めて統合不具合が顕在化する。
- 推奨方針: 短命 PR、feature flag、vertical slice、常時 trunk 統合を基本にする。長期 branch が不可避なら、merge-forward 頻度、hotfix 取り込み SLA、required checks、専用 stage、競合解消責任者を明記する。

#### [Warning] API consumer 未確認のまま `/api/v1` を再利用できない

- 該当箇所: `api/config/routes.rb`、`api/oas_docs`、旧計画の `/api/v1` 再定義
- 根拠: 外部利用者が存在しないことはリポジトリから確認できない。
- 影響: 運用 script、他 repository、Spreadsheet/BI 等が存在した場合、同じ version の破壊的変更で停止する。
- 推奨方針: 新契約は `/api/v2` に置き、access log、他 repository、運用 script、Spreadsheet/BI、Webhook を Phase 0 で探索する。state-changing consumer は cutover 前に移行し、consumer が残る未バージョン API/旧 `/api/v1` は read-only 互換 facade として維持して owner、利用数、廃止期限を持たせる。同じ `/api/v1` を破壊的に再定義しない。

## 6. 理想構成案

### 6.1 アーキテクチャ決定とデプロイ単位

Rails API は、標準 Rails の規約を各モジュール内部で利用する、境界強制されたモジュラーモノリスとする。実行時は単一 Rails application/deployable と共有 MySQL DB を維持する。web と background worker は同じ code/versioned artifact から別 process/container として起動できるが、業務モジュール自体を別 service、別 DB、network API に分割しない。

モジュール化の成立条件を次のとおり固定する。

1. 業務モジュールごとに所有するテーブル、状態、不変条件、ユースケースを定義する。
2. 他モジュールから利用できる定数・Command・Query・Event を `public` API として明示する。
3. 他モジュールの内部 Model、内部 Query、所有テーブルへ直接アクセスしない。
4. `package.yml` で許可依存を列挙し、依存グラフを非循環に保つ。
5. 境界検査 tooling は Ruby/Rails の目標 version と一体で選定・固定する。推奨は supported Ruby/Rails へ先に更新し、互換性を確認した [Packwerk](https://github.com/Shopify/packwerk)、[packwerk-extensions](https://github.com/rubyatscale/packwerk-extensions)、[packs-rails](https://github.com/rubyatscale/packs-rails) の version を lockfile で固定する構成とする。
6. Packwerk 構成を採用する場合、新 package は `enforce_dependencies: strict` と `enforce_privacy: strict` を必須にし、公開定数は `app/public` に限定する。`bin/packwerk validate` と `bin/packwerk check` を CI gate にする。
7. runtime 更新を行わず 3 gem の互換構成を成立させられない場合は、検証済み Packwerk core、明示的な Zeitwerk path、独自 privacy/architecture test の代替案を ADR で選択する。version 未固定の gem 導入と、未検証の古い gem への固定は認めない。
8. Packwerk は定数依存の検査であり、動的呼び出し、メソッド呼び出し、Arel、文字列 SQL、テーブル越境を完全には検出しない。AST lint、禁止 API、table ownership test、integration test、コードレビュー、必要に応じた DB 権限を組み合わせる。
9. routes、HTTP Controller、API BaseController は Rails host の presentation adapter として公開し、package 内部の private Controller を root から動的参照しない。
10. Rails Engine は独立 mount、独立配布、独立 lifecycle が必要になった場合だけ検討し、初期構成では採用しない。

```text
api/
  package.yml                       # root/host package。全業務 pack の public API のみ利用
  packwerk.yml                      # Packwerk 構成を採用した場合の packs path/extension
  app/                              # Rails host、boot/routes、HTTP adapter、cross-pack orchestration
    controllers/api/v2/             # 新契約の薄い presentation adapter
    serializers/api/v2/             # HTTP response adapter
    orchestrators/                  # ADR 承認済みの cross-module workflow のみ
  packs/
    <module>/
      package.yml                    # strict dependency/privacy、owner、許可依存
      app/public/<module>/           # 外部 package から参照可能
      app/commands/<module>/
      app/queries/<module>/
      app/models/<module>/
      app/policies/<module>/
      app/serializers/<module>/
      app/jobs/<module>/
      test/<module>/
    platform_core/                  # Error/Result/Event/Clock/RequestContext/outbox/audit
    identity_access/                # User/Role/UserDetail/session/auth
    festival_configuration/         # FesYear/FesDate/category/page settings
    participation/                  # Group/membership/representative/contact
    applications/                   # 会場・ステージ・電力・食品・広報等の申請
    inventory_allocation/           # rental request/stock/assignment
    program_allocation/             # 会場・ステージ・識別番号の割当
    review_workflow/                 # review/status/comment/resubmission
    communications/                 # mail/Slack/message template/delivery status
    reporting/                      # dashboard/CSV/PDF read models

frontend/
  package.json                       # workspace 共通 script。業務 runtime code は置かない
  pnpm-workspace.yaml                # apps/*, packages/*
  pnpm-lock.yaml                     # workspace 全体で 1 つ
  apps/
    user/                            # 参加団体向け Next.js / group-manager.nutfes.net
    admin/                           # 管理者向け Next.js / group-manager-admin.nutfes.net
  packages/
    api-client/                      # subpath export: browser-safe types / server-only Rails client
    auth/                            # opaque BFF session/CSRF primitive。server/browser entry を分離
    ui/                              # 共通 React UI primitive。業務 UI は各 app
    design-tokens/                   # color/spacing/type/radius/focus/z-index
    validation/                      # 共通 DTO/schema と server error mapping
    config/                          # lint/tsconfig/i18n 共通設定
```

Packwerk 構成を採用した場合、`platform_core` 以外の新 package の `package.yml` は次を標準形とする。

```yaml
enforce_dependencies: strict
enforce_privacy: strict
public_path: app/public
dependencies:
  - packs/platform_core
metadata:
  owner: <team-or-role>
```

`platform_core/package.yml` の `dependencies` は空にする。root の `api/package.yml` は全業務 pack を許可依存として列挙するが、どの pack からも root を依存先にしない。認証へ依存しない `ApplicationRecord`, `ApplicationJob`, `ApplicationMailer` 等の基底定数は `platform_core/app/public` が所有できる。一方、認証済み actor を必要とする API BaseController は Rails host が所有し、`identity_access` の public session/ActorContext API を呼ぶ。これにより `platform_core -> identity_access` の逆依存を作らない。

Packwerk + `packwerk-extensions` + `packs-rails` の互換構成を採用した場合、`api/packwerk.yml` は少なくとも次を固定する。代替 tooling を選んだ場合は、同じ依存・privacy 規則を対応する設定と architecture test で表現する。

```yaml
package_paths:
  - .
  - packs/*
require:
  - packwerk-extensions
```

各 Rails package の `app/public` だけを外部公開し、Command/Query/Policy/Model/Job の実装は原則として所有 pack 内に置く。Rails host の Controller/Serializer は薄い HTTP adapter とし、package の public Command/Query/DTO だけを利用する。global な業務 `app/commands`, `app/queries`, `app/services` は作らない。`package.yml` は owner metadata、strict dependency/privacy enforcement、許可依存だけを持つ。`platform_core` は業務概念や汎用 Service の置き場にせず、全モジュールが必要とする最小限の技術プリミティブと outbox/audit の技術レコードだけを所有する。

user と admin は、同一 Git repository・同一 pnpm workspace 内の別 Next.js app とし、別 container・別 subdomain・別 deploy を維持する。共通化は単一 Next.js app への統合ではなく workspace package で行う。これは presentation、browser origin、bundle、release、障害範囲の境界であり、Rails の業務モジュール境界または認可境界ではない。同じ業務ルールを user/admin に複製せず、両方の presentation adapter が同じモジュール public API を呼ぶ。Nuxt 2 管理画面と Nuxt 3 旧画面は機能移行完了後に削除する。

### 6.2 ADR-FE-001: 単一 workspace・2 Next.js app・2 origin

Status: **Accepted**

#### Context

「Git repository を 1 つにすること」「Next.js app/build を 1 つにすること」「deploy を 1 つにすること」「URL origin を 1 つにすること」は別の設計判断である。現行 production は `group-manager.nutfes.net` と `group-manager-admin.nutfes.net` を別 service/container へ割り当てている。Nuxt 2 管理画面の Next.js 移行だけでも大規模であり、同じ変更で URL、DNS、Cookie、既存 bookmark、release/rollback 単位まで統合しない。

#### Decision

- user: `https://group-manager.nutfes.net` を `frontend/apps/user` へ割り当てる。
- admin: `https://group-manager-admin.nutfes.net` を `frontend/apps/admin` へ割り当てる。
- app ごとに別 Docker image、container、health check、deploy、rollback、runtime secret を持つ。
- 共通 package は workspace source として参照し、private npm registry への publish を必須にしない。
- app 固有変更は対象 app だけを build/deploy できる。`packages/**`、workspace manifest、lockfile、OpenAPI 契約の変更時は両 app を test/build する。
- migration cutover 時だけ API/user/admin を協調 release し、通常運用では user/admin を独立 release できる。
- 既存 user の Pages Router を workspace 化と同時に一括 App Router 化しない。admin の新規実装方式と、両 app が利用する supported Next.js major は Phase 0 の ADR で固定する。

#### 不採用案と再検討条件

| 案 | 今回採用しない理由 | 再検討条件 |
|---|---|---|
| 1 Next.js app + `/admin` | 同一 origin/build/deploy/rollback となり、Nuxt 移行に URL、Cookie、DNS、既存リンクの変更まで追加する | 同一 origin SSO、共通 navigation、常時一体 release が必須要件となった場合 |
| 1 Next.js build + host-based routing | runtime、secret、release、障害範囲を共有したまま host 判定、cache key、canonical redirect の責任が増える | 単一 runtime が運用上の明確な必須条件になった場合 |
| 2 app + 同一 domain の Multi-Zones | reverse proxy、asset prefix、zone 間 hard navigation が増え、現行 subdomain を捨てる利益がない | `/admin` URL が外部要件として必須になった場合 |
| user/admin を別 Git repository | shared UI、生成 client、API 契約の atomic な変更と version 管理が複雑になる | team、repository ACL、release ownership、lifecycle が実際に分離された場合 |

#### Workspace の依存規則

許可する依存 DAG を次に固定し、`packages/* -> apps/*` と package 間の循環を禁止する。

```text
apps/user, apps/admin
  ├─> auth
  ├─> ui ─> design-tokens
  ├─> validation ─> api-client/types
  ├─> api-client/types
  └─> config

auth/server ─> api-client/rails-server ─> api-client/types
```

- `@gm/api-client/types` は browser-safe な DTO/schema/type だけを export する。
- `@gm/api-client/rails-server` は Rails API URL、upstream credential、server HTTP client を持つ `server-only` export とし、BFF/Server Component 以外から import できない。
- browser 側は app-local な same-origin BFF client だけを利用し、生成 Rails client や Rails API URL を直接参照しない。
- `packages/ui` は `design-tokens` 以外の認証、API client、Next.js router、業務 feature に依存しない。
- `packages/auth` は server-only session adapter と browser-safe な CSRF/session status 型を分離し、server secret と Rails credential を Client Component から import できないようにする。
- 共有 package へ移すのは、両 app で同じ意味、操作、accessibility contract を持つことが確認された primitive に限る。業務 page、業務 hook、審査/申請 modal の内容、permission 判断は各 app が所有する。

#### BFF と session 境界

通信経路は `Browser -> 各 Next.js app の same-origin BFF -> Rails API` に統一する。Rails の `access-token`, `client`, `uid`、API credential を browser session response、JavaScript、`localStorage`、client log へ公開しない。

| app | Cookie 名 | 対象 host |
|---|---|---|
| user | `__Host-gm-user-session` | `group-manager.nutfes.net` |
| admin | `__Host-gm-admin-session` | `group-manager-admin.nutfes.net` |

- Cookie は `HttpOnly; Secure; SameSite=Lax; Path=/` とし、`Domain` 属性を設定しない。
- session 暗号化 secret、Cookie 名、CSRF token、CSP を app ごとに分離し、親 domain Cookie による session 共有を禁止する。
- Cookie には暗号化済み Rails token ではなく、十分な entropy を持つ opaque random session ID だけを保存する。server-side session store は user/admin audience、actor ID、upstream credential、idle/absolute expiry、rotation version、`revoked_at` を保持する。保存先、暗号化、バックアップ、可用性は Phase 0 の ADR で固定する。
- login と権限変更時に session ID を rotate し、logout、password 変更、role/capability 剥奪時に関連 session を即時 revoke する。idle/absolute timeout と upstream token 更新失敗は fail-closed とする。
- state-changing BFF endpoint は CSRF token と完全一致する `Origin`/`Host` allowlist を検査する。subdomain 分離は defense-in-depth であり、認可または CSRF 検査の代替にはしない。
- user BFF は参加団体向け capability だけを受け付け、admin BFF は session 確立時と各 protected request で admin capability を検査する。Rails API でも全 request を default-deny Policy で再検査する。
- consumer discovery で外部 consumer がゼロなら、BFF 移行完了後に公開 Rails API hostname と browser CORS を廃止し、BFF は service network で Rails へ接続する。外部 consumer が存在する場合は、consumer 専用認証、rate limit、version policy を持つ public gateway を維持するが browser CORS は無効化する。どちらの場合も browser から公開 Rails API へ credential 付きで直接通信できないことを疎通テストする。
- 将来 SSO が必要な場合は `.nutfes.net` 共有 Cookie ではなく、中央認証 endpoint/IdP への redirect flow を別 ADR で設計する。

#### 共通デザインシステムと app 固有 UI

user/admin で別デザインシステムを新設せず、`packages/design-tokens` を semantic token schema の正本、`packages/ui` を共通 accessibility/interaction primitive の正本とする。移行期間は `--color-action-primary`、`--radius-control`、`--density-table` 等の同一 schema に対し、app root が `user-theme.css` と `admin-legacy-theme.css` の value map を適用して既存外観を再現する。Button へ role prop を渡して theme を切り替えない。Next.js 移行と視覚的 redesign は同時に行わず、brand palette の統一は value map だけを変更する別の承認済み scope とする。

`packages/ui` は Button/IconButton、Dialog/AlertDialog、Input/Select/Checkbox、FormField/ValidationMessage、Toast、Loading/Error/Empty state、Pagination、Table の基礎 primitive を所有する。Button は利用者 role ではなく操作の意味で表現する。

```tsx
<Button intent="primary" appearance="solid" size="md" loading={saving}>
  保存
</Button>

<Button intent="danger" appearance="outline" size="sm">
  削除
</Button>
```

`role="user" | "admin"`、`isAdmin`、`userColor` のような primitive prop を禁止する。role/capability 判定は app の feature/action 層で行う。業務上固有の操作は `AdminButton` ではなく `ApproveApplicationButton` のような feature component が共通 Button を利用する。Dialog primitive は `role="dialog"`/`aria-modal`、title/description、initial focus、focus trap、Escape、focus restoration、scroll lock を一元管理し、申請編集、審査、割当等の内容と mutation は各 app が所有する。

### 6.3 モジュール所有権と依存方向

| モジュール | 所有する主なデータ・責務 | 許可する業務依存 |
|---|---|---|
| Rails host/root | boot、routes、API BaseController、HTTP Controller/Serializer adapter、承認済み cross-module Orchestrator | 全 pack の public API。どの pack からも依存禁止 |
| `platform_core` | Error/Result、Domain Event port、Clock、Request Context、認証非依存の Rails 基底、outbox/audit の技術レコード | なし |
| `identity_access` | users、roles、user details、session、認証・権限能力 | `platform_core` |
| `festival_configuration` | festival years/dates、categories、受付設定 | `platform_core` |
| `participation` | organizations、festival participations、organization/participation memberships、代表/副代表、連絡先 | `platform_core`, `identity_access`, `festival_configuration` |
| `applications` | 会場・ステージ・電力・食品・調理工程・広報・会場図・火気等の application case、submission version、deputy/product effective/dependency projection | `platform_core`, `participation`, `festival_configuration` |
| `inventory_allocation` | rental submission detail、rental catalog、stock、貸出場所、割当、不足数、在庫競合 | `platform_core`, `applications`, `participation`, `festival_configuration` |
| `program_allocation` | places/stages、識別番号、会場・ステージ割当 | `platform_core`, `applications`, `participation`, `festival_configuration` |
| `review_workflow` | submission version/明細ごとの `pending/in_review/approved/changes_requested/rejected`、comment、review case/item | `platform_core`, `applications`, `inventory_allocation`, `participation`, `identity_access` |
| `communications` | mail/Slack 配信、message templates、配信状態 | `platform_core`, `identity_access`, `participation`, `applications`, `inventory_allocation`, `program_allocation`, `review_workflow` |
| `reporting` | dashboard、CSV/PDF、横断 read model | `platform_core`, `identity_access`, `festival_configuration`, `participation`, `applications`, `inventory_allocation`, `program_allocation`, `review_workflow` |

許可依存は表の方向だけとし、逆依存と循環依存を禁止する。例えば `Participation::FestivalParticipation` から Applications、Inventory Allocation、Program Allocation の Active Record Model への reverse association は持たせない。各 owner 側が `festival_participation_id` を保持し、Participation の public Query/Reference を介して存在と権限を確認する。年度を跨ぐ identity は `organizations`、年度内の申請・割当 owner は `festival_participations` に分離する。共通 application case/submission lifecycle は `applications`、貸出申請の typed detail/catalog/在庫/割当は `inventory_allocation` が所有する。Inventory は Applications の公開 submission ID/DTO に一方向依存し、Applications は Inventory を参照しない。会場・ステージ申請 detail は `applications`、実際の場所・時間・識別番号の割当は `program_allocation` が所有する。Communications は各 module の public Event を購読するが、publisher から Communications への依存は禁止する。Reporting は各 module の public Query/DTO、または Reporting 自身が Event から構築した projection だけを読む。

上表は初期仮説であり、Phase 0 の代表ユースケース、変更頻度、transaction、不変条件、owner の棚卸し後に確定する。特に `applications`/`review_workflow`、`festival_configuration`/`program_allocation` は状態所有と依存方向を vertical slice で検証する。schema または package を作成した後に境界を正当化する順序にはしない。Model ごとの細分化は避け、分割は独立した不変条件、公開 API、別 owner、分割後に減少する依存が確認できる場合だけ ADR で決定する。

```text
HTTP Controller / Job / CLI
          │
          ▼
Module Public API (Command / Query / Event / Value Object)
          │
          ▼
Module Internal Application Layer (Policy / Use case / Transaction)
          │
          ▼
Module-owned Domain / Active Record / Adapter

Module A ──X──> Module B internal constant / table
Module A ─────> Module B public API                  # 許可依存のみ
```

- Rails host の Controller は他 Controller を呼ばず、module public API だけを呼ぶ。
- 他モジュールの Model を直接 `find` せず、public Query/Reference を利用する。
- Model から Controller helper、Serializer、他モジュールの内部定数を参照しない。
- 認可は各モジュールの Policy/Scope に置き、actor/capability は `identity_access` の public context から受け取る。
- transaction は原則として所有モジュールの Command が保持する。`SaveApplicationDraft`, `SubmitApplication`, `ApproveApplication`, `ApplyGroupProductRevision`, `WithdrawSubmission`, `CancelApplicationCase` のように複数モジュールをまたぐ強整合 workflow は host の明示 Orchestrator だけに許可し、固定 lock 順序、全 owner rollback、ADR、integration test を必須にする。Orchestrator も各 package の public API だけを呼び、内部 Model や所有テーブルへ直接触れない。
- モジュール間の副作用は `platform_core` の public Domain Event/outbox API を標準とする。業務 transaction 内で outbox record を原子的に作成し、`communications` 等の subscriber が非同期に処理する。publisher は subscriber に依存せず、owner 外から outbox table を直接書き込まない。
- Repository pattern は Active Record の単純な置換としては導入しない。外部モジュールには Active Record Relation を返さず、DTO/Value Object/ID を返す。
- 選択した境界検査の violation/todo は legacy root package の移行期間だけ許可し、owner と解消期限を必須にする。新 package での追加は禁止し、最終 cutover 条件を violation/todo ゼロとする。

### 6.4 新 API 契約

- 新 API は resource と presentation scope を基準に再定義する。`me`/`admin` は HTTP 上の認可・利用者境界であり、Rails package の境界にはしない。
- `/api/v2/me`, `/api/v2/me/festival-participations/:festival_participation_id/...` は本人/所属する年度参加用。URL の ID は権限根拠にせず、active `participation_membership` scope 内から取得する。
- `/api/v2/admin/...` は管理者用で、全 endpoint が admin policy を通る。
- BFF 向け canonical auth は `POST /api/v2/auth/sessions`、token rotation、current session revoke、password reset request/confirmation、`PATCH /api/v2/me/password` に分ける。opaque Rails token は BFF の server-side session store だけに置き、audience は trusted BFF identity から server-side に決める。
- 現行 `/api/auth/*` は Phase -1 で安全化する legacy auth contract とし、新 BFF は使用しない。旧 user/admin 切替後に廃止し、外部 consumer は user session ではなく専用 gateway credential を使う。
- user/admin 向けの Rails host HTTP adapter は、重複した業務処理を持たず、対応する業務モジュールの同じ public Command/Query を利用する。
- 一覧は filter/sort/pagination を query parameter で受ける。
- mutation は idempotency key と optimistic version を必要な resource に導入する。
- OpenAPI が request/response/error/nullable/enum の単一情報源になり、両 Next app の型を生成する。spec lint、breaking-change diff、生成 client の差分検査を CI gate にし、現行の routes 起点 OAS 生成は contract parity を確認してから廃止する。
- 新契約は `/api/v2` とする。全 state-changing consumer は cutover 前に移行し、未バージョン API と既存 `/api/v1` の compatibility facade は read-only に限定する。facade は legacy ID alias を変換し、owner と廃止期限を持ち、旧 client/外部 consumer の利用ゼロを確認してから削除する。同じ `/api/v1` を破壊的に再定義しない。

### 6.5 認証・認可

- 6.2 の app 別 same-origin BFF、host-only HttpOnly/Secure/SameSite session、別 secret/CSP/CSRF を標準とし、Rails token をブラウザへ公開しない。
- Rails は全 endpoint を認証必須とし、sign-in、password reset request 等だけを公開 allowlist にする。
- `role_id` ではなく安定 role key/capability を使う。
- 「管理者」「実行委員の限定権限」「参加団体代表」「未認証」を Policy で表現する。
- 団体 resource は `current_user` の membership/ownership scope を必須にする。
- ロール変更、パスワードリセット、削除、メール送信、CSV/PDF export は監査ログ対象にする。

### 6.6 DB

- production と分離した stage の新 DB に target schema を構築し、旧 DB から再実行可能な ETL で移行する方式を採用する。旧 DB/新 DB への dual-write は行わず、production cutover は maintenance、旧系 write-disable、final ETL/reconcile、新系 write-disabled smoke test、write-enable の順とする。詳細と正本は [database-redesign-and-migration-plan-2026-07-15.md](./database-redesign-and-migration-plan-2026-07-15.md) に置く。
- 主要 entity は `users`, `roles`, `organizations`, `festival_participations`, `organization_memberships`, `participation_memberships`, `festival_years`, 各 application resource、inventory/allocation、program allocation、submission/review、notifications/deliveries に整理する。`outbox_events` と `audit_events` は `platform_core` が所有する技術テーブルとする。
- 全テーブルに owner module を一つだけ割り当て、他モジュールからの直接 SQL、Active Record Model 参照、書き込みを禁止する。共有物理 DB は共有所有権を意味しない。
- 外部キーによる参照整合性はモジュール間でも維持するが、参照先の状態確認と更新は owner の public API を通す。
- cross-module foreign key は参照整合性のためだけに許可し、書き込み権限を意味しない。owner 外からの `INSERT/UPDATE/DELETE` と cross-module cascade delete を禁止し、削除連携は明示 workflow または Domain Event で行う。
- 既存 `api/db/migrate`/`schema.rb` は legacy DB 専用として凍結し、新 DB migration は `api/db/target_migrate`/`target_schema.rb` と専用 connection/task へ分離する。target task は legacy schema/URL への誤適用を実行前に拒否し、CI で negative test する。target migration は owner metadata を持ち、複数 owner のテーブルを同時変更する場合は ADR と rollback rehearsal を必須にする。
- Ruby の業務定数と Active Record Model は必ず module namespace に入れる。DB table 名は `users`, `organizations`, `festival_participations` 等の業務名を維持し、module prefix は付けない。Rails の推論と異なる場合は owner Model で `self.table_name` を明示し、table ownership manifest を所有権の正本とする。
- `user_id` を団体所有者に直結させるだけでなく、membership で複数担当・履歴・権限を表現する。
- `applications` は団体×年度×申請要件ごとに一つの application case を持ち、current draft と複数の submission version を正本として持つ。submitted payload snapshot は immutable、withdraw/cancel は lifecycle metadata/event とする。提出回答は `provided/no_request`、対象性は case の `required/optional/not_applicable` で表し、未着手を row の欠落や negative table で代用しない。
- `review_workflow` は submission version/明細ごとの `pending/in_review/approved/changes_requested/rejected` と comment を正本として持つ。参加団体が再提出する場合は `applications` が新しい submission version を作り、`review_workflow` がその version に新しい review case/item を開始する。画面用の総合状態は projection として導出し、同じ状態を両 module の write model に複製しない。
- `un_registered_groups` は廃止し、既存の「申請しない」という意味を `response_kind = no_request` の submission version へ移行する。positive/negative の同時存在、重複、placeholder は ETL reject/個別変換規則で扱い、黙って補正しない。
- 提出履歴と反復可能な申請明細は 1:N、user profile や version ごとの scalar detail は 1:1 とし、1:1、自然キー、重複不可、非負数量を DB 制約で保証する。既存 `has_one` を機械的に全て複数化しない。
- 提出済み業務データは物理削除せず、取消/アーカイブと監査履歴を基本とする。

### 6.7 エラー・ログ・外部 I/O

- Domain error、validation、authentication、authorization、not found、conflict、rate limit、external failure を共通 code にする。
- 利用者向け message は i18n key から表示し、内部例外・SQL・外部 API 応答は返さない。
- log は request ID、actor ID、role、resource、action、result、latency を構造化し、token/PII を redact する。
- Slack/SMTP/DeepL は adapter 経由にし、timeout/retry/circuit breaker を統一する。
- 通知系は `platform_core` 所有の outbox、`communications` 所有の配信状態、durable queue/worker、background job、idempotency key で部分失敗を管理する。
- queue adapter、worker image/service、outbox dispatcher、retry/backoff、dead-letter、poison message 隔離を ADR で固定する。event ID を配送の冪等性キーとし、queue depth、oldest event age、retry/dead-letter count を監視する。web process 内の非 durable な非同期実行だけで完了とみなさない。

## 7. 段階的実行プラン

### Phase -1: 現行 production の P0-S 緊急封じ込め

全面改修、新 API、新 DB を待たず、現行系へ最小限の安全修正を独立 deploy する。

1. 対象 route の直近 access log、現行 user/admin の呼び出し元、公開 allowlist を確認し、正常利用の最小 characterization/smoke test を先に作る。全面的な consumer discovery は Phase 0 で継続する。
2. 公開 registration/create の入力契約から `role_id` を除外し、一般ユーザー権限をサーバー側で固定する。
3. `PUT/DELETE /users/:id`、任意ユーザーの role/password 更新、認証のない CRUD/Admin API に認証・本人性・団体 ownership・管理 capability を追加する。危険かつ未使用の route は閉鎖する。
4. 本番用 fixture の固定管理者資格情報について投入履歴と有効性を確認し、資格情報ローテーション、全 token/session 失効、アクセス履歴確認を行う。production seed から固定資格情報を排除する。
5. public runtime config の secret 候補、認証 token/user object の client log、本番 debug log を除去または redact する。
6. endpoint × role × ownership の request spec を追加し、未認証 401、越権 403/404、管理操作の監査記録を固定する。
7. stage/canary で現行 user/admin の login、登録、主要申請、管理操作を smoke test してから段階 rollout する。正規利用を停止する場合は直ちに切り戻せる image/config を用意する。ただし既知の権限昇格経路を再開する rollback は行わず、安全な forward fix を優先する。
8. hotfix を trunk へ統合し、後続の全 refactor branch/PR が同じ修正を含むことを CI と merge 規則で保証する。

完了条件: 本文の認証・認可・既知資格情報に関する `P0-S` が現行 production で閉じ、request spec、token 失効、監査確認が完了している。リスク受容だけで Phase -1 を省略しない。

### Phase 0: 基準線・consumer discovery・ADR

1. 開発は短命 PR、feature flag、vertical slice、`gm3/develop` への継続統合を基本とする。長期 branch が不可避な場合だけ、merge-forward 頻度、hotfix 取り込み SLA、required checks、専用 stage、競合解消責任者を ADR に定義する。
2. production-like stage に、現行 API/user/admin を配備できることを確認し、将来の新 user/admin、worker、新 DB/queue に必要な network、secret、health check、image/deploy job の template と owner を定義する。未実装の target image/service をこの Phase で配備済みとは扱わない。`compose.stage.yml` 以外の配備基盤が存在する場合は、その実設定と owner を確認する。
3. 次の ADR を確定する。
   - supported Ruby/Rails の目標 version、更新順序、Packwerk 関連 gem の固定 version または代替 tooling
   - 単一 Rails application・単一デプロイ・共有 DB のモジュラーモノリス
   - 仮の業務モジュール、状態/テーブル owner、public API、許可/禁止依存
   - Rails host が routes/HTTP adapter/API BaseController を所有する境界
   - ADR-FE-001 の単一 workspace・2 Next.js app・2 subdomain・独立 deploy
   - OpenAPI-first への移行手順と API version 方針
   - app 別 BFF、opaque server-side session store、rotation/revocation/timeout、CSRF/CSP、Rails API ingress
   - durable queue/worker/outbox、retry、dead-letter、監視
   - 新 DB + ETL の target schema、必要計測、RPO/RTO、maintenance 上限、point of no return、pre-write rollback/post-write roll-forward 方針
4. module catalog、非循環 dependency graph、table/state ownership matrix、route × role × ownership の認可表、画面/機能 parity 表、data dictionary を作る。
5. 現行 API の characterization test と主要 E2E を追加し、意図的変更と事故を区別できる状態にする。
6. 実データ件数、null、orphan、duplicate、最大文字数、主要 query、ETL 見積もりを read-only profiler で集計する。
7. API access log、他 repository、運用 script、Spreadsheet/BI、Webhook を調査し、外部 consumer 一覧と owner を作る。

完了条件: 全 endpoint、画面、テーブル、主要状態とユースケースに仮 owner があり、境界を代表 vertical slice で検証できる。API consumer、runtime/tooling、stage、queue の blocker がなく、新 DB schema/ETL/rehearsal に必要な実測入力と業務上の変換規則が揃っている。

### Phase 1: Runtime・tooling・stage・CI の前提整備

1. Ruby/Rails を ADR の目標 version へ段階的に更新する。各段階で production boot、Zeitwerk、Devise Token Auth、migration、CSV/PDF、mail/Slack、既存 characterization test を検証する。
2. compatibility spike で確認した Packwerk 関連 gem または代替 tooling を固定 version で導入する。`RAILS_ENV=production bin/rails zeitwerk:check` と選択した dependency/privacy check を実行する。
3. root と pack 内の Minitest が全て発見される sentinel test を作り、legacy violation には owner と期限を付ける。新 package の violation/todo は禁止する。
4. 現行 API/user/admin を stage へ配備し、新 user/admin/worker/DB 向けには再利用可能な build/deploy job、network、secret、health check の template を検証する。実 image/service は各実装 Phase で初めて配備する。lint、typecheck、test、build、image build、dependency/security scan を required check にし、CI は format/lint 結果を commit/push しない。
5. trunk/hotfix が全作業へ取り込まれることと、app ごとの deploy/rollback jobが成立することを確認する。

完了条件: 目標 runtime 上で現行アプリが production mode で boot し、選択した境界検査、全テスト、stage deploy が再現可能である。

### Phase 2: モジュール境界・API契約・運用interfaceのスパイク

この Phase は target schema 実装前のため、永続化実装、production migration、auth/outbox table を作らない。破棄可能な spike と interface/contract の検証に限定する。

1. Rails host、`platform_core`、`identity_access`、`festival_configuration` の package skeleton を使い、HTTP adapter と package public API の境界を検証する。
2. `package.yml`、`app/public`、許可依存、dependency/privacy check、AST/table ownership test を CI gate にする。root Controller から package 内部定数・所有テーブルを直接参照しない。
3. `/api/v2` の OpenAPI contract、lint、breaking diff、生成 types の流れを検証する。consumer discovery の結果に基づき、HTTP verb でなく副作用から state-changing consumer を分類して移行計画を作る。残存 read consumer には未バージョン API/旧 `/api/v1` ごとの read-only compatibility facade、legacy ID alias、到達可能な target cardinality の互換証明または server-side cap/error handling E2E、廃止期限を決める。DB に依存する target Controller/Command はまだ実装しない。
4. BaseController、ErrorSerializer、request ID、default-deny Policy/Scope、pagination、idempotency、optimistic version の interface と error contract を定義する。
5. Domain Event/outbox/audit port、queue/worker/dispatcher、retry/dead-letter/idempotency/監視の interface と failure scenario を定義し、in-memory または disposable store の spike で境界だけを検証する。
6. health/readiness、error tracking、構造化 log/redaction の非永続部分と受入契約を定義する。

完了条件: 選択した境界検査と OpenAPI/type 生成が成功し、package public API、HTTP/error/auth port、outbox/worker port の依存方向が DB 非依存のテストで確認できる。target DB table、production migration、永続 auth/outbox 実装は Phase 3 より前に作成しない。

### Phase 3: 新 DB schema と ETL/reconcile

1. [database-erd-current-and-target-2026-07-15.md](./database-erd-current-and-target-2026-07-15.md) と [target-database-proposal-2026-07-15.erd.mmd](./target-database-proposal-2026-07-15.erd.mmd) の application requirement/case/submission/review、typed detail、membership、audit/outbox を target schema と table/state ownership matrix に固定する。
2. target MySQL 8.4 LTS の patch/image digest を固定し、FK、NOT NULL、UNIQUE、CHECK、index、optimistic locking、submitted payload の immutable 性と lifecycle metadata の許可変更だけを migration/application test で保証する。
3. ETL を extract、raw staging、normalize、validate、load、reconcile に分け、同じ snapshot から空の新 DB へ何度でも再実行可能にする。source/target ID mapping と checksum を保持する。
4. `un_registered_groups` の negative answer、positive/negative 同時存在、duplicate、火器 placeholder、審査 status 不整合、`has_one` duplicate、orphan/invalid を明示規則または reject report で処理し、黙って補正しない。
5. 件数、FK、自然キー、申請状態、submission/review 対応、数量集計、添付 checksum、主要画面 payload を旧/new DB 間で照合し、本番相当 snapshot で ETL と maintenance の所要時間を測る。
6. dual-write/reverse ETL を採用しないこと、最初の新規 write 前だけ旧系へ full rollback できること、最初の write 後は新 DB を保持して roll-forward することを runbook と rehearsal で固定する。

完了条件: target schema と ETL/reconcile が本番相当データで複数回再現でき、unresolved reject と不整合がゼロであり、全 source PK が mapped または owner 承認済み excluded の disposition を持つ。owner 不明テーブルと状態の二重所有がなく、新規コードによる owner 外 write がない。legacy root の既存越境 write は owner と Phase 4 での解消期限を inventory に記録する。

### Phase 4: Platform と業務 API の vertical slice 移行

依存順の仮説（`platform_core` / `identity_access` / `festival_configuration` → `participation` → `applications` / `inventory_allocation` → `program_allocation` / `review_workflow` → `communications` / `reporting`）を、slice ごとに検証しながら移行する。順序は「owner/schema → public API → internal command/query → policy → host HTTP adapter → request/architecture test → OpenAPI」とする。

1. `platform_core` / `identity_access`: Phase 3 の新 DB schema 上に auth/session/audit の target 永続化を実装し、auth/me/admin user を最初の vertical slice とする。Phase -1 の安全性、default-deny、rate limit、health/readiness、error tracking、構造化 log/redaction を固定する。
2. outbox/worker 基盤: 新 DB/選択 queue 上に outbox/audit table、durable worker、dispatcher、retry/dead-letter/idempotency/監視を end-to-end で実装する。
3. `participation`: 団体、membership、代表/副代表、連絡先
4. `applications`: application case、`draft/submit/withdraw`、`provided/no_request`、immutable payload snapshot と lifecycle event
5. `inventory_allocation`: 貸出物品、貸出申請、在庫、割当、競合制御、非負制約
6. `program_allocation`: 会場・ステージ・識別番号の割当と競合制御
7. `review_workflow`: submission version/明細ごとの review case/item、comment、`pending/in_review/approved/changes_requested/rejected`
8. `communications`: mail/Slack、template、配信状態。outbox の public API と durable worker を利用する
9. `reporting`: dashboard、CSV/PDF/export。重い横断 query は reporting-owned projection と Job/期限付き download を利用する

完了条件: auth/outbox を含む各 module の認可、状態遷移、transaction、冪等性、並行実行、正常/再試行/重複/dead-letter/異常系が自動テストされる。依存グラフは非循環で、legacy root を含め、他 module の内部定数・所有テーブルへの既存/新規の直接参照と越境 write がない。

### Phase 5: Frontend workspace と参加団体 Next.js の再構成

1. `frontend/` に単一 pnpm workspace と単一 lockfile を作り、既存 user を `apps/user` へ移す。
2. `packages/api-client/auth/ui/design-tokens/validation/config` を導入し、6.2 の許可 DAG、`packages -> apps` 禁止、循環禁止を ESLint と CI で強制する。
3. 既存 user の Pages Router は一括して App Router へ変更せず、workspace 化、BFF 化、feature 分割を先に完了する。shared package は Pages/App Router 固有 API を持たない。
4. BFF/Server Component は `@gm/api-client/rails-server`、browser は app-local な same-origin BFF client と `@gm/api-client/types` を利用する。legacy fetcher と browser から Rails への直接通信、client-visible Rails token/Rails API URL を廃止する。
5. auth identity、server state、form draft、横断 UI state の所有者を分ける。
6. 共通 Button/Dialog/FormField、loading/error/empty、Error Boundary、二重送信防止、409 conflict、i18n/server validation mapping を標準化する。
7. user image を workspace root build context から生成し、user 単独で deploy/rollback できることを検証する。

完了条件: 主要申請 E2E、accessibility、mobile、network failure、back/refresh、複数 tab 競合が受入基準を満たす。Rails token が browser storage/session response/client bundle/client log に存在しない。

### Phase 6: 管理画面を別 Next.js app へ移行

1. 同じ workspace に `apps/admin` を作り、最終的に `group-manager-admin.nutfes.net` へ割り当てる専用 image/container として構築する。Phase 6 中の production hostname は旧 Nuxt に維持し、新 admin は stage/preview host で検証する。
2. admin の新規画面は Phase 0 で固定した Next.js 構成を使い、user と同じ workspace package source を利用する。
3. 旧 94 pages を業務単位で棚卸しし、利用頻度と権限リスク順に移行する。
4. 一覧/検索/審査、ユーザー/role、申請詳細、メール、在庫/割当、export、master の順を基本とする。
5. 各機能は stage/preview で parity E2E、admin capability、監査 test が green になった時点で parity matrix を complete にする。production の route 単位で Nuxt/Next を混在させず、hostname は Phase 7 で一括切替する。
6. admin BFF は `@gm/api-client/rails-server` を利用し、browser は same-origin BFF だけを呼ぶ。旧 `localStorage` token と browser から Rails への直接通信を廃止する。
7. 管理画面固有の業務 Service を作らず、user と同じ Rails module public API を権限付き presentation adapter から利用する。
8. stage/preview で admin image を単独 deploy/rollback し、user image に影響しないことを検証する。admin session が user host へ送信されないことも確認する。

完了条件: parity matrix が全て complete、一般ユーザーと限定権限管理者の双方で越権不可、app 間の session/secret が分離され、production hostname の一括切替手順と旧 Nuxt への pre-cutover rollback が rehearsal 済みである。

### Phase 7: Stage リハーサルと cutover

1. production-like stage で新 DB + ETL、API/user/admin/worker の協調 release を反復する。
2. lint、typecheck、unit/request、contract、build、image build、E2E、Zeitwerk、選択した boundary check、architecture test、dependency/security scan を required check にする。
3. 認可 fuzz、IDOR、CSRF、rate limit、巨大入力、二重送信、外部 API 障害、queue 停止、DB lock/timeout を試験する。
4. p95/p99 latency、query count、error rate、queue lag、bundle size を基準線と比較する。
5. user/admin の BFF 化完了後、consumer discovery の判断に従って Rails ingress を切り替える。外部 consumer がゼロなら公開 API hostname/browser CORS を廃止し、存在するなら consumer 専用 gateway を維持して browser CORS を無効化する。browser から Rails へ credential 付きで直接通信できないことを確認する。
6. 旧系を maintenance にし、ingress/producer 停止 → in-flight/queue drain → consumer 停止 → 旧 DB DML 権限失効/connection 終了 → GTID/binlog watermark 付き final snapshot/object manifest → ETL/reconcile の順で確実な write fence を作る。新 API/user/admin/worker/facade を write-disabled で smoke test し、target backup/PITR restore を確認する。この時点までは旧 image/DB へ full rollback できる。
7. write 有効化の承認 gate と最初の成功 write を point of no return とする。以後は旧 DB を active に戻さず、新 DB と互換な直前 image、PITR、監査付き forward-repair で復旧する。当事者以外が、cutover 後に登録・申請・審査を書き込んだ後の application/data 障害まで runbook で試験する。
8. error rate、主要業務件数、queue lag、認可拒否、backfill/reconcile 指標を監視し、当番と連絡経路を稼働させる。

完了条件: production security `P0-S` は Phase -1 でゼロ、architecture execution blocker `G0` と P1 は対応 Phase の gate でゼロである。全 required check 成功、依存グラフに循環なし、新 DB の pre-write rollback/post-write roll-forward rehearsal 成功、業務責任者の parity 承認、監視/当番/連絡経路が稼働している。

### Phase 8: 観測期間と旧系廃止

1. 旧 image/DB snapshot は期限付き read-only の forensic/reconcile 用に保持するが、point of no return 後の通常 rollback 先として扱わない。retention、暗号化、access audit、削除責任者を定める。
2. 新 admin への一括切替後、定めた観測期間で Nuxt 2 への正規アクセスがゼロであることを確認する。安定判定後、Nuxt 2 admin、Nuxt 3 user_front、旧 auth client、旧 compose service を削除する。旧 API/version/facade は次項の consumer gate を満たすまで残す。
3. API consumer の移行完了を確認してから旧 API/version/互換 facade を削除する。
4. legacy root の業務コード、境界違反 todo、owner 不明テーブルをゼロにする。
5. module catalog、public API、table/state ownership、OpenAPI、runbook、CODEOWNERS を更新する。

破壊的変更の共通順序は、Phase -1 の現行 `P0-S` 封じ込め → runtime/stage/tooling 成立 → consumer/新 DB/境界 ADR → target schema と ETL → vertical slice → 両 Next app/BFF → production snapshot rehearsal → maintenance/write-disable → final ETL/reconcile → pre-write rollback gate → write 有効化/point of no return → roll-forward 観測 → 旧系廃止とする。旧 client または外部 consumer が残る間に既存 production の API 契約を破壊的に置き換えない。

## 8. テスト・受入基準

### セキュリティ

- 未認証 request は公開 allowlist 以外すべて 401。
- 公開 registration/create は `role_id`、role key、capability を入力として受け付けず、常に一般ユーザー権限をサーバー側で割り当てる。
- 一般ユーザーは他団体 ID を指定してもデータの存在を推測できず、更新・閲覧できない。
- 管理権限なしで role、password、export、mail、master を操作できない。
- role 変更、削除、メール、export は actor/request ID 付きで監査される。
- token/secret/password/メール本文が client bundle と log に含まれない。
- 固定 production 資格情報が source/fixture に存在せず、Phase -1 で対象となった session/token の失効と履歴確認が完了している。
- user/admin は別の host-only HttpOnly Cookie、secret、CSRF token、CSP を持ち、親 domain Cookie を共有しない。
- Cookie は opaque session ID だけを持ち、server-side session は user/admin audience、idle/absolute expiry、rotation、revocation を検査する。login/権限変更で rotate し、logout/password変更/role剥奪で即時失効し、upstream credential 更新失敗時は fail-closed となる。
- state-changing BFF endpoint は CSRF token と `Origin`/`Host` を検査し、Rails API も frontend の route guard に依存せず Policy を再検査する。
- browser から Rails API へ credential 付きで直接通信できず、一般 browser 向け CORS が無効である。

### 整合性・競合

- 二重 POST は idempotency key により 1 回だけ反映される。
- stale version の更新は 409 となり、既存変更を上書きしない。
- multi-record 更新は全成功または全 rollback。
- requested/assigned/stock が負数にならず、DB 制約でも拒否される。
- 新 DB ETL では全 source PK が mapped または owner 承認済み excluded の final disposition を一つ持ち、unresolved reject が 0 である。1:N mapping を許容しつつ、target aggregate/child 件数、承認済み件数、申請件数、ユーザー/団体対応、主要集計、添付 checksum が変換規則どおり一致する。
- `applications` の submission version と `review_workflow` の review case/status が別の正本として一意に対応し、同一状態を二つの write model に保持しない。
- 最初の新規 write 前は旧 image/DB へ full rollback でき、その write が point of no return として記録される。以後は新 DB のデータを保持した application rollback または roll-forward で、データ消失なく復旧できる。

### アーキテクチャ境界

- 全業務コードとテーブルに owner module が一つだけ定義されている。
- 目標 Ruby/Rails と境界検査 tooling の version が lockfile/ADR で固定され、production Zeitwerk check と選択した dependency/privacy check が成功する。Packwerk 構成を選んだ場合は全 package で strict mode を有効にし、全 `package_todo.yml` は存在しないか entry がゼロである。
- package dependency graph が ADR の許可方向と一致し、循環依存がない。
- 他 module の内部定数、Active Record Model、所有テーブルを直接参照・更新するコードがない。
- module 外へ Active Record Relation を返さず、public DTO/Value Object/ID/Event だけを公開する。
- Rails host の user/admin HTTP adapter が同じ業務 public API を利用し、業務ルールが presentation 別に重複していない。
- 動的呼び出し、Arel、raw SQL、table access は Packwerk だけに依存せず、AST lint、禁止 API、table ownership test、integration test、レビューで既知の違反経路を検査する。「全てを静的に完全検出する」ことを受入条件にしない。

### UI

- 全データ取得に loading、error、empty、success がある。
- network timeout/500/401/403/409 に回復可能な UI がある。
- mutation 中は二重送信できず、再試行時も重複しない。
- 日本語/英語で validation と server error が対応し、ハードコード混在がない。

### フロントエンド境界

- workspace の lockfile が一つだけで、user/admin が同じ API types/server client、semantic design-token schema、UI primitive を利用する。
- 依存が 6.2 の許可 DAG と一致し、`packages/* -> apps/*` の逆依存と package 間の循環がない。
- `packages/ui` は auth、API client、Next.js router、業務 feature を import しない。
- Button/Dialog 等の primitive に user/admin role 分岐がなく、permission 判断を持たない。
- user/admin の image、deploy、rollback、health check、runtime secret が独立している。
- browser の `localStorage`、session response、client bundle、client log に Rails token が存在しない。
- Client Component から `@gm/api-client/rails-server` を import できず、browser bundle に Rails API URL/server client が含まれない。
- user session Cookie が admin host へ、admin session Cookie が user host へ送信されない。
- 一般ユーザーは admin BFF session を確立できず、admin API の protected operation は Rails Policy でも拒否される。
- Dialog は role/ARIA、focus trap、Escape、focus restoration、scroll lock の accessibility contract を満たす。

### CI/CD・運用

- API/user/admin/worker の lint、typecheck、test、build、image build、contract、主要 E2E、Zeitwerk check、選択した boundary check、architecture test、dependency/security scan が required check。
- CI はソースを自動 commit/push しない。
- `apps/user/**` の変更は user、`apps/admin/**` の変更は admin の全 check/image build を実行する。`packages/**`、workspace root manifest/lockfile/tsconfig/lint、共通 Docker/Compose、OpenAPI の変更は両 app の全 check を実行する。app 別 Docker/Cloudflare は対象 app の image/config smoke test、workflow 変更は CI meta-validation を行う。path filter の結果は固定名の aggregate required check へ集約し、skip により branch protection が pending にならないようにする。
- health/readiness、error tracking、latency/error/queue metrics に alert があり、queue depth、oldest event age、retry/dead-letter count を監視する。
- 本番相当 snapshot を使った新 DB + ETL と、pre-write rollback/post-write roll-forward rehearsal が runbook 通り成功する。

## 9. 前提・明示的な判断

- Rails API は、標準 Rails の規約を各 module 内で利用する、単一 deployable/version・共有 DB のモジュラーモノリスとする。web/worker process は同じ code/version から起動する。
- module は user/admin ではなく業務能力で分け、所有テーブル/状態、public API、許可依存を必須とする。本文の module 一覧は Phase 0 の検証前は仮説であり、固定 schema として扱わない。
- supported Ruby/Rails へ更新し、互換性を確認した Packwerk 関連 gem を固定 version で採用することを第一案とする。runtime と tooling の compatibility gate を通過する前に Packwerk 構成を確定しない。
- 境界検査は dependency/privacy check、Zeitwerk、AST/table ownership test、integration test、レビューを組み合わせる。名前空間だけの分割と、Packwerk 単独による完全検出の主張は完了とみなさない。
- Rails Engine とマイクロサービスは採用しない。独立 mount/配布/lifecycle または独立スケーリングが実測で必要になった場合だけ別 ADR で再検討する。
- routes、API BaseController、薄い HTTP Controller/Serializer adapter は Rails host が所有し、package の public API だけを利用する。private package Controller の動的参照は採用しない。
- `applications` は case の対象性/lifecycle と `draft/submitted/withdrawn` の submission version、`review_workflow` は version ごとの review case/status を正本として所有し、画面用状態は projection で導出する。
- 外部 API consumer は未確認である。新契約は `/api/v2` に置き、consumer discovery が完了するまで未バージョン API/既存 `/api/v1` を破壊的に変更・廃止しない。state-changing consumer は cutover 前に移行し、残存 read consumer にだけ ID alias 付き compatibility facade を提供する。
- user と admin は単一 Git repository・単一 pnpm workspace に置くが、単一 Next.js app には統合しない。`apps/user` と `apps/admin` を別 image/container/subdomain/deploy として維持する。
- production URL は `group-manager.nutfes.net` と `group-manager-admin.nutfes.net` を維持し、本リファクタリングでは `/admin` へ変更しない。
- 共有は browser-safe API types、server-only Rails client、auth primitive、UI primitive、semantic design-token schema、validation、config に限定する。業務 feature、layout、permission 判断を無理に共通化しない。browser は app-local same-origin BFF client だけを使う。
- user/admin の session Cookie、secret、CSRF、CSP は分離し、親 domain Cookie を利用しない。Cookie は opaque ID、session state/upstream credential は server-side store に置く。BFF 移行後は browser から Rails API を直接呼ばない。
- DB 方針は production と分離した新 DB + 再実行可能 ETL とする。Phase 0 で実測入力と変換規則を揃え、Phase 3 で target schema、ETL、reconciliation、maintenance/cutover runbook を実装・検証する。
- 開発は短命 PR、feature flag、vertical slice、trunk への継続統合を基本とする。長期 branch を使う場合は merge-forward、hotfix 取り込み SLA、required checks、専用 stage、責任者を必須とする。
- 現行 production の `P0-S` hotfix は本計画の Phase -1 に含め、全面改修の cutover まで残さない。`G0` は対応 Phase の実行前 gate で解消する。
- dual-write/reverse ETL は採用しない。新系が最初の write を受理した時点を point of no return とし、それ以降は旧 DB へ rollback せず、新 DB を保持して application rollback または roll-forward する。
- 本文で「未確認」とした項目は、該当 Phase の実測・運用確認を完了するまで断定材料に使わない。
