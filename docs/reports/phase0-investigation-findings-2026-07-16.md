# Phase 0 静的調査結果（2026-07-16）

## 1. 目的と判定規則

本書は、`database-erd-current-and-target-2026-07-15.md` 第9節の未確認 gate のうち静的コード調査で前進できる項目と、`architecture-refactoring-diagnosis-and-plan-2026-07-15.md` の Phase 0 にある runtime/tooling および API consumer 調査を補足する。

- 調査対象 commit: `59568c8c03dcb73368ed9731622174ac78a74ac8`
- 対象: `api/`, `user/`, `admin_view/`, `user_front/` と、ローカルに clone 済みの同一 GitHub org `NUTFes` の sibling repository
- 変更範囲: 本書の新規追加だけ。application、DB、migration、既存レポートは変更していない
- `CONFIRMED`: 指定した source または upstream release metadata で直接確認できた事実
- `NOT FOUND`: 明記した検索範囲と検索語では参照を検出しなかった事実。存在しないことの一般証明ではない
- `UNCONFIRMED`: production data、access log、運用、repository 外部の情報が必要で、今回の静的調査では確定できない事項

主な再現用検索は次のとおりである。

```bash
rg -n -i --hidden --glob '!.git/**' \
  'CurrentStock|ItemAdjustment|StoolTest|current_stock|item_adjustment|stool_test' \
  api user admin_view user_front

rg -n --hidden --glob '!.git/**' \
  'uses_place_id|stocker_place_id|rental_place_id|purchase_date|fes_date_id' \
  api user admin_view user_front
```

既存 gate は `database-erd-current-and-target-2026-07-15.md:311-313`、runtime/tooling と consumer discovery の Phase 0 項目は `architecture-refactoring-diagnosis-and-plan-2026-07-15.md:811-824` にある。

## 2. 結論一覧

| 調査項目 | 静的調査の結論 | 残る gate |
|---|---|---|
| `current_stocks` | repository 内では route も frontend consumer もない。dead code 候補 | production row、外部 consumer、列意味は **UNCONFIRMED** |
| `item_adjustments` | 空の Model と migration/schema 以外に runtime 利用なし。dead code 候補 | production row、外部 consumer、列意味は **UNCONFIRMED** |
| `stool_tests` | `employees.stool_test_id` 経由で user/admin/API が現役利用 | production row count と運用上の状態遷移は **UNCONFIRMED** |
| place 3列 | `assign_rental_items.stocker_place_id` は在庫元・借用場所。残り2列の方向は判断不能 | `groups.uses_place_id` と `rental_place_id` は **UNCONFIRMED** |
| purchase date 2列 | 技術的には festival master の日と自由入力の購入日。画面・帳票では両方を「購入日」と扱い、業務上の差は一貫しない | 正本、backfill 規則は **UNCONFIRMED** |
| Packwerk 系 | 現行 Ruby/Rails でも旧 release を固定すれば依存解決可能。最新版一式の下限は Ruby 3.3 / Rails 7 | production boot、Zeitwerk/Packwerk check は **UNCONFIRMED** |
| 外部 API consumer | repository 内の運用 task は1件確認。同一 org の local clone には Rails API endpoint consumer を検出せず | access log、未 clone repo、Spreadsheet/BI 等は **UNCONFIRMED** |

## 3. `current_stocks` / `item_adjustments` / `stool_tests`

### 3.1 `current_stocks`: dead code 候補

**CONFIRMED**:

