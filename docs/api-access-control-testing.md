# APIアクセス制御のテストガイド

この文書は、[PR #2130](https://github.com/NUTFes/group-manager-2/pull/2130) で導入した
APIアクセス制御について、現在のテスト配置と、今後の変更時にテストを追加する場所を整理する。
アクセス区分とルート一覧については
[APIアクセス制御台帳](./api_access_control.md) と
[APIアクセス制御一覧](./group-manager-api-access-control.md) を参照する。

## テストの責務

アクセス制御のテストは、次の4層に分ける。

| 層 | 確認する内容 | 主な配置 |
|---|---|---|
| 台帳・生成物 | 全ルートの分類、未解決ルート、Markdown、OpenAPIの同期 | `api/test/lib/` |
| 認証・ロール認可 | 未認証401、権限不足403、許可ロールが認可ゲートを通過すること | `api/test/controllers/api_access_control_matrix_test.rb` |
| 所有権・業務動作 | 別団体データを404で隠すこと、データを変更しないこと、正常系・バリデーション | `api/test/controllers/` |
| 画面・実API | ログイン前の保護API呼び出し、認証ヘッダー、ロールごとの画面遷移 | `user/e2e/`、`admin_view/nuxt-project/e2e-real/` |

全ルートのマトリクステストは認証・認可ゲートだけを確認する。
許可されたリクエストの業務処理中に例外が発生しても、認可ゲートを通過していればマトリクス上は成功として扱う。
そのため、レスポンス本文、バリデーション、DB更新、副作用は各controllerのテストで確認する。

## 現在のテスト配置

### 台帳と生成物

| ファイル | 現在の確認内容 |
|---|---|
| `api/test/lib/api_access_control_registry_test.rb` | 業務ルートの未分類・削除済み定義・未解決ルート・区分の重複、未認証許可が認証フローだけであること |
| `api/test/lib/api_access_control_markdown_test.rb` | 全分類ルートが権限一覧Markdownに出力され、ロール階層と401・403・404が記載されること |
| `api/test/lib/openapi_access_control_sync_test.rb` | 認証フローの `security: []`、業務APIの401、Staff/Managerの403、Userの404、削除済みルートの除外 |

### 認証・ロール認可

| ファイル | 現在の確認内容 |
|---|---|
| `api/test/controllers/api_access_control_matrix_test.rb` | 全業務ルートを実行し、未認証401、userによるStaff/Manager APIの403、staffによるManager APIの403、各許可ロールのゲート通過を確認 |
| `api/test/controllers/api/v1/base_controller_test.rb` | `api/v1` の代表ルート、ログインユーザー向け例外、旧Public APIの認証必須化、無効トークン、manager限定操作 |
| `api/test/controllers/high_risk_access_control_test.rb` | Groupの作成・更新・一覧・削除、PDF出力など、影響が大きい操作の代表的な拒否ケース |
| `api/test/controllers/users_access_control_test.rb` | User・Staff・Managerごとのユーザー参照・更新・削除と、ロール変更の境界 |
| `api/test/controllers/api/auth/registrations_controller_test.rb` | 公開登録時とアカウント更新時に `role_id` を送っても権限昇格しないこと |

### User APIの所有権

| ファイル | 現在の確認内容 |
|---|---|
| `api/test/controllers/user_ownership_crud_matrix_test.rb` | 団体依存CRUDのindex・show・create・update・destroy、bulk upsert、申請submit、Group、UserDetail、HealthCenterSubmissionStatusをcontroller横断で確認 |
| `api/test/controllers/user_ownership_test.rb` | 団体IDを使う独自ルート、legacy `api/v1`、nested resource、親レコードを使う検索など、共通CRUD表に載せにくい所有権境界 |
| `api/test/controllers/**/*_test.rb` | 各API固有の正常系、バリデーション、失敗系、レスポンスとDB更新。このPRでは既存テストへ適切なロールの認証ヘッダーと所有団体のfixtureを追加 |

標準的な団体依存CRUDは、同じ対象を
`user_ownership_test.rb` と `user_ownership_crud_matrix_test.rb` の両方へ重複追加しない。
共通のindex・show・create・update・destroyはCRUDマトリクスへ、
独自URL、nested resource、親ID検証などは `user_ownership_test.rb` へ追加する。

### 画面と実API

| ファイル | 現在の確認内容 |
|---|---|
| `admin_view/nuxt-project/e2e-real/access-control.spec.js` | ログイン画面で保護APIを呼ばないこと、Manager・Staffのダッシュボード表示とリロード、Userの403 |
| `user/e2e/resubmission-real-flow.spec.ts` | ログイン前に業務APIを呼ばないこと、未認証の団体取得が401になること、ログイン後の実画面フロー |
| `user/e2e/resubmission-status.spec.ts` | 公開登録がUserになること、未認証のGroup作成と旧Public APIが401、UserによるStaff APIが403、再提出フロー |
| `user/e2e/cooking-process-order.spec.ts` | 認証済みの業務フローと、未認証のFoodProduct作成が401になること |

## このPRで追加・更新した箇所

新規追加した中心的なテストは次のとおり。

- 全ルートの認証・ロール認可マトリクス
- 団体所有権のCRUDマトリクスと独自ルートの所有権テスト
- User・Staff・Managerによるユーザー操作と権限昇格防止
- 台帳、権限一覧Markdown、OpenAPI成果物の同期テスト
- User画面と旧admin画面の実Rails API E2E

既存のcontrollerテストでは、認証必須化後も業務テスト本来の正常系・失敗系を確認できるよう、
対象ルートに合うロールの認証ヘッダーを追加した。
特に次の既存ファイルでは、新しい認可境界そのものの回帰テストも追加している。

- `api/test/controllers/api/auth/registrations_controller_test.rb`
- `api/test/controllers/api/v1/group_mail_comments_api_controller_test.rb`
- `api/test/controllers/api/v1/order_status_check_comment_mails_controller_test.rb`
- `api/test/controllers/groups_controller_test.rb`
- `api/test/controllers/resubmission_order_api_test.rb`
- `user/e2e/cooking-process-order.spec.ts`
- `user/e2e/resubmission-real-flow.spec.ts`
- `user/e2e/resubmission-status.spec.ts`

到達不能な旧ルートの削除に伴い、
`api/test/controllers/current_stocks_controller_test.rb` は削除した。
同じ目的のテストをこのファイルへ再追加せず、利用中のルートと実際のcontrollerに対応するテストへ追加する。

## 変更内容ごとのテスト追加先

| 変更内容 | 最初に追加・更新する場所 | 最低限確認する内容 |
|---|---|---|
| ルートまたはactionの追加・削除 | `api/config/api_access_control.yml` と対象controllerテスト | 正常系、バリデーション、失敗系。台帳テストで未分類・古い定義がないこと |
| User・Staff・Manager区分の変更 | 対象controllerテスト。重要操作は `high_risk_access_control_test.rb` | 許可ロールの成功、直下の非許可ロールの403、未認証401 |
| 標準的な団体依存CRUDの追加 | `user_ownership_crud_matrix_test.rb` の `ownership_crud_cases` | 自団体だけが一覧に出ること、別団体の参照・更新・削除・作成先指定が404、DBが不変であること |
| bulk upsertまたはsubmitの追加 | `user_ownership_crud_matrix_test.rb` | 別団体IDと別団体レコードIDの両方を404で拒否し、件数・既存値が変わらないこと |
| 独自の団体ID・親ID・nested resource | `user_ownership_test.rb` | 別団体のIDを404で隠し、レスポンスや副作用から存在を推測できないこと |
| ユーザー、ロール、認証情報の変更 | `users_access_control_test.rb`、`registrations_controller_test.rb`、必要に応じて `api/v1/base_controller_test.rb` | Staff/Userによる変更拒否、Managerの成功、送信した `role_id` の無視、対象データが不変であること |
| 台帳の形式や分類ルールの変更 | `api_access_control_registry_test.rb` | 対応区分、認証フロー、未分類・重複・未解決ルート |
| Markdown生成の変更 | `api_access_control_markdown_test.rb` | 全ルートの出力、代表ルート、説明文とステータス |
| OpenAPI同期の変更 | `openapi_access_control_sync_test.rb` | `security` と401・403・404、削除済みoperation |
| ログイン前後のAPI呼び出し変更 | 対象画面のPlaywrightテスト | ログイン前は認証フロー以外を呼ばないこと、ログイン後は認証ヘッダー付きで200になること |
| admin画面の認証復元やロール境界 | `admin_view/nuxt-project/e2e-real/access-control.spec.js` | 直リンク・リロード、Manager/Staffの成功、Userの403 |

新しいアクセス制御バグの再発防止では、まず原因に最も近い層へテストを追加する。
複数controllerへ同じ実装パターンを展開する場合だけマトリクスへ広げ、
単一API固有の仕様は対象controllerテストに残す。

## 実行方法

Rails全件:

```bash
docker compose run --rm api rails test
```

アクセス制御の中心テスト:

```bash
docker compose run --rm api rails test \
  test/lib/api_access_control_registry_test.rb \
  test/lib/api_access_control_markdown_test.rb \
  test/lib/openapi_access_control_sync_test.rb \
  test/controllers/api_access_control_matrix_test.rb \
  test/controllers/high_risk_access_control_test.rb \
  test/controllers/user_ownership_test.rb \
  test/controllers/user_ownership_crud_matrix_test.rb \
  test/controllers/users_access_control_test.rb
```

User画面とadmin画面のE2E:

```bash
make test-e2e
make test-admin-e2e
```

ルートやAPI仕様を変更した場合は、テストに加えて生成物も更新する。

```bash
make openapi
make api-access-docs
```

`.github/workflows/api-access-control.yml` はRails全件、User画面E2E、
admin画面のmock E2Eと実API E2EをPull Requestで実行する。
