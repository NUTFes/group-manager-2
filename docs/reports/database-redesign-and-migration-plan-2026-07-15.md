# Group Manager DB 再設計・新 DB 移行計画

作成日: 2026-07-10

版・最終更新日: 2026-07-15

対象リポジトリ: `NUTFes/group-manager-2`

関連文書:

- [全体アーキテクチャ診断・実行計画](./architecture-refactoring-diagnosis-and-plan-2026-07-15.md)
- [現行 DB / Target DB の比較・全49 table disposition](./database-erd-current-and-target-2026-07-15.md)
- [Target steady-state 完全 ERD](./target-database-proposal-2026-07-15.erd.mmd)

診断方法: リポジトリ内の Model、Controller、route、schema、user/admin の API 呼び出しを静的読解

計画状態: **業務gate確認・DDL実装前の提案**。本書作成時点では migration、データ更新、アプリケーションコード変更を実行していない。

## 0. 文書の責務と正本

この6文書では責務を次のように固定する。

| 領域 | 正本 |
|---|---|
| 現行physical columns + DB/Rails/application relation overlay | `current-database-physical-2026-07-15.erd.mmd` |
| 現行関係の簡略俯瞰図 | `current-database-logical-2026-07-15.erd.mmd` |
| Targetのtable、column、relation、主要制約 | `target-database-proposal-2026-07-15.erd.mmd` |
| 現行49 tableの移行先・設計判断・未確認gate | `database-erd-current-and-target-2026-07-15.md` |
| ETL、reconcile、cutover、rollback、移行補助table | 本書 |
| Webアプリ全体のアーキテクチャと全体Phase | `architecture-refactoring-diagnosis-and-plan-2026-07-15.md` |

Target ERDの78 tableは、完成時に必要となり得る責務を漏れなく配置した論理設計案である。Phase DB-1で78 tableを一括作成する決定ではない。各tableは業務gate、実データprofiling、ADR、vertical sliceで採否を確定し、不要と証明できたtableはDDLへ進めない。

## 1. 結論と確定方針

既存 DB をその場で大改造せず、productionから分離した新 DB にTarget schemaを構築し、旧 DBのread-only snapshotから再実行可能なETLで移行する。

- Railsは単一application・単一deployable・共有MySQLを維持するモジュラーモノリスとする。
- 旧DBと新DBへのdual-writeは採用しない。
- cutoverはmaintenance window内で、旧系write fence、final snapshot、ETL、reconcile、write-disabled smoke test、承認、write-enableの順に実行する。
- 最初のTarget write前は旧系へfull rollbackできる。最初のTarget write後は旧DBへ戻さず、新DB上でimage rollback、PITR、forward repairを行う。
- `festival_years.id`を固定してseed値を書き換える運用を廃止する。年度rowは追加し、`year_num`をUNIQUE、lifecycleでactive/closed/archivedを管理する。
- 年度横断の団体identityを`organizations`、年度ごとの参加・企画を`festival_participations`に分離する。
- userと団体の恒久関係は`organization_memberships`、年度内の代表・編集・閲覧権は`participation_memberships`で表す。一人のuserが複数団体・複数年度に関われる。
- 団体×年度×申請要件ごとに`application_cases`を一件持ち、draft、提出、再提出、取下げは`application_submissions`のversionで表す。
- 本質的に反復可能な入力は`application_submission_items`配下の1:Nを既定にする。業務上scalarのものだけを1:1とし、UNIQUEで保証する。
- `un_registered_groups`は廃止し、「申請しない」という明示回答を`response_kind = no_request`の提出versionへ移す。
- reviewは提出versionと、必要なら明細に結び付ける。過去の決定・commentを再提出で上書きしない。
- 新しいcanonical HTTP契約はOpenAPIを正本とする`/api/v2`である。未バージョンAPIと`/api/v1`はconsumer移行用のread-only compatibility facadeに縮退する。

## 2. 現行コードから確認した移行理由

### 2.1 整合性制約と単数性

- `api/db/schema.rb`には49 tableあるが、明示的なDB foreign keyは8本だけである。
- `api/app/models/group.rb`はuser、年度、category、会場、stage、電力、物品、食品、広報、review状態など多数領域を直接所有する。
- `Group`の多数の`has_one`と`User#user_detail`に対応するUNIQUE制約がなく、Modelの期待する単数性をDBが保証しない。
- `Group#has_one :cooking_process_order`に対し、`cooking_process_orders`は`food_product_id`も持つ。複数商品へ拡張すると団体単位の単数関連と商品単位の工程が衝突する。

### 2.2 `un_registered_groups`の意味と部分失敗

`un_registered_groups`は「未入力」の一覧ではなく、物品・電力・副代表・従業員・火器についてのnegative answerである。