- table は `place_category_id`, `place_id`, `item_id`, `stock_num`, `date_id` を持つ（`api/db/migrate/20240307061926_create_current_stocks.rb:3-9`, `api/db/schema.rb:81-89`）。
- Model は関連・validation・query のない空 class である（`api/app/models/current_stock.rb:3-4`）。
- CRUD Controller は存在する（`api/app/controllers/current_stocks_controller.rb:3-54`）が、許可 parameter は `group_id`, `stock_id`, `number` で、実 table の列と一致しない（同 `:52-53`）。
- `api/config/routes.rb` 全体に `current_stock` はなく、近接する CRUD resource 群にも route は定義されていない（`api/config/routes.rb:39-84`）。`rg -n 'current_stocks' api/config/routes.rb` は no match である。
- `user/`, `admin_view/`, `user_front/` に `current_stock(s)` の参照はない。
- Controller test は route helper を呼ぶ scaffold のままだが（`api/test/controllers/current_stocks_controller_test.rb:5-23`）、対応 route はない。Model test も実質空である（`api/test/models/current_stock_test.rb:5-8`）。

repository 内で到達可能な route と consumer が見つからないため、`current_stocks` は **dead code 候補**である。ただし、production row の有無、console/SQL による直接利用、repository 外 consumer、各 ID 風列の参照先は **UNCONFIRMED** である。静的調査だけを根拠に table を drop または移行対象外にはできない。

### 3.2 `item_adjustments`: dead code 候補

**CONFIRMED**:

- table は `group_id`, `use_place_id`, `rental_place_id`, `item_id`, 数量・人数・時間・日付 ID を持つ（`api/db/migrate/20240307061007_create_item_adjustments.rb:3-15`, `api/db/schema.rb:191-203`）。
- Model は空 class である（`api/app/models/item_adjustment.rb:3-4`）。
- Controller、route、View/API serializer、seed、frontend 参照は4領域の全検索で **NOT FOUND** である。
- Model test と fixture は scaffold の空状態である（`api/test/models/item_adjustment_test.rb:5-8`, `api/test/fixtures/item_adjustments.yml:3-10`）。

repository 内の runtime 利用が見つからないため、`item_adjustments` も **dead code 候補**である。production row、外部 consumer、各 ID の参照先、adjustment の業務イベント意味は **UNCONFIRMED** であり、drop/移行除外前に read-only data profiling が必要である。

### 3.3 `stool_tests`: 間接的に現役利用

**CONFIRMED**:

- `Employee` は `StoolTest` に `belongs_to` し、一覧・詳細・`to_info_h` で status を読む（`api/app/models/employee.rb:3-5`, `:9-16`, `:20-35`）。
- employee create/update/upsert は `stool_test_id` を受け取り、upsert 後の検索条件にも使う（`api/app/controllers/employees_controller.rb:28-61`, `:92-105`）。
- admin API は employee response に `employee.stool_test` を含める（`api/app/controllers/api/v1/employees_api_controller.rb:9-25`）。
- production/develop seed は ID 1-3 を「検便準備中」「検便無」「検便有」として作る（`api/db/fixtures/production/01_stool_test.rb:3-6`, `api/db/fixtures/develop/01_stool_test.rb:3-6`）。
- Next client は create/update/upsert で `stool_test_id: 1` を送る（`user/src/components/Applications/Employees/hooks.ts:73-81`, `:94-108`, `:121-131`）。
- Nuxt `user_front` も employee 登録時に ID 1 を送る（`user_front/pages/regist/employees/index.vue:69-82`, `user_front/components/RegistInfo/add/Employee.vue:38-47`）。
- admin は status を一覧・詳細表示し（`admin_view/nuxt-project/pages/employees/index.vue:43-54`, `admin_view/nuxt-project/pages/employees/_id.vue:28-39`）、ID 1-3 を編集 payload に戻す（`admin_view/nuxt-project/components/edit-modals/EmployeeEditModal.vue:45-85`）。保健所書類 review でも admin API から status を取得する（`admin_view/nuxt-project/pages/health_center_document_review/_id.vue:693-703`）。

したがって `stool_tests` は standalone CRUD resource ではないが、employee の状態 master として **現役利用**されており、dead code ではない。standalone `stool_tests` Controller/route は **NOT FOUND** である。production の実 row、ID 1-3 以外の値、状態変更の owner/運用は **UNCONFIRMED** である。

