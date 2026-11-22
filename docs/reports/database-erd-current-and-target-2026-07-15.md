# Group Manager 現行 DB / 再設計後 DB 完全 ERD

作成日: 2026-07-15

版・最終更新日: 2026-07-15

対象: api/db/schema.rb version 2026_07_11_000001、api/app/models/*.rb、既存の DB / API リファクタリング計画

状態: **現行側は実コードに基づく確定情報、target 側は migration 作成前の論理設計案**。本書と ERD の作成にあたり、DB、migration、アプリケーションコード、データは変更していない。

## 1. 結論

現行を正確に表すには、同じ49 tableを次の二つの解像度で見る必要がある。

1. [現行 complete ERD（physical columns + relation overlay）](./current-database-physical-2026-07-15.erd.mmd): schema.rbの全49 table・全column・全indexに、DB FK、Rails-only関連、application相関を重ねた完全図。78本の描画線のうち、DBが保証するのは`[DB FK]`と表示した8本だけである。
2. [現行 logical relation map](./current-database-logical-2026-07-15.erd.mmd): 同じ関係をtable名中心に簡略化した俯瞰図。太線=DB FK、点線=Rails-only、細線=手動lookup/業務相関、UNCONFIRMED=参照先未確認である。

初版のphysical ERDはDB FK 8本だけを描いていたため、「アプリ上もtable間の関係が少ない」と誤読できた。反証監査後はRails/application側の関係もcomplete ERDへ追加した。ただし、DB制約とコード上の関係を混同しないよう、全edgeに`[DB FK]`、`[RAILS ONLY]`、`[APP LOOKUP/STATE/NEGATIVE/RECONCILE]`、`[BROKEN RAILS]`を明記した。

再設計後は、[target steady-state ERD](./target-database-proposal-2026-07-15.erd.mmd) を正本候補とする。基本形は78 tableである。これは完成時に必要となり得る責務を漏れなく配置した**論理設計案**であり、「Phase 1で78 tableを一括作成する」という実装決定ではない。現行49 tableより増えるが、table数の削減を目的にはしない。各tableの採否と導入Phaseは業務gate・実データprofiling・ADRで確定し、不要と証明できたtableはDDLへ進めない。評価基準は次の三点である。

- 一つのtableに一つのowner、責務、lifecycleがある。
- 年度横断の団体identity、年度参加、申請、提出版、審査、割当が別のaggregateとして追跡できる。
- foreign key、UNIQUE、CHECK、immutable historyにより、アプリケーションコードだけに依存せず整合性を保証できる。

移行時だけ必要なtableと、要件確認後にのみ追加するtableの定義は、[DB再設計・新DB移行計画の付録](./database-redesign-and-migration-plan-2026-07-15.md#appendix-a-移行専用互換専用条件付きtable)へ分離した。

## 2. 現行 DB の確定値

| 指標 | 実測値 | 根拠 |
|---|---:|---|
| physical table | 49 | api/db/schema.rb の create_table |
| *_id column | 71 | 同schema |
| 明示index | 15 | 同schema |
| UNIQUE index | 6 | 同schema |
| DB foreign key | 8 | 同schemaの add_foreign_key |
| Model belongs_to | 60 | api/app/models/*.rb |
| Model has_many | 41 | 同Model全件 |
| Model has_one | 17 | api/app/models/*.rb |
| association宣言合計 | 118 | belongs_to + has_many + has_one |
| 通常のbelongs_to 59件中DB FKあり | 8 (13.6%) | schema/model突合 |
| 通常のbelongs_to 59件中DB FKなし | 51 (86.4%) | schema/model突合 |
| has_one を保証するUNIQUE | 0 | schema/model突合 |
| complete/logical ERDの描画線 | 78 | DB 8 + DB非保証のRails関連53 + application相関17 |
| integer型の*_id column | 62 | 全bigint PKと型不一致、index 0 |
| 明示indexが一つもないtable | 39 | 同schema |

この値は静的schema/modelに対する確認結果である。productionのrow数、重複、orphan、実行query、repository外consumerは**未確認**であり、migration前のdata profilingで確認する。

### 2.1 線が8本しか見えなかった理由の反証結果

画像で見えていたのは、初版のphysical ERDである。これは関係を「コードから辿れるか」ではなく「MySQLがforeign keyとして拒否できるか」で絞っていた。

- `api/db/schema.rb:510-517`の`add_foreign_key`は実際に8本だけであり、初版physical ERDの8本と一致した。したがって8本という値自体は生成漏れではない。
- Model全51ファイルを確認すると、association宣言は118件ある。逆関連を統合したRailsの描画channelは61本（DB FKあり8、DB非保証53）であり、さらにassociation外のapplication相関が17本ある。アプリケーション上の関係は疎ではない。
- 通常の`belongs_to` 59件のうちDB FKがあるのは8件、残り51件はRailsだけが認識する。polymorphic comment、`stage_first/stage_second`、手動lookup、type列/複合key相関がさらに存在する。
- 例として`venue_maps.group_id`はDB FKなしだが、`VenueMap belongs_to :group`と`Group has_one :venue_map`がある。`users.role_id`もDB FKなしだが、`User belongs_to :role`がある。
- `groups`のincident edgeはDB制約だけなら5本だが、Rails/application側を含めると23本以上になる。
- migration 87件を確認した結果、49 tableのcreate migrationは全て残り、FKを作るmigrationも8件だけだった。migration消失やsquashが線を減らした証拠はない。
- 古いmigrationは`bigint` PKに対して`integer :group_id`等を直接追加し、index/FKを作っていない。2024年以降の一部migrationだけが`references ... foreign_key: true`またはbigint+index+FKを使う。この世代差が物理制約の少なさを説明する。

したがって正しい結論は、「table間の業務関係が少ない」ではなく、「業務関係の大部分をRailsと手動コードが保持し、DBが参照整合性を保証していない」である。

なお、ここで確定できるのはrepositoryの`schema.rb`から構築されるDBである。本番DBがschema dumpより多いFKを持つ可能性は、`INFORMATION_SCHEMA`または`SHOW CREATE TABLE`を未確認のため**未確認**である。

### 2.2 現行の中心構造

~~~mermaid
flowchart LR
  users --> groups
  fes_years --> groups
  group_categories --> groups
  groups --> applications["申請・連絡先・割当など多数のtable"]
  groups --> statuses["health_center_submission_statuses"]
  groups --> negatives["un_registered_groups"]
  applications --> allocations["会場・ステージ・物品割当"]
~~~

groups が「年度参加」「団体identity」「代表user」「申請のowner」「割当のowner」を同時に担う。これが多数の直接関連、年度削除時の連鎖削除、単数申請から複数申請へ拡張した際の状態不整合を生みやすくしている。

### 2.3 ERDで区別した不整合

- `contact_people.group_id`をfrontendがlookupする一方、Modelの`ContactPerson has_many :groups`は存在しない`groups.contact_person_id`を要求する。complete ERDでは実lookupと壊れたRails関連を別edgeにした。
- place_orders.first/second/third は places.id を手動lookupするが、FKもModel関連もない。
- stage_orders.stage_first/stage_second も stages.id の手動lookupで、FKもindexもない。
- `current_stocks`と`item_adjustments`のID風9列はModel関連がなく、一部は現行schemaに同名の参照先tableもない。線を推測で追加せずUNCONFIRMEDとした。`CurrentStocksController`の許可parameterも実schemaと一致しない。
- 17件のhas_oneは全てDBのUNIQUEで単数性を保証していない。初版で警告が抜けていた`User#user_detail`、`FoodProduct#cooking_process_order`、`Group#cooking_process_order`にも注記を追加した。
- `FesYear has_one :user_page_settings`は複数形association名で、通常のclass推論では存在しない`UserPageSettings`を探す可能性がある。実行再現は未実施のため「潜在的に壊れている」とした。
- `cooking_process_orders`は`group_id`と`food_product_id`の双方にFKを持つが、food productもgroup所属である。両groupの一致を保証するvalidation/composite FKは確認できない。
- `User has_many :groups`でDBにも`groups.user_id`のUNIQUEはない一方、`GroupsController#get_user_group_id_and_group_category_id`は`find_by(user_id:)`で任意の1件だけを返し、Next側も単数responseとして扱う。同じuserに複数groupがあると選択結果が不定になるため、現行の実質的な単数契約とModel cardinalityが一致していない。
- 旧admin画面には`assign_rental_items.rental_order_id` / `rentable_item_id`を読むfallbackがあるが、両列は現行schemaに存在しない。これは永続化された関連ではなく、到達可能性も未確認の旧実装疑いであるため、ERDへ架空のedgeは追加していない。
- un_registered_groups は (group_id, order_type) UNIQUEがなく、positive rowとの相互排他もtransactionで保証されない。
- FesYear と Group の dependent: :destroy により、Model経由の年度削除は参加・申請履歴の連鎖削除につながる。

### 2.4 Rails関連以外の業務相関

次はFKやassociationではないが、Controller/Modelがtable間を結び付けるためcomplete/logical ERDへ細線で追加した。

| 相関 | 結合方法 | 根拠 |
|---|---|---|
| health_center_submission_statuses ↔ 8申請collection | `group_id + application_type` | health_center_submission_status.rb:9-18、health_center_submission_statuses_api_controller.rb:336-395 |
| un_registered_groups ↔ 5 positive collection | `group_id + order_type` | un_registered_group.rb:6-12、check_all_registered_controller.rb:4-70 |
| rental_orders ↔ assign_rental_items | `(group_id, rental_item_id)` | rental_orders_api_controller.rb:77,106 |
| stocker_items ↔ assign_rental_items | `(rental_item_id, stocker_place_id)` | stocker_items_api_controller.rb:30 |
| place_orders ↔ places | `first/second/third`を`Place.find` | place_order.rb:28-43 |

これらはrow-level FKではない。通常のFK線として描くと保証範囲を誤認するため、`APP STATE / NEGATIVE / RECONCILE / LOOKUP`として区別した。

### 2.5 主な根拠箇所

| 確認事項 | 実コード |
|---|---|
| schema versionと全table定義 | api/db/schema.rb:13-508 |
| DB foreign key 8本 | api/db/schema.rb:510-517 |
| migration上のFK生成8件 | api/db/migrate/20200819160209_create_user_details.rbほか、20260605063647_add_uses_place_id_to_groups.rbまで |
| Model association 118宣言 | api/app/models/*.rb 全51ファイル |
| groupsの列と唯一の明示index | api/db/schema.rb:165-178 |
| Groupが申請・割当を広く直接所有 | api/app/models/group.rb:24-47 |
| 年度・団体のdependent destroy | api/app/models/fes_year.rb:3-7, api/app/models/group.rb:30-47 |
| user email/provider/reset tokenの現行UNIQUE | api/db/schema.rb:472-498 |
| UserとUserDetailの関連 | api/app/models/user.rb:10-12, api/app/models/user_detail.rb:10-12 |
| un_registered_groupsの列・index | api/db/schema.rb:421-426 |
| un_registered_groupsのorder type | api/app/models/un_registered_group.rb:6-12 |
| contact_peopleのschema/model不一致 | api/db/schema.rb:60-65, api/app/models/contact_person.rb:4 |
| FesYearの複数形has_one | api/app/models/fes_year.rb:7, api/app/models/user_page_setting.rb:3 |
| cooking processの二重owner key | api/db/schema.rb:68-78, api/app/models/cooking_process_order.rb:5-6, api/app/models/food_product.rb:4 |
| User-Groupのcardinality不一致 | api/app/models/user.rb:12, api/app/controllers/groups_controller.rb:19-26, user/src/api/groupApi.ts:92-111 |
| 旧adminの存在しないfallback列 | admin_view/nuxt-project/pages/assign_items/index.vue:403-423, api/db/schema.rb:30-39 |
| place希望の手動ID lookup | api/db/schema.rb:244-251, api/app/models/place_order.rb:28-43 |
| stage希望の手動ID lookup | api/db/schema.rb:360-374, api/app/models/stage_order.rb:7-8 |
| review statusと8申請のtype相関 | api/app/models/health_center_submission_status.rb:9-18, api/app/controllers/api/v1/health_center_submission_statuses_api_controller.rb:336-395 |
| 貸出request/割当の複合key照合 | api/app/controllers/api/v1/rental_orders_api_controller.rb:77,106, api/app/controllers/api/v1/stocker_items_api_controller.rb:30 |
| current_stocks / item_adjustmentsの孤立 | api/db/schema.rb:81-89,191-203; api/app/models/current_stock.rb:3, api/app/models/item_adjustment.rb:3 |

## 3. 再設計後の中心構造

~~~mermaid
flowchart LR
  users --> organization_memberships
  organization_memberships --> organizations
  organizations --> festival_participations
  festival_years --> festival_participations
  festival_participations --> participation_memberships
  festival_participations --> application_cases
  festival_years --> application_requirements
  application_requirements --> application_cases
  application_cases --> application_submissions
  application_submissions --> application_submission_items
  application_submission_items --> typed_details["型別明細"]
  application_submissions --> review_cases
  application_submission_items --> review_items
  application_submissions --> allocations["会場・ステージ・物品割当"]
~~~

主要な意味は次のとおりである。

- organizations: 年度を越えて維持する団体のidentity。
- festival_participations: 団体の年度ごとの参加・企画。過年度表示を守るため、当時の団体表示名・企画名をsnapshotとして持つ。
- organization_memberships: userと恒久団体の関係・履歴閲覧権。
- participation_memberships: 当該年度参加での代表・編集・閲覧権。organization membershipを経由し、別団体への誤接続をcomposite FKで防ぐ。
- application_cases: 年度参加×年度別申請要件の一意なケース。
- application_submissions: draft、提出、再提出、取下げをversionとして保存する。
- application_submission_items: 最初から複数明細を前提とする共通identity。
- 型別明細: 火器、電力、従業員、食品、購入、調理、ステージ、貸出品等のDB型とFKを維持する。
- review_items: 提出版全体だけでなく、申請内の何番目の明細を差戻したかを保存する。

## 4. Target table inventory

| owner | table数 | table |
|---|---:|---|
| identity_access | 10 | users, user_profiles, departments, grades, roles, capabilities, role_capabilities, user_role_assignments, access_sessions, password_recovery_tokens |
| festival_configuration | 7 | festival_years, festival_dates, group_categories, application_requirements, application_requirement_versions, application_requirement_publications, application_requirement_collection_rules |
| participation | 5 | organizations, festival_participations, organization_memberships, participation_memberships, participation_contacts |
| applications | 23 | application_cases, application_submissions, application_submission_items, application_attachments, application_dependency_invalidations, announcement_submission_items, deputy_contact_submission_items, fire_equipment_submission_items, power_device_submission_items, employee_submission_items, participation_products, participation_product_profiles, participation_product_profile_daily_quantities, food_product_submission_items, purchase_submission_items, cooking_process_submission_items, place_request_details, place_preferences, stage_request_details, stage_request_items, stage_preferences, public_relation_submission_items, venue_map_submission_items |
| review_workflow | 4 | review_cases, review_items, review_comments, review_events |
| program_allocation | 8 | venues, venue_year_settings, venue_eligibility_rules, stages, stage_year_settings, participation_identifiers, place_allocations, stage_allocations |
| inventory_allocation | 9 | rental_items, storage_locations, storage_location_year_settings, participation_storage_allocations, inventory_movements, inventory_balances, rental_item_eligibility_rules, rental_request_submission_items, rental_item_allocations |
| vendor_catalog | 1 | vendors |
| communications | 6 | news_posts, staff_notes, message_templates, message_template_versions, message_deliveries, message_delivery_attempts |
| platform_core | 5 | idempotency_records, outbox_events, audit_events, schema_identity, export_jobs |
| **合計** | **78** | steady-state runtime proposal |

rental_request_submission_items は申請の共通itemを継承するが、在庫・割当ownerが管理するためinventory側で数えている。

### 4.1 Targetで必須とする不変条件

1. festival_years.year_num はUNIQUE。年度rowとIDを削除・seed置換しない。
2. festival_participations は UNIQUE (organization_id, festival_year_id, entry_number)。
3. legacy groups は必ずfestival participationへ1:1 mappingする。異年度のgroupを同一organizationへ統合するのは名称一致で自動化せず、承認済みmappingだけを使う。
4. participation_memberships は organization_membership_id を参照し、participationとmembershipの organization_id 一致をcomposite FKで保証する。active rowのactive_slotは固定値 active、履歴rowはNULLとし、MySQLのNULLを複数許すUNIQUE semanticsを利用する。
5. 主代表はparticipationごとに最大一人。正確に一人必要かはactivation時の業務gateで保証する。
6. application_cases は UNIQUE (festival_participation_id, application_requirement_id)。participationとrequirementの年度一致もcomposite FKで保証する。
7. caseに回答状態の第二の正本を置かない。draft、latest submitted version、reviewから導出する。
8. submitted rowとそのtyped detailはimmutable。訂正は新version、取下げ、review eventで表す。
9. response_kind = no_request の提出はitemとattachmentを0件にする。un_registered_groups はtargetに作らない。このcross-table条件は通常のCHECKだけでは表せないため、同一transactionのCommand validationとintegrity test/monitorを必須とし、DB triggerを併用するかはDDL gateで決める。
10. application_submission_items.item_kindに対応するtyped leafは、必要なkindでは正確に1行とする。このXOR条件もCommand validationとintegrity test/monitorで検証する。review_items と対象itemが同じsubmissionに属することはcomposite FKで保証する。
11. 在庫の履歴正本はappend-only inventory_movements、inventory_balances は再構築可能な現在値projectionとする。
12. organization、participation、submitted application、review、auditへのcross-module cascade deleteは禁止する。
13. legacy提出・審査・comment・在庫にactorや正確な時刻がない場合、現在userやsystem userを本人として補完しない。`legacy_*_unknown`、`*_at_source`、migration provenanceで不明を明示する。
14. review statusの保存語彙は `pending / in_review / approved / changes_requested / rejected` に統一する。`not_required`はreview rowを作らないpolicyから導くprojection値であり、DBのreview statusには保存しない。
15. outbox/deliveryのclaimはlease generationでfencingし、非冪等providerで結果不明になった配送を`outcome_unknown`として自動再送しない。

## 5. 申請table設計の選択

| 評価軸 | A: 全申請をJSON payload | B: 申請種別ごとに完全独立 | C: 共通case/version/item + typed detail |
|---|---:|---:|---:|
| FK・CHECK・UNIQUEによる整合性 | 低 | 高 | 高 |
| 提出・再提出・取下げの統一 | 高 | 低 | 高 |
| 検索・帳票・割当 | 低 | 高 | 高 |
| 新申請種別の追加速度 | 高 | 低 | 中 |
| OpenAPIとの型整合 | 中 | 高 | 高 |
| 明細単位review | 低 | 中 | 高 |
| 初期table数 | 少 | 多 | 多 |
| 長期保守性 | 低 | 中 | 高 |

推奨は **C** である。AはJSON内の貸出品・会場・ステージ・商品IDへDB FKを張れず、数量や重複制約も弱くなる。Bは response_kind、version、withdraw、review、idempotencyを申請種別ごとに複製し、現行と同じ状態分散を再生産する。Cは共通lifecycleと型付き業務データを両立できる。

最終採否はチームのADRで確定する。本ERDはCを採用した場合の具体案である。

## 6. 現行49 tableの全 disposition

| # | current table | action | target table / 状態 | 根拠・移行gate |
|---:|---|---|---|---|
| 1 | announcements | reshape | announcement_submission_items | 共通submission item配下。旧statusの意味は未確認 |
| 2 | assign_group_places | merge | place_allocations | place_numbersと同じ割当aggregateへ |
| 3 | assign_rental_items | reshape | rental_item_allocations | request item、在庫balance、数量上限へFK |
| 4 | assign_stages | merge | stage_allocations | stage_numbersと統合し、日付・時間範囲を明示 |
| 5 | comments | split | review_comments, review_events, message_deliveries | polymorphic subjectとmail送信状態を分離 |
| 6 | contact_people | reshape | participation_contacts | schemaのgroup_idを移行元とする。Model関連方向は不整合 |
| 7 | cooking_process_orders | reshape | cooking_process_submission_items | product/profile、提出版、複数明細を明示 |
| 8 | current_stocks | gate | inventory_movements / inventory_balances または移行対象外archive | 実利用、参照先、rowの意味が未確認。推測でcopyしない |
| 9 | departments | retain/reshape | departments | stable keyと参照制約を追加 |
| 10 | employees | reshape | employee_submission_items | immutableな複数明細。PII retentionが必要 |
| 11 | fes_dates | retain/reshape | festival_dates | string日付をDATE、年度内UNIQUE |
| 12 | fes_years | retain/reshape | festival_years | year_num UNIQUE、削除・ID使い回し禁止 |
| 13 | fire_equipment_orders | reshape | fire_equipment_submission_items | quantity > 0、placeholderを通常明細にしない |
| 14 | food_products | split | participation_products, participation_product_profiles, participation_product_profile_daily_quantities, food_product_submission_items | stable product identityと提出snapshotを分離 |
| 15 | grades | retain/reshape | grades | stable key、参照中rowの物理削除禁止 |
| 16 | group_categories | retain/reshape | group_categories | stable key、年度設定から参照 |
| 17 | group_identifications | reshape | participation_identifiers | 年度・namespace・番号のUNIQUE |
| 18 | groups | split | organizations, festival_participations, organization_memberships, participation_memberships | 恒久団体、年度企画、権限を分離。旧uses_place_idは意味確認後storage allocationへ |
| 19 | health_center_submission_statuses | merge | review_cases, review_items, review_events | 提出版・明細ごとの履歴へ。現在値上書きを廃止 |
| 20 | item_adjustments | gate | inventory_movements または移行対象外archive | 実利用・列意味が未確認。actor/reasonを復元できないrowは要承認 |
| 21 | memos | reshape | staff_notes | author、scope、retentionを明示 |
| 22 | message_templates | split | message_templates, message_template_versions | 送信済みversionをimmutableにする |
| 23 | news | retain/reshape | news_posts | draft/published/archived、audience、actor/timeを明示 |
| 24 | place_allow_lists | reshape | venue_eligibility_rules | 年度・policy version・カテゴリを一意化 |
| 25 | place_numbers | merge | place_allocations, participation_identifiers | 場所の決定と番号を割当aggregateへ |
| 26 | place_orders | split/reshape | place_request_details, place_preferences | first/second/thirdをrank rowへ |
| 27 | places | split | venues, venue_year_settings | 恒久masterと年度availabilityを分離 |
| 28 | power_orders | reshape | power_device_submission_items | 複数行、watts > 0、合計上限はversioned policy |
| 29 | public_relations | reshape | public_relation_submission_items, application_attachments | 文言と画像storage metadataを分離 |
| 30 | purchase_lists | reshape | purchase_submission_items | product/profile/vendor/dateへFK。日付の意味は未確認 |
| 31 | rentable_items | merge | inventory_movements, inventory_balances | stock現在値だけでなく変動理由を保持 |
| 32 | rental_item_allow_lists | reshape | rental_item_eligibility_rules | 年度・カテゴリ・policy versionを一意化 |
| 33 | rental_items | retain/reshape | rental_items | stable catalog key。年度可否はruleへ |
| 34 | rental_orders | reshape | rental_request_submission_items | submission item配下で複数、品目重複禁止 |
| 35 | roles | split | roles, capabilities, role_capabilities, user_role_assignments | system権限と参加団体内roleを分離 |
| 36 | shops | retain/reshape | vendors | 名称だけでdedupeしない。自然identityは未確認 |
| 37 | stage_common_options | merge | stage_request_details | submissionごとのscalar 0..1をUNIQUEで保証 |
| 38 | stage_numbers | merge | stage_allocations, participation_identifiers | stage決定・番号を割当aggregateへ |
| 39 | stage_orders | split/reshape | stage_request_items, stage_preferences | 日付・天候・時刻とranked希望を分離 |
| 40 | stages | split | stages, stage_year_settings | 恒久masterと年度availabilityを分離 |
| 41 | stocker_items | merge | inventory_movements, inventory_balances | 年度・品目・保管場所の現在値と履歴へ |
| 42 | stocker_places | split | storage_locations, storage_location_year_settings | 場所masterと年度workflow stateを分離 |
| 43 | stool_tests | merge | review_items, review_events | statusだけならemployee item reviewへ。検査metadataが必要なら専用table追加は未確認 |
| 44 | sub_reps | split/reshape | participation_contacts, deputy_contact_submission_items | current contact identityとimmutable提出snapshotを分離 |
| 45 | un_registered_groups | merge then drop | application_submissions.response_kind = no_request | negative answerを提出版へ統合。target negative tableなし |
| 46 | user_details | reshape | user_profiles | user_id UNIQUE/NOT NULL、department/grade FK |
| 47 | user_page_settings | split/merge | application_requirements, application_requirement_versions, application_requirement_publications, application_requirement_collection_rules | 横持ちbooleanを年度別versioned policyへ |
| 48 | users | split/reshape | users, access_sessions, password_recovery_tokens, user_role_assignments | normalized email UNIQUE、digest token、一回限りreset、role join |
| 49 | venue_maps | reshape | venue_map_submission_items, application_attachments | metadataとbinary objectを分離しscan/checksumを持つ |

全49 tableを分類しており、行がないsource tableはない。gate は即時dropを意味せず、実データ・運用・外部consumerを確認できるまで移行方式を確定しない。

## 7. 既存計画から修正した設計負債

既存文書には、より新しいorganization方針と両立しない記述が残っていた。本ERDでは次を修正した。

1. 旧target案で使っていた年度団体とmembershipの単一モデルを廃止し、organizations/festival_participations/organization_memberships/participation_memberships へ置換した。
2. 「年度を跨ぐorganization identityは今回導入しない」を撤回した。
3. 旧資料間で競合していた申請種別定義は、年度別 application_requirements.key を正本とする案で解消した。DB行追加だけで任意の申請画面が動的に増える設計とはしない。
4. submission単位の review_cases だけでなく review_items を追加し、複数申請の「何番目を差戻したか」を表現した。
5. inventory_balances だけへの統合をやめ、append-only inventory_movements を履歴の正本にした。
6. case自身に回答状態の第二の正本を持たせず、submission/reviewから導出する。

## 8. 移行・条件付きtable

steady-state 78 tableとは別に、移行中は次を使う。

| 区分 | table | 最終扱い |
|---|---|---|
| migration provenance | migration_batches, migration_record_mappings, migration_rejects | retention方針に従い別schemaで保持 |
| compatibility only | legacy_resource_aliases, legacy_id_sequences | 未バージョン/API v1 consumerが0になった後に削除 |
| conditional | cancellation_operations | 外部・非transactionalな取消処理が実在する場合だけ追加 |
| deferred | reporting_projection_events, reporting_projection_checkpoints | 非同期read modelのconsumer inventory後に必要なら追加 |

この分離により、移行補助tableを完成後の業務domainと誤認しない。全column・制約・関係と採用/廃止条件は、[DB再設計・新DB移行計画 Appendix A](./database-redesign-and-migration-plan-2026-07-15.md#appendix-a-移行専用互換専用条件付きtable)を正本とする。

## 9. 未確認の設計gate

次はコードだけでは確定できず、migration/DDLを作る前にownerの判断が必要である。

1. 旧年度の各 group をどのorganizationへ統合するか。安全なfallbackはlegacy groupごとに一organizationを作り、承認された組だけ後でmergeする。
2. participationをactiveにする時点で主代表を正確に一人必須にするか。同じuserが同年度の複数entryで主代表になれるか。
3. membership終了後に過年度データを閲覧できる範囲。
4. 複数年度を同時にactiveにできるか。closed/archived年度のedit/read権限。
5. 各申請keyのapplicability、allow_no_request、collection別min/max、review scope、deadline。
6. product profileをdraft/submitted/effectiveのどの段階からpurchase/cookingが参照できるか、差替え時のinvalidation規則。
7. user/contact/employee PIIの保持年数、暗号化、匿名化、過年度閲覧権。
8. current_stocks、item_adjustments の実データ・consumer・列意味。
9. groups.uses_place_id の意味と、assign_rental_items.stocker_place_id/rental_place_id のsource/destination。
10. purchase_lists.fes_date_id と purchase_date の業務上の違い。
11. 会場・ステージのcapacity、同時刻重複、割当一意性の運用規則。
12. 認証providerを現行DeviseTokenAuthのhardeningで継続するか、session実装を置換するか。
13. dashboard/exportに非同期projectionが必要か。
14. no_requestの0明細・0添付と、item_kindごとのtyped leaf XORを、service transaction + integrity monitorだけで保証するか、DB triggerも併用するか。

## 10. ERDからDDLへ進む条件

本target ERDはtable・owner・関係・主要constraintを漏れなく置いた論理案である。ただし、未確認gateがあるため「正確な将来physical schemaが確定済み」とは断定しない。次の順序で確定する。

1. 49 tableのrow count、null/duplicate/orphan、値域、repository外consumerをprofileする。
2. 第9節の業務gateをownerが承認し、ADRへ記録する。
3. target ERDのtable/column/constraint dictionaryをDDL設計へ変換する。
4. migration schemaとsource-to-target mappingを固定し、ETL rehearsalで全rowをmapped/rejected/excluded-with-approvalのいずれかにする。
5. OpenAPI v2、server validation、DB constraint、migration testを同じ契約から検証する。

これらを満たす前にtarget migrationを作ると、未確認の運用をschemaへ固定するため、現段階では実施しない。