- `check_all_registered_controller.rb`はpositive rowまたは対応するnegative rowがあれば登録済みと判定する。
- `(group_id, order_type)`のUNIQUEがなく、positive/negativeの相互排他もDBで保証しない。
- user側の一部formはnegative作成、positive削除、status更新を複数HTTP requestで順に行うため、途中失敗・二重送信・ブラウザバックでboth/neitherが生じ得る。
- 火器を使わない場合、placeholder rowとnegative rowを同時に作る経路があり、単純copyでは架空の申請明細になる。

### 2.3 review履歴

`health_center_submission_statuses`は団体×application typeの現在状態を一行で持つ。提出versionがないため、どの提出内容に対する承認・差戻し・commentかを履歴として分離できない。

### 2.4 年度運用

`user_page_settings`は申請ごとの可否をboolean columnで横持ちし、申請種別追加にschema変更を要求する。年度seedのIDを固定し値を差し替える運用と合わせると、過年度を同時に保持・参照する要求を満たせない。

### 2.5 API namespace

未バージョンAPIがadmin専用、`/api/v1`がuser専用という対応ではない。

- 未バージョンCRUDはuser/adminの双方が利用する。
- `/api/v1`にはadmin向け検索・CSV/PDF・画面依存RPCが集中する一方、userが使うcurrent-user APIと共有masterもある。
- adminの同一画面が未バージョンCRUDと`/api/v1` RPCを併用する。

したがって、現行URL prefixをTargetのmodule境界や認可境界として流用しない。

## 3. Targetの業務境界