## 4. place ID 3列の source / destination

### 4.1 `assign_rental_items.stocker_place_id`: source / 在庫元

**CONFIRMED** と判定する。

- `StockerItem` 自体が `stocker_place` に属する（`api/app/models/stocker_item.rb:3-6`）。
- assignment create は画面の `stockerPlaceId` を `stocker_place_id` に保存する（`api/app/controllers/assign_rental_items_controller.rb:21-29`, `:63-65`）。
- 在庫残数は `(rental_item_id, stocker_place_id)` が同じ `StockerItem.num` から assignment 数を引いて計算する（`api/app/controllers/api/v1/stocker_items_api_controller.rb:29-37`）。
- admin 向け API も `stocker_place_id` で在庫と割当を絞り込む（`api/app/controllers/api/v1/assign_rental_items_api_controller.rb:24-39`, `:63-70`）。
- admin の割当 UI も在庫を `stocker_place_id` 単位でまとめ、group を在庫場所へ drop すると同 ID を assignment に送る（`admin_view/nuxt-project/pages/assign_items/index.vue:390-400`, `:466-515`）。
- 旧 admin の割当詳細も同列を画面の `place_id` として読み、割当一覧は選択した場所を同列名で送る（`admin_view/nuxt-project/pages/assign_rental_items/_id.vue:285-304`, `:333-344`; `admin_view/nuxt-project/pages/assign_rental_items/index.vue:229-236`）。
- CSV/PDF はこの列を「借りる場所」「借用場所」と表示する（`api/app/controllers/api/v1/output_csv_controller.rb:53-69`, `api/app/views/print_pdf/output_group_info.pdf.erb:97-108`, `api/app/views/print_pdf/output_rental_items.pdf.erb:46-60`）。

以上から、`stocker_place_id` は物品の **source、在庫元、受取/借用場所**に相当する。物品を最終的に使用する destination ではない。

なお admin の手動更新 payload は snake_case `stocker_place_id` を送る一方（`admin_view/nuxt-project/pages/assign_items/index.vue:564-577`）、Controller の update strong parameter は camelCase `stockerPlaceId` である（`api/app/controllers/assign_rental_items_controller.rb:67-70`）。create の意味は確認できるが、この update 経路で列が更新されるとは断定できない。

### 4.2 `assign_rental_items.rental_place_id`: **UNCONFIRMED**

- `stocker_places` への nullable FK である（`api/db/migrate/20260605063539_add_rental_place_id_to_assign_rental_items.rb:3-5`）。
- Model は同じ `StockerPlace` への optional association `rental_place` として定義し、ID がある場合だけ存在を検証する（`api/app/models/assign_rental_item.rb:3-9`）。
- 単数 update の strong parameter にはあるが、複数 create では保存していない（`api/app/controllers/assign_rental_items_controller.rb:21-29`, `:67-70`）。
- OAS schema には nullable ID として載るだけで、説明はない（`api/oas_docs/src/components/schemas/assign_rental_item.yml:16-22`）。
- Model test が確認するのは存在しない ID の validation failure だけで、場所の方向は規定しない（`api/test/models/assign_rental_item_test.rb:36-44`）。
- `user/`, `admin_view/`, `user_front/` に `rental_place_id` の read/write は **NOT FOUND** である。API/帳票の明示的 read、`group.uses_place_id` からの代入も **NOT FOUND** である。

列名から destination と推測することはできるが、実装上の振る舞いがないため、source/destination は **UNCONFIRMED** とする。

### 4.3 `groups.uses_place_id`: **UNCONFIRMED**

