# APIアクセス制御台帳

Issue #2136 の移行先となるアクセス区分を
[`api/config/api_access_control.yml`](../api/config/api_access_control.yml) に記録する。
この台帳を実行時のデフォルト拒否ポリシーとして使用し、各 `controller#action` の認証・認可を適用する。

## アクセス区分

| 区分 | 認証 | 認可・スコープ |
|---|---|---|
| User | 必須 | role_id 1, 2, 3。参加団体向けAPI。団体依存データは `current_api_user.groups` 内だけ操作可能 |
| Staff | 必須 | role_id 1, 2。管理画面、審査、帳票、マスタ管理 |
| Manager | 必須 | role_id 1。ユーザー権限や他ユーザーの認証情報を変更する操作 |

StaffとManagerもUser APIを利用できる。User APIの区分は
「role_id 3だけ」という意味ではなく、団体所有権によるスコープが必要という意味である。
登録、ログイン、ログイン状態確認、パスワード再設定などの認証処理だけをアクセス台帳の対象外とし、
業務APIには未認証でアクセスできるPublic区分を設けない。

## 2026-07-19時点の台帳

Rails内部、Action Mailbox、Active Storage、Devise Token Authのルートを除外している。

| 区分 | action数 |
|---|---:|
| User | 141 |
| Staff | 226 |
| Manager | 7 |
| 修正・削除待ち | 0 |
| 合計 | 374 |

到達不能だった旧ルートは利用箇所を確認して削除し、利用中のルートは接続先を復元した。
`unresolved_routes` は今後も0件を維持し、解決不能なルートが追加された場合はCIを失敗させる。

## 更新方法

ルートを追加、変更、削除した場合は、同じ変更内で台帳も更新する。
次のテストは未分類ルート、削除済み定義、重複分類、未解決ルートの増減を検出する。

```bash
docker compose run --rm api rails test test/lib/api_access_control_registry_test.rb
```

`.github/workflows/api-access-control.yml` は台帳、ロール差、所有権、OpenAPI同期の回帰テストを
API変更のpushとPull Requestで実行する。

`api_access_control_matrix_test.rb` は全業務ルートについて、未認証の401、権限不足の403に加え、
userルートをuser・staff・manager、staffルートをstaff・manager、managerルートをmanagerが
それぞれ認証・認可ゲート通過できることを検証する。

`user_ownership_test.rb` と `user_ownership_crud_matrix_test.rb` は、団体依存APIの一覧・参照・作成・
更新・削除・一括更新・申請submitをcontroller横断で実行し、別団体のIDを404で秘匿して
データを変更しないことを検証する。

台帳にない業務ルートは実行時にも拒否される。Userの処理ではcontroller側で所有権スコープを適用し、
別団体のIDは404にする。

`make openapi` は台帳を使ってOpenAPI成果物も同期する。未認証で利用する認証処理だけに
`security: []`、全業務APIに401、
Staff/Managerには403、Userには所有権不一致の404を追加し、削除済みルートを成果物から除外する。