Targetのtable inventoryは[比較文書の第4節](./database-erd-current-and-target-2026-07-15.md#4-target-table-inventory)、完全なcolumn/relationは[Target ERD](./target-database-proposal-2026-07-15.erd.mmd)を参照する。

| owner module | 主な責務 |
|---|---|
| `identity_access` | user、profile、system role/capability、session、password recovery |
| `festival_configuration` | 年度、開催日、category、年度別application requirement/version/publication |
| `participation` | organization identity、年度参加、恒久/年度membership、年度連絡先 |
| `applications` | case、submission version、共通item、typed detail、attachment、product revision |
| `review_workflow` | submission/item review、comment、append-only event |
| `program_allocation` | venue/stage設定、識別番号、場所・stage割当 |
| `inventory_allocation` | rental catalog、在庫movement/balance、貸出申請明細・割当 |
| `vendor_catalog` | vendor master |
| `communications` | news、staff note、template version、delivery/attempt |
| `platform_core` | idempotency、outbox、audit、schema identity、export job |

共有DBは共有所有権を意味しない。他moduleのtableを直接更新せず、public Command/Query/DTO/Eventを利用する。cross-module FKは整合性のために許可するが、cross-module cascade deleteは禁止する。

中心データフローは次のとおりである。

~~~mermaid
flowchart LR
  U[users] --> OM[organization_memberships]
  OM --> O[organizations]
  O --> FP[festival_participations]
  FY[festival_years] --> FP
  FP --> PM[participation_memberships]
  FY --> R[application_requirements]
  FP --> C[application_cases]
  R --> C
  C --> S[application_submissions]
  S --> I[application_submission_items]
  I --> TD[typed details]
  S --> RC[review_cases]
  I --> RI[review_items]
  S --> A[allocations]
~~~

## 4. Migration-facing Target契約

### 4.1 物理規約

- Target baselineはMySQL 8.4 LTS候補とし、patch version、image digest、adapter、backup/restore、CHECKの実効性をADRとstage testで固定する。現行の実versionは未確認である。
- PKは`bigint`、時刻はUTC `datetime(6)`、文字コードは`utf8mb4`を標準とする。
- 必須FKはNOT NULL、全FK columnにindexを置く。tenant/year一致はcomposite UNIQUE/FKで保証する。
- 業務enumは安定したstring keyとCHECKを使う。
- 更新可能aggregate rootに`lock_version`を置き、stale updateを409にする。
- submitted payload、review event、audit event、inventory movementはappend-onlyまたはimmutableとする。
- JSONはversioned event、filter、redacted audit/provenanceに限定し、検索・制約・集計対象の申請内容の正本にしない。

### 4.2 Identity、年度、団体参加

- `users.email_normalized`をUNIQUEとし、provider/uidとの関係も明示する。移行前にcase/Unicode/空白正規化後の衝突を計測し、勝手にmergeしない。
- `user_profiles.user_id`はUNIQUE/NOT NULL FKとする。
- `festival_years.year_num`はUNIQUE。年度row/IDを削除・再利用せず、active slotとlifecycleで現在年度を表す。
- source `groups`一行は`festival_participations`一行へ移す。各participationはorganization一件に所属する。
- 年度を跨ぐorganization統合を名称一致だけで自動化しない。承認済みmappingがない安全なfallbackは、legacy groupごとにorganizationを一件作ることである。
- organization統合mappingは承認者、根拠、時刻、対象source IDを持つ。
- source `groups.user_id`から`organization_memberships`と`participation_memberships(primary_representative)`を作る。同一userが複数団体に関係できる。
- participationとorganization membershipが同じorganizationに属することをcomposite FKで保証する。
- source `sub_reps`や連絡先からuser accountを自動生成しない。現在の年度連絡先は`participation_contacts`、提出時の値はimmutableな`deputy_contact_submission_items`に分離する。

### 4.3 Application、複数性、review

- `application_requirements`は年度×申請keyのidentity、version tableはeligibility/review/submission/withdrawal/product-reference policyと受付期間を持つ。
- `application_cases`は`(festival_participation_id, application_requirement_id)`でUNIQUEとし、participation/requirementの年度一致をcomposite FKで保証する。
- caseに回答状態の第二の正本を置かない。画面状態はcase、current draft、latest submission、reviewから導出する。
- `application_submissions`はcase内version番号を持つ。submitted rowとtyped detailはimmutable、訂正は新versionとする。
- `response_kind`は`provided / no_request`。`no_request`はitem/attachment 0件をCommand transactionとintegrity monitorで保証する。
- 反復可能な入力は共通itemとtyped leafの1:Nを既定にする。scalar detailだけをsubmission 0..1とし、UNIQUEで保証する。
- `item_kind`とtyped leafのXOR、同一submission所属、collectionごとのmin/maxを検証する。
- review scopeは`none / submission / item / both`。scopeがnoneならreview case/itemは0件、submissionならcase 1件/item 0件、item/bothならcase 1件とreview対象itemごとのreview item 1件を要求する。
- 保存するreview statusは`pending / in_review / approved / changes_requested / rejected`。`not_required`はreview rowが不要というpolicyから導くprojection値である。
- legacy actor/reviewer/comment authorが復元できない場合、現在userやsystem userを本人として埋めない。`legacy_*_unknown`と`*_at_source`、migration provenanceで不明を表す。

画面用projectionは次を返す。

| field | 値 |
|---|---|
| `case_state` | cancelled / not_applicable / not_started / draft / submitted / withdrawn |
| `response_kind` | provided / no_request / NULL |
| `review_status` | not_required / pending / in_review / approved / changes_requested / rejected / NULL |
| `latest_submission_version` | 最新version番号またはNULL |
| `dependency_status` | valid / invalidated |
| `allowed_actions` | policy、deadline、membership、lock version、allocationから導出 |

### 4.4 Product、在庫、割当

- `participation_products`を年度参加内の商品identity、`participation_product_profiles`をimmutable revisionとする。
- food/purchase/cookingは独立application caseを維持し、同じproduct/profileをcomposite FKで参照する。
- product profileの`pending / effective / superseded`と`effective_at`を正本とし、purchase/cookingが参照可能な段階はversioned policyで決める。
- 在庫履歴の正本はappend-only `inventory_movements`、`inventory_balances`は再構築可能なprojectionとする。
- actorを持たないlegacy在庫snapshotは、owner承認時だけ`opening_balance` movementとして移し、`legacy_actor_unknown`と時刻sourceを残す。架空のadjustment actorを作らない。
- requestとallocationを分離する。貸出は`rental_request_submission_items`と`rental_item_allocations`、会場/stageはrequest/preferenceとallocationを別tableに置く。

### 4.5 認証、session、password recovery

- BFFとRails間のsession tokenは十分なentropyのopaque値とし、DBにはdigestだけを保存する。
- audienceはtrusted BFF identityからserver側で決め、request bodyを信頼しない。
- idle/absolute expiry、rotation、revocation、password/role変更時の全session失効を持つ。
- password reset tokenはpurpose、user、digest、expiry、used_atを持つ一回限りtokenとする。raw token、password、Rails access tokenをlog・browser storage・DB平文へ保存しない。
- reset requestはaccount enumerationを防ぐ同一response、rate limit、監査を持つ。

### 4.6 Transaction、lock、idempotency

一つのCommandは最上位でtransactionを開始し、途中で例外を握りつぶさない。複数moduleをまたぐ強整合workflowはhost Orchestratorだけに許可し、各moduleのpublic APIを呼ぶ。

基本lock順序:

1. idempotency record
2. festival participation / participation membership
3. application case
4. current draft / target submission
5. submission items
6. review case / review items
7. product profile / inventory movement・balance / allocation
8. audit event / outbox event

同じidempotency keyと同じrequest hashは保存済みresponseを再生し、異なるhashは409とする。成功responseは再計算せず、保存したstatus/content-type/bodyと同じsemantic responseを返す。

### 4.7 Outbox、delivery、audit、export

- 業務transaction内でoutbox eventを作り、dispatcher/workerが非同期配送する。
- claimはlease owner/expiry/generationでfencingし、古いworkerの完了更新を拒否する。
- provider受付後の結果が不明な非冪等配送は`outcome_unknown`で自動停止し、重複送信を避ける。
- retryable failure、terminal failure、dead letterを分け、attemptをappend-onlyで残す。
- legacy commentのrecipient/template/authorを現userから逆算しない。不明値とsource mail statusをprovenanceへ残す。
- auditにはactor kind、audience、request ID、action、subject、redacted before/after、originを保存し、append-only権限にする。
- export jobはrequester、capability/audience snapshot、validated filter/checksum、row count、期限、object checksumを持ち、期限切れobjectを削除する。

### 4.8 Index、削除、schema分離

- 一覧filter/sort/pagination、active membership、年度×申請、review queue、outbox lease、delivery retry、在庫balance、allocation競合に合わせた複合indexをquery planで確定する。
- UNIQUE indexは業務不変条件に使い、検索に使われない重複indexは作らない。
- organization、participation、submitted application、review、movement、auditは物理削除しない。
- PIIのretention/匿名化は履歴整合性と分離してpolicy化する。
- legacy migration pathとTarget migration pathを分け、Target taskは`schema_identity`、DB URL、legacy signature tableを事前検査する。legacy DB・同一DB・identity不一致にはDDL前に失敗する。

### 4.9 現行49 tableのdisposition

全49 tableの唯一の対応表は[比較文書の第6節](./database-erd-current-and-target-2026-07-15.md#6-現行49-tableの全-disposition)とする。本書には重複表を置かない。Phase DB-0でこの表をcolumn単位のdata dictionaryへ展開する。

## 5. API契約

### 5.1 Canonical `/api/v2`

代表的なresource契約:

| endpoint | 目的 |
|---|---|
| `POST /api/v2/auth/sessions` | BFF用session発行 |
| `DELETE /api/v2/auth/sessions/current` | current session revoke |
| `POST /api/v2/auth/password-recovery-requests` | reset token要求 |
| `POST /api/v2/auth/password-recoveries` | token消費とpassword更新 |
| `GET /api/v2/me/festival-participations` | active/history閲覧可能な年度参加 |
| `GET /api/v2/me/festival-participations/:festival_participation_id/application-cases` | 対象外・未着手・draft・latest submission/reviewを含む一覧projection |
| `PUT /api/v2/me/application-cases/:id/draft` | draft全体置換 |
| `POST /api/v2/me/application-cases/:id/submissions` | provided/no_requestを一transactionで提出 |
| `POST /api/v2/me/application-submissions/:id/withdrawal` | policyに基づく取下げ |
| `GET /api/v2/admin/application-cases` | festival year/application type/status/organization/participation filter、sort、pagination |
| `PATCH /api/v2/admin/review-cases/:id` | submission-level review更新 |
| `PATCH /api/v2/admin/review-items/:id` | item-level review更新 |
| `POST /api/v2/admin/review-cases/:id/comments` | participant/staff comment。optional `review_item_id`は同一case/submissionを検証 |

request/response/error/nullable/enum/pagination/idempotency/optimistic versionはOpenAPIを単一情報源とし、両Next appの型とclientを生成する。spec lint、breaking diff、生成差分をCI gateにする。

### 5.2 認証・認可

- participant endpointはURL/bodyの`festival_participation_id`を権限根拠にせず、current userのactive `participation_membership` scope内から取得する。
- admin endpointはrole名の単純比較ではなくcapabilityと対象scopeを検証する。
- existence leakを避ける403/404方針を全endpointで統一する。
- mutationはidempotency keyとoptimistic versionを必要に応じて必須にし、`idempotency_records`へ保存する。
- errorは`code`, `message_key`, `field_errors`, `request_id`の共通envelopeに統一し、SQL・内部例外・外部API responseを返さない。

### 5.3 Compatibility facade

- 未バージョンAPIと`/api/v1`は新規Target契約にしない。
- state-changing consumerはcutover前に`/api/v2`へ移し、cutover後のlegacy mutationは410とする。
- legacy readはAppendix Aの`legacy_resource_aliases`でIDを変換し、owner、consumer、廃止期限、利用metricsを持つ。
- legacy `GET /check_all_registered/:group_id`はlegacy group aliasをfestival participationへ解決し、application case projectionから旧responseを組み立てる。
- Targetの複数性を旧単数responseで表せない場合、黙って一件へ丸めず、廃止までserver-side capを強制するか409 migration-requiredを返す。

## 6. 新DBへのETL

### 6.1 実行方式

ETLをextract、raw staging、normalize、validate、load、reconcileに分ける。source DBはconsistent snapshotとしてread-onlyに扱い、Targetは毎回空DBから構築する。同じsource checksumとtransform versionから同じ結果を生成する。

全source PKは最終的に次のどちらか一つを持つ。

- `mapped`: 一つ以上のTarget row mappingとchecksumを持つ。
- `excluded_with_approval`: owner、理由、承認者、承認時刻、証跡を持つ。

`reject`は調査中であり最終状態ではない。cutover条件はunresolved reject 0である。

### 6.2 移行前profiling

production snapshotで最低限次をread-only計測する。

- table/columnごとのrow数、NULL、empty、distinct、min/max、最大長、invalid encoding。
- orphan、FK相当の不一致、`has_one`重複、自然キー重複。
- normalized email、provider/uid、reset tokenの重複・expiry・利用状態。
- source `groups`、`fes_years`、`group_categories`の組合せ、年度ごとのuser重複、organization候補。
- source `groups.user_id`のNULL/orphan、同一user/group重複、主代表候補。
- `un_registered_groups(group_id, order_type)`のduplicate、positive only、negative only、both、neither。
- fire placeholder、quantity 0/NULL、空文字、巨大入力。
- statusはあるがpayloadがない、payloadはあるがstatusがない、unknown enum。
- commentのmail status、author/recipient/templateを復元できる証拠の有無。
- `current_stocks`、`item_adjustments`、`stocker_items`、`rentable_items`の実利用、数量意味、参照先。
- attachment objectの存在、size、MIME、checksum。
- repository外consumer、運用script、Spreadsheet/BI、API access log。

profiling artifactにはsnapshot ID/GTID、query version、実行時刻、件数、checksumを残す。PIIをreportへ平文出力しない。

### 6.3 状態変換

legacy statusの初期mapping:

| source | Target |
|---|---|
| `unapproved` | `pending` |
| `waiting_resubmission` | `changes_requested` |
| `approved` | `approved` |

sourceにreview開始証跡がないため`in_review`を捏造しない。payload/no-requestはあるがrequired review statusがないrowは、policyがreview不要ならreview row 0件、review必須なら`missing_required_review_status` rejectとする。

`health_center_submission_statuses`はsubmission-levelの状態なので、同じstatusを全itemへ複製しない。item-level証跡がないlegacy申請は、legacy用requirement versionをsubmission scopeとするか、owner承認済みmappingを必要とする。

### 6.4 主な関連変換

- source `groups`一行からfestival participation一行を作る。organizationは承認済み年度横断mappingを使い、未承認ならlegacy groupごとに一件作る。
- source `groups.user_id`からorganization membershipとparticipation membershipを作る。user/organization/participationのscope不一致はrejectする。
- source `un_registered_groups`のnegative-onlyは該当caseの`no_request` version 1へ移す。positive+negative、duplicate、unknown order typeはrejectする。
- source positive rowは該当caseの`provided` version 1とtyped detailへ移す。
- legacy submit actorは復元できないため`submitted_by_membership_id = NULL`、`legacy_actor_unknown = true`とする。`groups.user_id`やmigration system userを提出本人として流用しない。
- `submitted_at`は対応statusの`updated_at`、なければsource rowsの最大`updated_at`を候補にし、`submitted_at_source`へ根拠を保存する。正確な提出時刻とは断定しない。
- source `sub_reps` positiveは`participation_contacts`とimmutable deputy snapshotへ、negativeは同じcaseの`no_request`へ移す。contactをuserへ推測統合しない。
- source food productは`participation_products`、revision 1の`participation_product_profiles`、`food_product_submission_items`へ移す。purchase/cookingは同じparticipation内product/profileを参照する。
- rental requestは`rental_request_submission_items`、割当結果は`rental_item_allocations`へ分離する。
- first/second/third等の横持ち希望はrank rowへ正規化する。
- `stool_tests`はemployee itemとの対応を確認できる場合だけreview item/eventへ移す。対応不能、duplicate、orphanはrejectする。
- legacy comment author/visibility/recipient/templateを推測しない。`legacy_unknown`とmigration provenanceを使い、participant APIへ内部/不明commentを露出しない。
- source在庫snapshotをmovementへ変換するかarchive/excludeするかはowner gateとし、actor不明時に架空のuserを作らない。
- `user_page_settings`は承認済みmappingからrequirement/version/publication/collection ruleへ変換する。

### 6.5 添付

- DB snapshotと同時点のobject manifestを作る。
- source key、target key、size、MIME、SHA-256、存在確認、copy結果を記録する。
- missing/corrupt/scan rejectedを成功扱いせずrejectにする。
- source object削除はcutover後のretentionと監査承認を経た別作業にする。

### 6.6 Reconciliation gate

以下が一致しない限りcutoverを承認しない。

- 全source PKのfinal dispositionが正確に一つ、unresolved rejectが0。
- source group一行につきfestival participation一行、各participationにつきorganization一件。
- organization統合mappingの承認証跡が全件存在し、名称一致だけの自動mergeが0。
- users、organizations、festival participations、organization/participation memberships、requirements、cases、submissions、items、review cases/itemsのFK violationが0。
- active festival participation×same-year active requirementのexpected case matrixと実caseが一致する。
- positive/no-request/not-started件数と、duplicate/both/neitherの最終dispositionが一致する。
- review scopeがnoneならcase/item 0件、submissionならcase 1/item 0件、item/bothならcase 1件とreview対象item数が一致する。
- review status件数と対象submissionが一致し、legacy statusをitemへ根拠なく複製していない。
- product/profile/food/purchase/cookingのparticipation一致とrevision参照が正しい。
- inventory movementsのdelta合計から再構築したbalanceと`inventory_balances`が一致する。
- rental/place/stage requestとallocationの件数・数量・scopeが一致する。
- attachment manifestの件数/checksumが一致する。
- 主要dashboard/CSVと無作為・high-risk標本の旧payload/新projectionが一致する。

## 7. 段階的実行計画

### Phase DB-0: Data dictionaryと業務gate

1. [全49 table disposition](./database-erd-current-and-target-2026-07-15.md#6-現行49-tableの全-disposition)をcolumn単位に展開する。
2. production snapshotをread-only profileし、変換規則・reject class・ownerを確定する。
3. organization年度横断mapping、主代表、過年度閲覧、複数active年度をADRで決める。
4. requirement key、applicability、review scope、allow_no_request、collection min/max、deadlineを承認する。
5. MySQL image、RPO/RTO、maintenance上限、PII、backup、retention、object copyを承認する。

完了条件: owner不明column、変換規則未定の申請、未担当reject class、未承認organization mappingがない。

### Phase DB-1: Target schemaとcontract test

1. owner順で空の専用Target DBへmigrationを作る。legacy DBには適用しない。
2. FK、NOT NULL、UNIQUE、CHECK、immutable history、optimistic lockをDB/application testで固定する。
3. `/api/v2` OpenAPI、error、idempotency、review scopeをschemaと同時に確定する。
4. outbox/delivery lease fencing、retry/dead-letter/outcome_unknown、audit/exportをcontract testで固定する。
5. migration/rollback/rebuildとlegacy URL/schemaへのnegative testをCIで実行する。

完了条件: 採用tableだけで空DBを再構築でき、OpenAPIとDB不変条件が自動testで一致する。

### Phase DB-2: ETL実装とstage rehearsal

1. extractor、staging、normalizer、validator、loader、reconcilerを分離する。
2. synthetic edge fixture、匿名化snapshot、production相当snapshotの順に空DBへ繰り返しloadする。
3. rejectをownerが解消し、transform versionを固定する。
4. attachment、mapping、件数、aggregate、checksumを照合する。
5. 所要時間をmaintenance budgetと比較し、安全なchunk単位を決める。

完了条件: 同一snapshotから同一Targetを複数回生成でき、unresolved rejectと照合差が0。

### Phase DB-3: `/api/v2`と両Next appのstage統合

1. 新API、user/admin Next app、workerをstage Target DBへ接続する。
2. production旧系は旧DBのまま運用し、dual-writeしない。
3. draft/submit/no-request/resubmit/withdraw、review case/item/comment、allocation、CSV/dashboardをE2E検証する。
4. 二重送信、stale update、worker crash、DB timeout、network断、object欠落をfault injectionする。
5. compatibility facadeの全consumer、alias、単数/複数契約、廃止期限を確認する。

完了条件: parity、security、integrity、performance、runbook rehearsalが合格し、legacy mutation consumerが0。

### Phase DB-4: Production cutover

1. change freezeとmaintenanceを開始し、ingress/BFFで旧系の新規mutationを拒否する。
2. producer/cron/callback/upload URL発行を停止し、in-flightとqueueをdrainする。
3. workerを停止し、旧application DB userのDML権限をrevoke、connectionを終了する。
4. upload TTL経過とstorage mutation停止を確認し、GTID/binlog watermark付きfinal DB snapshotとobject manifestを取得する。
5. 空のproduction Target DBへfinal ETLを実行し、第6.6節を全件照合する。
6. 新API/user/admin/worker/read-only facadeをwrite-disabledで起動し、auth、alias、主要read、attachmentをsmoke testする。
7. Target backupを取得し、別DBへのrestore/PITRがRPO/RTO内に成功することを確認する。
8. この時点までは新系を停止して旧系へfull rollbackできる。
9. 業務・DB・アプリ責任者がwrite-enableを承認する。
10. Target writeを有効にし、最初の成功request ID、GTID、時刻をpoint of no returnとして記録する。
11. 以後は旧DBへ戻さない。新DB互換imageへのrollback、PITR side restore、監査付きforward repairを使う。

### Phase DB-5: 観測と旧schema廃止

1. error/409/422、review case/item欠損、product effective revision/invalidation、movement/balance drift、queue/delivery lag、主要集計差を監視する。
2. compatibility facadeをconsumer単位で計測し、利用0のrouteから廃止する。
3. 旧DB/objectを期限付きread-only・暗号化・アクセス監査付きで保持する。
4. retentionと承認後に旧DB/objectとcompatibility-only tableを削除する。

## 8. Testと受入基準

### 8.1 状態・DB制約

- case、response、reviewを独立表現し、review不要を保存statusで偽装しない。
- `no_request`はitem/attachment 0件、`provided`はcollection policyを満たす。
- current draft最大一つ、version重複なし、submitted payload immutable。
- participation/case/requirementの年度一致、submission/item/review/productのscope一致をcomposite FKで拒否する。
- review scopeごとのcase/item件数が正確で、欠損時はfail-closedとなる。
- participation contact現在値とimmutable deputy snapshotを分離する。
- product effective revisionと過去snapshotを分離し、invalidation/再提出policyを検証する。
- inventory movement合計とbalance再構築が一致する。

### 8.2 並行実行・部分失敗

- submit連打は一version、同じresponseとなる。
- 同じidempotency keyで異なるpayloadは409。
- 複数tabのstale versionは409で、既存変更を上書きしない。
- Command/Orchestratorの各段階失敗でcase、submission、items、review、product、inventory、allocation、audit、outboxを全rollbackする。
- outbox/delivery worker crash後にlease expiryで回収し、古いgenerationの更新を拒否する。
- 非冪等providerの`outcome_unknown`を自動再送しない。
- Appendix Aの`cancellation_operations`を採用する場合だけ、callback重複・worker crash・compensationを試験する。
- deferred reporting tableを採用する場合だけ、dedupe/checkpoint/rebuildを試験する。

### 8.3 認証・認可

- active participation membershipのないfestival participation/caseへアクセスできない。
- URL/bodyの他organization/participation IDで越境できない。
- admin review case/item、internal comment、exportはcapabilityとauditを必須にする。
- compatibility facadeを含む全endpointにrole×ownership request specがある。
- Rails tokenがbrowser storage、session response、client bundle、client logに出ない。
- password recoveryは一回限り、expiry、rate limit、enumeration耐性、session revokeを満たす。

### 8.4 ETL

- negative only、positive only、both、neither、duplicate、fire placeholder、status mismatchをfixture化する。
- required review status不明時に`pending`/`in_review`を推測生成しない。
- organization自動mergeがなく、全source group mappingと承認証跡がある。
- legacy actor/reviewer/comment/inventory actorを捏造しない。
- expected festival participation×requirement matrixのmissing/extraが0。
- 全source PKがmapped/excluded_with_approvalのどちらか一つ。
- attachment missing/checksum mismatchを成功扱いしない。

### 8.5 Cutover

- Target taskはlegacy DB/signatureへDDL前に失敗する。
- API、worker、cron、callback、DB、object storageの全write経路をfenceできる。
- write-enable前の障害は旧系へfull rollbackできる。
- point of no return後は新DB互換image/PITR/forward repairで復旧できる。
- runbookを実装担当以外がstageで完走し、maintenance上限内に収める。

## 9. 未確認事項と実装前gate

次はコードだけでは断定できない。

1. production MySQLのpatch、設定、DB size、row数、slow query、RPO/RTO。
2. 旧年度の各source groupをどのorganizationへ統合するか。
3. 主代表をparticipation active時に正確に一人必須とするか。
4. membership終了後の過年度閲覧範囲と複数年度同時active可否。
5. 各申請keyのapplicability、no-request、collection min/max、review scope、deadline。
6. announcement、連絡先、副代表等の最大件数。
7. product profileを参照可能にする段階とinvalidation規則。
8. `current_stocks`、`item_adjustments`、`stool_tests`の実データ・consumer・列意味。
9. source `groups.uses_place_id`と貸出場所列の意味。
10. purchase date列の業務上の違い。
11. attachment保存先、object存在、容量、copy bandwidth。
12. PII retention、暗号化、匿名化、過年度閲覧権。
13. repository外API consumerと運用script。
14. 外部・非transactional取消が存在し`cancellation_operations`を必要とするか。
15. 非同期reporting projectionが必要か。
16. cross-table XOR/no-request制約にDB triggerを併用するか。

## 10. 採用しない案

- 年度seedの同じIDへ別年度値を上書きする運用。
- `un_registered_groups`へUNIQUEだけを追加して継続利用する案。
- 全申請をJSON blobだけで保存する案。
- 申請種別ごとにcase/version/review/idempotencyを完全複製する案。
- 全`has_one`を機械的に`has_many`へ変える案。
- user/adminごとに別DB schema・別業務serviceを作る案。
- 旧DB/新DB dual-write。
- point of no return後に旧DBをactiveへ戻す通常rollback。
- legacy actor、reviewer、recipient、organization統合を推測で補完する案。

## Appendix A: 移行専用・互換専用・条件付きtable

以下は78 tableのsteady-state runtime proposalには含めない。

| 区分 | table | 扱い |
|---|---|---|
| migration provenance | migration_batches, migration_record_mappings, migration_rejects | 別migration schema。retention方針に従って保持 |
| compatibility only | legacy_resource_aliases, legacy_id_sequences | legacy consumerが0になった後に削除 |
| conditional | cancellation_operations | 外部・非transactional取消が確認された場合だけ追加 |
| deferred | reporting_projection_events, reporting_projection_checkpoints | 非同期read modelが必要と確認された場合だけ追加 |

~~~mermaid
erDiagram
  migration_batches {
    bigint id PK
    string source_schema_identity "NOT NULL"
    string target_schema_identity "NOT NULL"
    string source_snapshot_id "NOT NULL"
    string source_snapshot_checksum "NOT NULL"
    string transform_version "NOT NULL"
    string status "planned running reconciled failed"
    bigint source_record_count
    bigint mapped_record_count
    bigint excluded_record_count
    bigint reject_count
    string reconciliation_checksum
    datetime started_at
    datetime finished_at
  }
  migration_record_mappings {
    bigint id PK
    bigint migration_batch_id FK "NOT NULL; UNIQUE(batch,source,target)"
    string source_table "NOT NULL"
    string source_id "NOT NULL"
    string target_table "NOT NULL"
    string target_id "NOT NULL"
    integer mapping_ordinal "NOT NULL default 0"
    string transformation_key "NOT NULL"
    string source_checksum "NOT NULL"
    string target_checksum "NOT NULL"
    text provenance_json "PII-redacted normalization/status/timestamp evidence"
    string transform_version "NOT NULL"
  }
  migration_rejects {
    bigint id PK
    bigint migration_batch_id FK "NOT NULL"
    string source_table "NOT NULL"
    string source_id
    string reject_code "NOT NULL"
    text redacted_details "NOT NULL"
    string status "open excluded_with_approval corrected"
    bigint resolved_by_user_id "runtime users FK"
    datetime resolved_at
  }
  legacy_resource_aliases {
    bigint id PK
    bigint migration_batch_id FK "NOT NULL"
    string resource_type "legacy type; UNIQUE(type,legacy_id)"
    string legacy_id "NOT NULL"
    string target_type "NOT NULL"
    bigint target_id "NOT NULL; reverse mapping UNIQUE when 1:1"
    datetime expires_at "NOT NULL"
  }
  legacy_id_sequences {
    bigint id PK
    string resource_type UK "NOT NULL"
    bigint next_legacy_id "NOT NULL"
    datetime expires_at "NOT NULL"
  }
  cancellation_operations {
    bigint id PK
    bigint application_case_id "runtime FK"
    bigint application_submission_id "runtime FK"
    bigint idempotency_record_id "runtime FK"
    string status "pending running compensated completed failed"
    string current_step
    string external_reference
    text redacted_state_json "versioned saga state only"
    integer lock_version "NOT NULL default 0"
  }
  reporting_projection_events {
    bigint id PK
    bigint outbox_event_id "runtime FK; UNIQUE(projection,event)"
    string projection_key "NOT NULL"
    string partition_key "NOT NULL"
    string status "pending applied failed"
    datetime applied_at
  }
  reporting_projection_checkpoints {
    bigint id PK
    string projection_key "NOT NULL; UNIQUE(projection,partition)"
    string partition_key "NOT NULL"
    bigint last_event_sequence "NOT NULL"
    datetime updated_at "NOT NULL"
  }

  migration_batches ||--o{ migration_record_mappings : maps
  migration_batches ||--o{ migration_rejects : rejects
  migration_batches ||--o{ legacy_resource_aliases : aliases
~~~

移行schemaとruntime schemaを跨ぐFKは、利用するMySQL構成で保証可能な場合だけindexed FKとする。保証できない場合も、loader/reconcilerの存在検査とartifactで同等のgateを設ける。compatibility tableは無期限に業務domainへ昇格させず、owner・利用metrics・削除期限を必須にする。