- `stocker_places` への nullable FK である（`api/db/migrate/20260605063647_add_uses_place_id_to_groups.rb:3-5`）。
- Model は optional association `uses_place` として定義する（`api/app/models/group.rb:24-29`）。
- group create/update の strong parameter には含まれる（`api/app/controllers/groups_controller.rb:30-34`, `:59-63`, `:130-133`）。
- OAS schema に nullable ID として載るが、説明はない（`api/oas_docs/src/components/schemas/group.yml:28-31`）。
- Model test が確認するのは存在しない ID の validation failure だけで、場所の用途は規定しない（`api/test/models/group_test.rb:49-60`）。
- 3 frontend に明示的な read/write は **NOT FOUND** である。assignment の `rental_place_id` または `stocker_place_id` へ伝播する処理も **NOT FOUND** である。

「団体の使用場所」という命名以上の業務挙動を確認できないため、物品移動の destination か、団体の活動場所か、既定の受取場所かは **UNCONFIRMED** である。`rental_place_id` との同一視や backfill は owner 確認前に行わない。

## 5. `purchase_lists.fes_date_id` と `purchase_date`

### 5.1 コード上で確認できる技術的差

| 列 | コード上の性質 | 主な利用 |
|---|---|---|
| `fes_date_id` | `FesDate` への Active Record association。festival year/day/date を参照できる | legacy 選択肢、bulk payload と処理後の再取得条件、CSV |
| `purchase_date` | nullable string。日付 master への制約なし | 現行 form、admin 表示、保健所提出 PDF |

- `PurchaseList` は `FesDate` に必須 `belongs_to` し、`days_num`, `date`, `day`, `year` を response 用 Hash に展開する（`api/app/models/purchase_list.rb:3-6`, `:30-46`）。
- bulk upsert は `fes_date_id` を全属性 list に含め、`id` がない行の処理後再取得条件にも使う。一方 `purchase_date` は保存するが再取得条件には使わない（`api/app/controllers/purchase_lists_controller.rb:54-83`）。`upsert_all` に `unique_by` は指定されていないため、`fes_date_id` が DB の conflict key だとは判定しない。両方とも create/update/upsert で許可される（同 `:96-124`）。
- schema 上は両方とも nullable で、`fes_date_id` は integer、`purchase_date` は string である（`api/db/schema.rb:282-293`）。`PurchaseList#belongs_to` による論理参照はあるが、現行 schema の DB-level FK 一覧には `purchase_lists -> fes_dates` はない（`api/db/schema.rb:510-517`）。
- migration でも `fes_date_id` は table 作成時の integer、`purchase_date` は2023年追加の string で、移行理由や相互変換は記録されていない（`api/db/migrate/20201118105401_create_purchase_lists.rb:3-10`, `api/db/migrate/20230525071401_add_column_purchase_lists.rb:1-5`）。develop seed は同じ row に `fes_date_id: 1` と `purchase_date: '2021-05-25'` を併存させる（`api/db/fixtures/develop/05_purchase_list.rb:3-10`）。
- OAS の PurchaseList schema は `id` しか定義せず、どちらの列の意味も記載しない（`api/oas_docs/src/components/schemas/purchase_list.yml:4-9`, `api/oas_docs/src/components/schemas/api/v1/purchase_lists_api.yml:4-9`）。Jbuilder は `fes_date_id` を抽出する一方で `purchase_date` を含めない（`api/app/views/purchase_lists/_purchase_list.json.jbuilder:3-4`）。

### 5.2 現行 consumer の使い分け

- Next client は利用者に `purchaseDate` の date input だけを見せる（`user/src/components/Applications/PurchaseLists/PurchaseListsForm/PurchaseListsForm.tsx:152-165`）。一方 `FES_DATE_ID` は定数 `1` で（`user/src/components/Applications/PurchaseLists/constants.ts:13-14`）、全 create/update/upsert payload に固定挿入する（`user/src/components/Applications/PurchaseLists/hooks.ts:354-385`）。API adapter が request key を snake_case 化する（`user/src/api/api.ts:62-83`）。
- Nuxt `user_front` の add/edit も date input を `purchase_date` に送りながら、初期値 `1` の `fes_date_id` も送る（`user_front/components/RegistInfo/add/Purchase.vue:56-84`, `:178-185`; `user_front/components/RegistInfo/edit/Purchase.vue:61-66`, `:92-117`）。
- 旧 initial registration page は逆に、`FesDate` master を「購入日」として選択して `fes_date_id` だけを送る（`user_front/pages/regist/purchase/index.vue:60-65`, `:103-124`, `:244-264`）。
- admin create は `fes_date_id=1` を固定し、入力した `purchase_date` を送る（`admin_view/nuxt-project/pages/purchase_lists/index.vue:124-127`, `:347-364`）。詳細画面は `purchase_date` を「購入日」として表示する（`admin_view/nuxt-project/pages/purchase_lists/_id.vue:29-41`）。
- 旧 admin 詳細は両列を response から読むが、edit request では `purchase_date` だけを更新する（`admin_view/nuxt-project/pages/purchase_lists/_id.vue:158-170`, `:198-215`）。共通 edit modal も `purchase_date` だけを送る（`admin_view/nuxt-project/components/edit-modals/PurchaseListEditModal.vue:77-87`, `:109-124`）。
- admin の申請状況と保健所 review は `purchase_date` を「購入日」列に表示する（`admin_view/nuxt-project/pages/order_status_check/_id.vue:765-779`, `admin_view/nuxt-project/pages/health_center_document_review/_id.vue:315-327`）。Nuxt `user_front` の登録情報一覧も API の `date_id` と `purchase_date` を別 prop として渡す（`user_front/pages/regist_info/index.vue:787-803`）。
- purchase CSV は header「購入日」に `purchase_list.fes_date.date` を出す（`api/app/controllers/api/v1/output_csv_controller.rb:500-519`）。保健所提出 PDF は header「仕入日」に `purchase_list.purchase_date` を出す（`api/app/views/print_pdf/output_health_office_documents.pdf.erb:20-49`）。

### 5.3 判定

技術上は、`fes_date_id` が festival calendar master への参照、`purchase_date` が date form から送られる自由入力 string であり、保健所 PDF では後者を「仕入日」と表示する。しかし業務 UI と帳票は両方を「購入日」とも呼び、現行 Next/admin は前者を ID 1 に固定している。したがって、**業務上の正式な差、どちらが正本か、ID 1 の値が意味を持つかは UNCONFIRMED** である。

target へは推測で片方を copy しない。row ごとに `fes_date.date`, `purchase_date`, group の festival year を比較し、owner が「予定日/開催日/仕入日」の定義と不一致時の優先順位を承認する必要がある。

## 6. Ruby/Rails と Packwerk 系 gem の互換性

### 6.1 現行 lockfile

- Ruby は `3.0.7p220`（`api/Gemfile:6`, `api/Gemfile.lock:351-352`, `api/Dockerfile:1`）。
- Rails と Railties は `6.1.3.1`（`api/Gemfile:9`, `api/Gemfile.lock:194-207`）。
- Bundler は `2.2.33`（`api/Gemfile.lock:354-355`）。
- `packwerk`, `packwerk-extensions`, `packs-rails` は現行 `api/Gemfile.lock` に存在しない。
- 現行 lock の Zeitwerk は `2.4.2` である（`api/Gemfile.lock:314`）。

### 6.2 release tag の要求 version

調査時点は 2026-07-16。main branch ではなく、RubyGems に公開された release tag を採用判断の基準にした。

| gem | release | Ruby | Rails/Railties等 | 根拠 |
|---|---:|---:|---|---|
| Packwerk | `3.2.1` | `>= 2.7` | ActiveSupport `>= 6.0`, Zeitwerk `>= 2.6.1` | [`packwerk.gemspec:39-46`](https://github.com/Shopify/packwerk/blob/abef73cea9129f21df1f91d83635218731031406/packwerk.gemspec#L39-L46) |
| Packwerk | `3.2.2`, `3.2.3` | `>= 3.1` | ActiveSupport `>= 6.0` | [`v3.2.2 gemspec:39-46`](https://github.com/Shopify/packwerk/blob/8da471c346dce17fc9c03cf26c29b92a5bbe20f9/packwerk.gemspec#L39-L46), [`v3.2.3 gemspec:39-46`](https://github.com/Shopify/packwerk/blob/b827a63262a21b2845fece2d03c9442dfc434149/packwerk.gemspec#L39-L46) |
| Packwerk | `3.3.0` | `>= 3.3` | ActiveSupport `>= 6.0`, Zeitwerk `>= 2.6.1` | [`packwerk.gemspec:39-46`](https://github.com/Shopify/packwerk/blob/66af39faa77d9d2bacd660943deeb27f19afc542/packwerk.gemspec#L39-L46), [release note](https://github.com/Shopify/packwerk/releases/tag/v3.3.0) |
| packwerk-extensions | `0.3.0` | `>= 2.7` | Packwerk `>= 2.2.1`, Railties `>= 6.0.0` | [`packwerk-extensions.gemspec:22-29`](https://github.com/rubyatscale/packwerk-extensions/blob/29508303b348037b51b04c0f67853611a4dd899d/packwerk-extensions.gemspec#L22-L29) |
| packs-rails | `0.0.5` | `>= 2.7` | Railties/ActiveSupport/Packs、下限指定なし | [`packs-rails.gemspec:13-26`](https://github.com/rubyatscale/packs-rails/blob/13b0c4afae9c6045111f9cb8051d33df6d3b2188/packs-rails.gemspec#L13-L26) |
| packs-rails | `0.1.0` | `>= 3.1` | Railties `>= 7` | [`packs-rails.gemspec:13-26`](https://github.com/rubyatscale/packs-rails/blob/a255ff3fa4ba4439af2d55fdeec593f0a6aea6b5/packs-rails.gemspec#L13-L26), [release note](https://github.com/rubyatscale/packs-rails/releases/tag/v0.1.0) |
| packs（transitive） | `0.2.0` | `>= 2.6` | Packwerk、parse_packwerk 等 | [`packs.gemspec:22-39`](https://github.com/rubyatscale/packs/blob/7cb494f732e8424ff15a9d1c6570f65ed8707927/packs.gemspec#L22-L39) |
| packs（transitive） | `0.3.0` | `>= 3.2` | 同上 | [`packs.gemspec:22-39`](https://github.com/rubyatscale/packs/blob/55d26d4a629757e3450285881b74394c297269ef/packs.gemspec#L22-L39) |

Packwerk と packwerk-extensions の `CHANGELOG.md` は release page への参照だけである（[Packwerk `CHANGELOG.md:1`](https://github.com/Shopify/packwerk/blob/66af39faa77d9d2bacd660943deeb27f19afc542/CHANGELOG.md#L1), [extensions `CHANGELOG.md:1`](https://github.com/rubyatscale/packwerk-extensions/blob/29508303b348037b51b04c0f67853611a4dd899d/CHANGELOG.md#L1)）。`packs-rails` release tag には `CHANGELOG.md` 自体がないため、gemspec と GitHub Releases を根拠にした。

main branch は release と条件が異なる。調査時点の `packwerk-extensions/main` と `packs-rails/main` は Ruby `>= 3.3` である（[`packwerk-extensions.gemspec:22-27`](https://github.com/rubyatscale/packwerk-extensions/blob/main/packwerk-extensions.gemspec#L22-L27), [`packs-rails.gemspec:13-26`](https://github.com/rubyatscale/packs-rails/blob/main/packs-rails.gemspec#L13-L26)）。git `main` を version 未固定で導入してはいけない。

### 6.3 具体的な組み合わせ

#### A. Ruby 3.0.7 / Rails 6.1.3.1 を維持

依存関係レベルでは **導入可能**である。Ruby 3.0.7 container、現行 `Gemfile`/`Gemfile.lock`、Bundler 2.2.33 を使った隔離 resolver で次を確認した。

```text
packwerk             3.2.1
packwerk-extensions  0.3.0
packs-rails          0.0.5
packs                 0.2.0
zeitwerk              2.6.18
```

ただし最初の `bundle lock` は、現行 lock の Zeitwerk `2.4.2` と Packwerk の `>= 2.6.1` が競合して失敗した。Zeitwerk を update 対象にすると、Rails 6.1.3.1 を維持したまま上記へ解決した。したがって「現行 runtime では3 gemを一切導入できない」は正しくない。一方で旧 release 固定となり、application boot、production Zeitwerk、`packwerk validate/check`、既存 gem との実行時挙動は今回未実施なので **UNCONFIRMED** である。

#### B. `packs-rails 0.1.0` と Packwerk 3.2 系最新を使う最小下限

gemspec 下限は Ruby `>= 3.1`、Rails/Railties `>= 7` である。組み合わせは `packwerk 3.2.3`, `packwerk-extensions 0.3.0`, `packs-rails 0.1.0`, `packs 0.2.0` となる。ただし Ruby 3.1 / Rails 7.0 を長期採用することの support/security 判断は本調査の対象外であり、単なる技術的下限である。

#### C. 調査時点の最新公開 release 一式

最新公開 release を揃える技術的下限は Ruby `>= 3.3`、Rails/Railties `>= 7` である。Ruby 3.3.11 container の隔離 resolver で次の exact set が解決した。

```text
rails                 7.0.10
packwerk              3.3.0
packwerk-extensions   0.3.0
packs-rails           0.1.0
packs                  0.3.0
```

これは gem dependency の成立確認であり、Group Manager 全体を Rails 7.0.10 へ更新できること、またはその version を support target にすべきことの確認ではない。G0 を閉じるには、ADR で support target を決めたうえで、実 application の bundle、production boot、Zeitwerk、Packwerk check、test を通す必要がある。

### 6.4 G0 判定

G0 は「絶対的な gem 非互換」から、次の選択 gate に狭められる。

1. runtime を一時維持して A を exact pin し、旧 tooling release を受容する。
2. supported runtime へ更新して B/C 以降を exact pin する。
3. いずれも application-level compatibility spike が失敗する場合だけ代替 tooling を選ぶ。

依存 resolver の観点では A/C とも **CONFIRMED**、application-level の G0 完了は **UNCONFIRMED** である。

## 7. 外部 API consumer

### 7.1 本 repository 内

**CONFIRMED consumer**:

- Next `user` は production/stage の Rails API host を設定し（`user/next.config.ts:13-25`）、共通 API client から endpoint を呼ぶ（`user/src/api/api.ts:62-83`）。
- Nuxt 2 `admin_view` は `VUE_APP_API_URL` を Axios base URL にする（`admin_view/nuxt-project/nuxt.config.js:29-31`, `:60-64`）。
- Nuxt 3 `user_front` は同 URL を public runtime config にする（`user_front/nuxt.config.ts:30-35`）。
- 運用 task `mail:delivery_test` は base URL を環境変数で切り替え、`POST /api/auth/sign_in` と `POST /api/v1/mail_deliveries` を実際に呼ぶ（`api/lib/tasks/mail_delivery_test.rake:7-40`, `:49-71`）。本番 host を指定する手順も存在する（`docs/メール送信テスト手順.md:85-97`）。これは frontend 以外の repository 内 consumer である。

**consumer ではないと判定したもの**:

- `api/oas_docs` は server を `http://localhost:3000` と定義する API 契約であり（`api/oas_docs/src/servers.yml:2-4`）、`make openapi` は route から文書を生成するだけである（`Makefile:93-98`）。client 実装や定期実行は **NOT FOUND** である。
- `Makefile:1` の production API URL 変数は、他 target からの参照が **NOT FOUND** である。

### 7.2 local clone 済み NUTFes repository

`/Users/yosuke/workspace/github.com/NUTFes` 直下で、`group-manager-2` 以外の次の7 cloneへアクセスできた。各 HEAD で production/stage API host、`/api/v1/get_`, `/api/v1/current_user`, `/api/auth/sign_in`, `/check_all_registered`, `/group_identification`, `/user_page_settings`, `/purchase_lists`, `/rental_orders` を検索した。

| repository | 調査 HEAD | 結果 |
|---|---|---|
| `nutfes-Bingo` | `c83930163b7e` | host/endpoint とも **NOT FOUND** |
| `settings` | `8afb39921700` | API host の deployment env だけ確認。endpoint/caller は **NOT FOUND** |
| `nutmeg-dashboard` | `75c1d65ba58b` | host/endpoint とも **NOT FOUND** |
| `nutfes-db-gui` | `037930a25b4d` | host/endpoint とも **NOT FOUND** |
| `44th-homepage` | `07fa6ca4ba62` | Rails API host/endpoint は **NOT FOUND**。Firebase Storage URLは別物 |
| `.github` | `0f59df88fc23` | host/endpoint とも **NOT FOUND** |
| `NUTFES-Account` | `d878625982ea` | user/admin UI へのリンクだけ。API endpoint は **NOT FOUND** |

`settings` は `VUE_APP_URL` / `VUE_APP_API_URL` を Group Manager API host に設定する（`/Users/yosuke/workspace/github.com/NUTFes/settings/group-manager-2/group-manager-2.yml:10-11`, `/Users/yosuke/workspace/github.com/NUTFes/settings/kubernetes/configMap.yml:34-39`）。これは Group Manager 自身の deployment configuration であり、独立した endpoint consumer code ではない。

`NUTFES-Account` は user/admin の UI URLへ遷移するだけである（`/Users/yosuke/workspace/github.com/NUTFes/NUTFES-Account/frontend/src/constants/apps.tsx:17-26`）。`44th-homepage` の `group-manager-2.appspot.com` は画像の Firebase Storage bucket 参照であり、Rails API consumer ではない（`/Users/yosuke/workspace/github.com/NUTFes/44th-homepage/src/data/exh_exp.json:106-112`）。

### 7.3 判定と残作業

今回アクセスできた repository 範囲では、現 repository の frontend/運用 task 以外に **Group Manager Rails API endpoint を呼ぶ consumer は検出しなかった**。ただし次は静的 local search では確認できないため、外部 consumer 全体の有無は **UNCONFIRMED** のままである。

- production/stage API access log と認証 client/UID 別集計
- NUTFes org の未 clone repository、private repository、過去 branch/tag
- 個人端末や運用サーバー上の script/cron
- Spreadsheet/Apps Script、BI、Webhook、手動 curl/Postman
- DNS/Cloudflare/ingress を直接参照する外部 system

したがって既存未バージョン API と `/api/v1` の破壊的変更禁止 gate は解除できない。次の確認は access log と GitHub org 全体の code search を優先し、確認できた `mail:delivery_test` を consumer inventory に登録する。

## 8. Gate 更新案

1. `current_stocks`, `item_adjustments`: static code gate は dead code 候補まで前進。data/consumer/列意味 gate は継続。
2. `stool_tests`: 利用ありで確定。employee/status master として target mapping 対象に残す。
3. place: `stocker_place_id = source` は確定。`uses_place_id` と `rental_place_id` の destination/業務意味は owner gate を継続。
4. purchase date: 技術差は確定したが、正本と不一致処理は owner/data profiling gate を継続。
5. Packwerk: 現 runtime でも exact old pin は解決可能。G0 は runtime/tooling ADR + application compatibility spike の gate として継続。
6. API consumer: local repository 調査は完了。access log、org-wide search、非repository consumer の gate は継続。
