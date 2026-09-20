# group-manager-2 リファクタリング計画書

作成日: 2026-06-10 / 最終更新: 2026-06-10
ステータス: ドラフト（フェーズ0でレビュー・合意する）

---

## 1. はじめに

### 1.1 目的

本計画は、group-manager-2 を「来年度の学生が3日で開発に参加できる状態」にするための段階的リファクタリング計画である。一括の書き直しは行わない。年次の学園祭サイクル（例年9月中旬開催）の中で、**本番を止めずに**進める。

長年の開発で蓄積した以下の負債を、6つのフェーズで解消する。

- EOL（サポート終了）を迎えたフレームワーク・ランタイム群
- 死蔵されたアプリケーション（user_front/）と設定ファイル
- 大規模なコード重複（API・フロントエンド双方）と N+1 クエリ
- ほぼ存在しないテストと、テストを実行しない CI

### 1.2 読者

現役および次年度の NUTFes 開発メンバー。Rails / Next.js の基礎知識のみを前提とし、各フェーズに背景説明を含める。

### 1.3 この文書の使い方

- 付録 10.3 の進捗チェックリストを**生きた文書**として更新する。PR がマージされるたびに、該当項目へ完了日と PR 番号を追記する。
- 凍結カレンダー（3.2節）の日付は毎年4月に更新する。
- 計画と実態がずれたら、本書を直すこと自体を PR にする。

### 1.4 用語

| 用語 | 意味 |
|---|---|
| 特性テスト (characterization test) | 「正しい挙動」ではなく「**現状の挙動**」を固定するテスト。リファクタリングで挙動が変わっていないことを検出するための安全網 |
| ゴールデンファイルテスト | 期待出力（CSV等）をファイルとして保存し、実出力と比較するテスト |
| ストラングラー方式 | 旧システムを稼働させたまま、新システムへ機能単位で段階的に置き換える移行方式 |
| クラスA/B/C | 変更リスク分類（3.2節） |

---

## 2. 現状分析（2026年6月時点）

### 2.1 リポジトリ構成と現役/死蔵の判定

| ディレクトリ | スタック | 状態 | 根拠 |
|---|---|---|---|
| `api/` | Rails 6.1.3.1 / Ruby 3.0.7（共にEOL） | **本番現役** | group-manager-api.nutfes.net（cloudflare/prod/config.yaml） |
| `user/` | Next.js 15.0.3 / React 19 **RC版** / pnpm / TS strict | **本番現役・最活発** | group-manager.nutfes.net。直近6ヶ月で最多コミット |
| `admin_view/nuxt-project/` | Nuxt 2.15.8 / Vue 2 / Vuetify 1.11.2 / webpack 4 / Node 16.13.1 / axios 0.21.1（**全てEOL**） | **本番現役** | group-manager-admin.nutfes.net。保守コミット継続中 |
| `user_front/` | Nuxt 3 | **死蔵** | compose.prod.yml でコメントアウト済み、直近6ヶ月のコミット2件、.coderabbit.yaml でレビュー対象外指定、cloudflare 設定に不在 |

`user/` はホーム1ページに14種の申請フォームをコンポーネントとして集約する SPA 設計であり、旧 `user_front/`（25ページ）の機能は移行済み。

### 2.2 主要な問題の一覧

#### API（api/）

| # | 問題 | 証拠 | 深刻度 |
|---|---|---|---|
| A1 | `app/models/group.rb` が **908行**。`with_order_infos` / `with_order_info` / `with_order_info_narrow_down_by_fes_year` / `with_order_info_narrow_down_by_search_word`（87行目〜、各約70行）がほぼ完全な複製。全件 `.map` 内でアソシエーション参照する N+1 | `api/app/models/group.rb:87-364` | 高 |
| A2 | 上記以外にも `with_Xs` / `with_X(id)` の同型メソッドペアが11組、計41個のクラスメソッド | `api/app/models/group.rb` | 高 |
| A3 | `api/v1/output_csv_controller.rb` が **683行**・13系統のCSV出力。`includes` なしで `group.user.name` 等を参照する N+1 | `api/app/controllers/api/v1/output_csv_controller.rb:22-38` ほか | 高 |
| A4 | レガシーCRUDコントローラ3本（rental_orders / place_orders / stage_orders、各70行）が完全コピペ | `api/app/controllers/*_orders_controller.rb` | 高 |
| A5 | `/api/v1` 配下の `*_api_controller.rb` 約10本に「index_for_admin_view / show_for_admin_view / refinement / search」の同型4メソッド族が複製 | `api/app/controllers/api/v1/` | 中 |
| A6 | `config/routes.rb` が **367行**。レガシー直下ルート（`/groups` 等）と `/api/v1` namespace が併存し、**user/ と admin_view の両方が両系統を混在利用** | `api/config/routes.rb` | 高 |
| A7 | シリアライザ gem なし。19モデルに手書き `to_info_h` 系メソッド（`to_place_name_h`、`to_rental_item_info_h` など命名不統一） | `api/app/models/sub_rep.rb:9-21` ほか | 中 |
| A8 | テスト **79ファイル中、実体があるのは2ファイルのみ**（cooking_process_orders_controller_test.rb: 379行、group_test.rb 等）。残りは scaffold 雛形。カバレッジ推定 5〜10% | `api/test/` | 高 |
| A9 | **CI でテストが一切実行されていない**（RuboCop の自動修正のみ） | `.github/workflows/api-code-quality.yml` | 高 |
| A10 | 到達不能コード: `current_stocks_controller.rb` はルート定義が存在しない。`current_stock` / `item_adjustment` モデル・テーブルも未使用 | `api/config/routes.rb`（current_stock の記述なし） | 中 |
| A11 | `slack-notifier` gem が未使用（実コードは slack-ruby-client の `Slack::Web::Client` のみ）。`jbuilder` もビュー不使用 | `api/Gemfile:43-44`, `api/app/controllers/groups_controller.rb:36` | 低 |
| A12 | Puma 4.1（現行 6.x）、テーブル48・マイグレーション84本 | `api/Gemfile` | 中 |

#### ユーザー画面（user/）

| # | 問題 | 証拠 | 深刻度 |
|---|---|---|---|
| U1 | React **19.0.0-rc**（RC版）を本番使用 | `user/package.json:38` | 高 |
| U2 | `src/api/` 21ファイル・**2,461行**: `ApiResponse<T>` 型が**11箇所で重複定義**、エンドポイントURL定数が各ファイルに分散、`useGetXxx` 系フック38個が同型コピペ（scaffdog 生成） | `user/src/api/` | 中 |
| U3 | Playwright e2e が1本のみ（cooking-process-order.spec.ts） | `user/e2e/` | 中 |
| U4 | デッドページ: `test_pr.tsx`、`test_venuemap.tsx` | `user/src/pages/` | 低 |

※ ESLint 9 / TypeScript strict / Prettier / Storybook は整備済みで、3フロントエンド中もっとも健全。

#### 管理画面（admin_view/）

| # | 問題 | 証拠 | 深刻度 |
|---|---|---|---|
| M1 | Nuxt 2 / Vue 2 / Vuetify 1.11.2 / webpack 4 / Node 16.13.1 / axios 0.21.1 が**すべて EOL**。セキュリティパッチを受けられない | `admin_view/nuxt-project/package.json`, `admin_view/Dockerfile` | 高 |
| M2 | **91ページ・約32,000行**の CRUD 画面がほぼ同一構造のコピペ | `admin_view/nuxt-project/pages/` | 高 |
| M3 | `$axios` を90ファイルで直書き（URL集約なし）。Vuex の getter から dispatch を呼ぶ等のアンチパターン | `admin_view/nuxt-project/store/users/index.js` | 中 |
| M4 | ESLint 7 / Prettier 2（古い）、TypeScript なし、テストなし、CI なし | `admin_view/nuxt-project/package.json` | 中 |

#### インフラ・横断

| # | 問題 | 証拠 | 深刻度 |
|---|---|---|---|
| I1 | 死蔵 Dockerfile 3本: `api.prod.Dockerfile`（**Ruby 2.7.1**・未参照）、`front.prod.Dockerfile`（user_front 用）、`admin.prod.Dockerfile`（compose.prod.yml は `admin_view/prod.Dockerfile` を参照） | リポジトリ直下 | 中 |
| I2 | Renovate / Dependabot 未設定。依存更新がすべて手動 | `.github/` | 中 |
| I3 | compose.yml に MySQL パスワード平文。`webhook.env` を参照するがテンプレートが存在せず、新規セットアップで詰まる | `compose.yml:6,8,20,35` | 中 |
| I4 | CI が RuboCop / ESLint の**自動修正を bot が `[skip ci]` 付きで自動コミット**する方式。テスト失敗を隠すリスク | `.github/workflows/api-code-quality.yml` | 中 |
| I5 | README.md が「Ruby 2.7.1 / Node v12 / @vue/cli」と実態から完全乖離。`roo.md` と `AGENTS.md` がほぼ重複。`api/er.png` と `api/erd.png` が重複（各約700KB、`make erd` の生成物は er.png） | `README.md`, `roo.md` | 中 |
| I6 | Makefile に user_front 向けの死蔵ターゲット `build-gm2` / `build-gm2-mac`。compose.stage.yml に user_front サービスが残存 | `Makefile`, `compose.stage.yml` | 低 |

### 2.3 なぜ今やるのか

1. **EOL 依存が10件**（Ruby 3.0 / Rails 6.1 / Puma 4 / React 19 RC / Node 16 / Nuxt 2 / Vue 2 / Vuetify 1 / webpack 4 / axios 0.21）。脆弱性が公表されてもパッチを当てられない状態。
2. **テストなしの状態が続くほどリファクタリングのコストは増える**。コードは毎年増えており、負債の利息が複利で効いている。
3. **学生団体特有の引き継ぎコスト**。毎年メンバーが入れ替わるのに、「読まなくていい死蔵コード」13,000行と「同じことを別々の書き方でやるコード」が新人の学習を妨げている。

---

## 3. 全体戦略

### 3.1 順序の原則

1. **安全網を先に作る**（フェーズ1）— テストなしのリファクタリングは事故る
2. **消せるものを消す**（フェーズ2）— 死蔵コードはテストを書く価値すらない
3. **振る舞いを変えないリファクタリング**（フェーズ3）— 特性テストが緑のまま内部を直す
4. **フレームワークアップグレード**（フェーズ4・5）— コードが小さく・テストがある状態で行う方が差分が小さい
5. **admin_view リライト**（フェーズ6）— 最大工数の作業は、API 面が整理された後に行う

### 3.2 変更リスク分類と凍結カレンダー

| クラス | 定義 | 例 | 実施可能時期 |
|---|---|---|---|
| **A** | 本番挙動に無関係 | CI 追加、docs、テスト追加、開発環境設定 | 通年 |
| **B** | 振る舞い不変の内部変更（特性テストで担保） | group.rb 統合、N+1 解消、user/ API 層整理 | 凍結期間外 |
| **C** | 外部仕様・基盤に触る | ルート削除、テーブル削除、Rails/Ruby アップグレード、ドメイン切替 | **学園祭後の窓（10月〜翌4月）のみ** |

**凍結カレンダー**（毎年4月に日付を更新する）:

| 期間 | ルール |
|---|---|
| 4月〜8月上旬（申請受付期間） | クラス A / B のみ。B は stage 確認必須 |
| 8月中旬〜学園祭最終日（9月中旬） | **本番デプロイ全面凍結**（hotfix を除く）。develop へのマージは継続可 |
| 学園祭翌週〜3月 | クラス C の窓。DB 変更・ルート削除・アップグレードはここで行う |

### 3.3 ブランチ・PR 運用ルール

- 1PR の目安は**差分400行以下**（削除のみの PR は除く）。
- リファクタリング PR は「**対象の挙動を固定するテストが先に存在すること**」をレビュー条件とする。
- RuboCop / ESLint の bot 自動コミットはフェーズ1で check-only に変更する（I4 の解消）。
- `gm3/develop` に rails test を必須チェックとして設定する（フェーズ1）。

### 3.4 フェーズ依存関係と並行可能性

```
F0 ─→ F1 ─→ F2 ──→ F3(API側 3A-3D) ─→ F5(Rails/Ruby)
       │     │  └─→ F3(user側 3E) ─┐
       │     └────────→ F4 Step1-2 ─┴→ (観測) → F4 Step3
       └（インフラ整備は通年並行）        F4完了 ─→ F6(adminリライト)
```

並行可能な組み合わせ:
- F1 と F2 の大半
- F3 の 3A〜3D（API 担当）と 3E（user 担当）
- F4 Step1〜2 と F3 後半
- F5 と F4 の観測期間

---

## 4. 成功指標

| 指標 | 現状 | 目標（達成フェーズ） | 計測方法 |
|---|---|---|---|
| `api/app/models/group.rb` 行数 | 908 | **300以下**（F3） | `wc -l` |
| `api/config/routes.rb` 行数 | 367 | 230以下（F4）→ **180以下**（F6） | `wc -l` |
| `output_csv_controller.rb` 行数 | 683 | **120以下**＋services 分割（F3） | `wc -l` |
| `user/src/api/` 合計行数 / ApiResponse 重複 | 2,461 / 11定義 | **1,500以下 / 1定義**（F3） | `wc -l`, grep |
| リポジトリ削減行数 | — | **-15,000行以上**（F2） | PR diff 累計 |
| API テストカバレッジ（line） | 推定5〜10% | 全体30%以上、**リファクタ対象ファイル80%以上**（F1〜F3） | SimpleCov |
| CI でのテスト実行 | なし | api: rails test 必須化 / user: build＋型 / admin: build スモーク（F1） | branch protection |
| EOL・非安定依存の数 | **10** | F1後 9 → F5後 6 → **F6後 0** | 本表を更新 |
| レガシー直下ルートへの本番アクセス | 多数 | **0**（F4 Step3 でルート削除） | deprecation ログ集計 |
| 死蔵ファイル（Dockerfile 3、erd.png、roo.md、テストページ2 等） | 8+ | **0**（F2） | チェックリスト |

---

## 5. フェーズ詳細

---

### フェーズ0: 計画合意と運用基盤

**時期**: 2026年6月（約1週間）/ **規模**: S / **リスククラス**: A

**目的**: 本計画をチームの合意事項にし、凍結カレンダーと PR 運用を発効させる。

**作業項目**:
1. 本計画書 `docs/refactoring_plan.md` のドラフト PR をチーム全員でレビューし、マージする
2. 今年度の学園祭日程を確認し、3.2節の凍結カレンダーに具体日付を記入する
3. `gm3/develop` の branch protection 設定を確認する（必須チェックの追加は F1 で行う）
4. GitHub リポジトリ設定で secret scanning / push protection を有効化する

**完了条件 (DoD)**: 計画 PR がマージされ、凍結カレンダーの日付が確定記載されている。

**リスクと対策**: 合意形成が長引く → ドラフト PR 上で章単位にコメントを収集する。フェーズ1のクラス A 作業（CI 整備）は合意完了を待たず先行着手してよい。

---

### フェーズ1: 安全網の構築

**時期**: 2026年6〜7月（3〜4週間）/ **規模**: M〜L / **リスククラス**: A 中心 / **PR 約12本**

**目的**: 「テストが CI で走り、落ちたらマージできない」状態を作る。リファクタリング対象3領域（group.rb / Order系コントローラ / CSV出力）の現在の挙動を**特性テスト**で凍結する。

**方針**:
- 全網羅はしない。**リファクタリングで触るコードパスだけを守る**。
- テストフレームワークは **minitest 継続**。`api/test/controllers/cooking_process_orders_controller_test.rb`（379行）の先例と fixtures 基盤を流用する。RSpec 移行は学習コストに見合わない。
- 特性テストは現状の**バグ込み**の挙動を固定してよい。目的は「変えないこと」の検出。バグ修正は別 PR で「テスト修正＋実装修正」をセットで行う。

**PR 分解**:

| PR | 内容 | 対象パス | 規模 |
|---|---|---|---|
| 1-1 | SimpleCov 導入＋カバレッジ出力 | `api/Gemfile`, `api/test/test_helper.rb` | S |
| 1-2 | **API テスト CI 新設**（mysql:8.0 service コンテナ＋healthcheck 待ち、`db:test:prepare` → `bin/rails test`）。required check 化 | `.github/workflows/api-test.yml`（新規） | S |
| 1-3 | 共通 fixtures 整備（fes_years, fes_dates, users, groups, group_categories＋order 系最小データ。cooking テストの既存 fixtures を流用） | `api/test/fixtures/*.yml` | M |
| 1-4 | `Group.with_order_info*` 4メソッドの特性テスト（返り値を JSON 化してスナップショット比較） | `api/test/models/group_order_info_test.rb`（新規） | M |
| 1-5 | レガシー Order 系3コントローラの request テスト（index/show/create/update/destroy/get_by_group_id × 正常/404） | `api/test/controllers/{rental,place,stage}_orders_controller_test.rb` | M |
| 1-6 | admin 系 `*_api` コントローラ代表の request テスト（groups_api 等の4メソッド族） | `api/test/controllers/api/v1/` | M |
| 1-7 | CSV 出力のゴールデンファイルテスト（13系統のうちまず groups / rental_orders / food_products の3本。期待 CSV を `test/fixtures/files/csv/` に保存し正規化比較） | `api/test/controllers/api/v1/output_csv_controller_test.rb` | M |
| 1-8 | **CI 改善**: RuboCop / ESLint の auto-commit を check-only に変更（bot コミットが `[skip ci]` でテスト結果を隠す問題の解消）。user CI に `pnpm run build` を追加 | `.github/workflows/api-code-quality.yml`, `user-code-quality.yml` | S |
| 1-9 | admin_view ビルドスモーク CI（`admin_view/**` 変更時に docker build を実行） | `.github/workflows/admin-build.yml`（新規） | S |
| 1-10 | **Renovate 導入**（週次、minor/patch をグループ化、major は個別、admin_view は security のみ） | `renovate.json`（新規） | S |
| 1-11 | シークレット衛生: `webhook.env.example` 新規作成、compose.yml の MySQL パスワードを `.env` 参照化、README に手順記載。過去に webhook URL がコミットされていないか履歴確認し、疑わしければローテーション | `compose.yml`, `webhook.env.example` | S |
| 1-12 | user/: **React 19 RC → 19 安定版**＋Next.js patch 更新（e2e と stage 手動確認チェックリスト付き） | `user/package.json` | S |

**PR 外のインフラ作業**: 管理画面ドメイン（group-manager-admin.nutfes.net）に **Cloudflare Access** を設定し、EOL スタック（Nuxt 2 / Node 16）の外部露出を遮断する。`cloudflare/` 配下の構成を運用者と実施。

**完了条件 (DoD)**:
- PR に対し rails test が必須チェックとして実行され、落ちるとマージ不可
- 特性テストがリファクタ対象3領域をカバー（group.rb 対象メソッド・Order 系コントローラ・CSV 3系統で line 80%以上）
- Renovate の初回 PR 群がトリアージ済み
- React が安定版

**リスクと対策**:
- fixtures 整備が沼る → 対象3領域に必要な最小限に絞る。完璧な fixtures を目指さない
- mysql8 の CI 起動が不安定 → healthcheck 待ちを入れる

---

### フェーズ2: 削除と整理

**時期**: 2026年7月（1〜2週間、F1と並行可）/ **規模**: M（大半が削除）/ **リスククラス**: A〜B / **PR 7本**

**目的**: user_front と死蔵物を消し、ドキュメントを実態に合わせる。「読まなくていいコード」をリポジトリから消すことが最大のオンボーディング改善。

**PR 分解**（番号順に実施。**参照を先に消してから本体を消す**）:

| PR | 内容 | 対象パス | 規模 |
|---|---|---|---|
| 2-1 | compose 群と Makefile から user_front 参照を除去（compose.yml / compose.stage.yml の user_front サービス、compose.prod.yml のコメントブロック、Makefile の `build-gm2` / `build-gm2-mac`）。**適用後に stage を再デプロイして正常確認** | `compose*.yml`, `Makefile` | S |
| 2-2 | ルート死蔵 Dockerfile 3本削除（`api.prod.Dockerfile`＝Ruby 2.7.1・未参照、`front.prod.Dockerfile`＝user_front 用、`admin.prod.Dockerfile`＝未参照） | リポジトリ直下 | S |
| 2-3 | `git tag archive/user_front-2026` を打った上で **`user_front/` 全削除**（約13,000行）。`.coderabbit.yaml` の除外設定も削除 | `user_front/`, `.coderabbit.yaml` | L（削除のみ） |
| 2-4 | user/ デッドページ削除 | `user/src/pages/test_pr.tsx`, `test_venuemap.tsx` | S |
| 2-5 | api 到達不能コード削除: `current_stocks_controller.rb`（ルート定義なし）、`current_stock.rb` / `item_adjustment.rb` モデルと関連参照。**テーブル削除はこの時点では行わない**（F4 で実施） | `api/app/controllers/`, `api/app/models/` | S |
| 2-6 | Gemfile 整理: `slack-notifier` 削除（実コードは slack-ruby-client のみ使用）、`jbuilder` 削除（ビュー不使用）。バージョンアップ自体は F5 で | `api/Gemfile` | S |
| 2-7 | ドキュメント刷新: README.md 全面書き換え（実態の技術スタック・`make build-gm3` 手順・凍結カレンダーへのリンク）、`roo.md` を削除し `AGENTS.md` に一本化（user_front 記述も削除）、`api/erd.png` 削除 | `README.md`, `AGENTS.md`, `roo.md`, `api/erd.png` | M |

**完了条件 (DoD)**:
- `git grep -i user_front` が履歴的言及（本書等）以外で0件
- 新メンバーが README だけで `make build-gm3` から起動できることを1人で検証済み
- 死蔵ファイル指標が0

**リスクと対策**:
- 「実は user_front を使っている人がいた」 → 削除前に Slack で**周知期間1週間**。タグ `archive/user_front-2026` からいつでも復元可能と README に記載
- compose.stage.yml には user_front サービスが現役定義のため、**2-1 → stage 確認 → 2-3 の順序を厳守**

---

### フェーズ3: 振る舞いを変えないリファクタリング

**時期**: 2026年7月〜11月 / **規模**: L（人手の山場その1）/ **リスククラス**: B / **PR 約20本**

**目的**: 特性テストを緑に保ったまま、重複と N+1 を除去する。

**凍結対応**: 8月中旬〜学園祭の凍結期間は develop へのマージのみ行い、本番反映は停止。凍結中に溜めた変更は学園祭後の最初の週に stage で一括検証してから本番反映する。**凍結前に反映できるものは小刻みに反映し、溜めすぎない**。

**並行トラック**: 3A〜3D（API 担当）と 3E（user 担当）は完全並行可。

#### トラック 3A: group.rb の統合

| PR | 内容 | 規模 |
|---|---|---|
| 3A-1 | `with_order_infos` / `with_order_info` / `with_order_info_narrow_down_by_fes_year` / `with_order_info_narrow_down_by_search_word`（計約280行）を、スコープ＋単一ビルダー `build_order_info(group)` に統合。`includes`（user, fes_year, group_category, sub_rep, place_order, stage_orders, power_orders, rental_orders→rental_item, employees, food_products→purchase_lists, public_relation, venue_map, announcement, cooking_process_order）を付与し N+1 解消 | M |
| 3A-2 | `with_Xs` / `with_X(id)` 同型ペア11組と `narrow_down_by_*` 族を汎用化して統合 | M |
| 3A-3 | order_info 系ロジックを `api/app/queries/group_order_info_query.rb`（新設）へ抽出し、group.rb を関連定義＋バリデーション＋薄いスコープのみにする | M |

**完了条件**: group.rb 300行以下、特性テスト緑（JSON 完全一致）、クエリ数の上限をテストで固定し削減を確認。

#### トラック 3B: コントローラ重複の排除

| PR | 内容 | 規模 |
|---|---|---|
| 3B-1 | レガシー CRUD 系3本（rental_orders / place_orders / stage_orders）を基底クラス `ScaffoldCrudController`（共通 CRUD＋`get_by_group_id`。サブクラスは `resource_class` / `permitted_params` のみ定義）に集約 | M |
| 3B-2〜3 | `/api/v1` の `*_api_controller` 約10本に複製された4メソッド族（index_for_admin_view / show_for_admin_view / refinement / search）を concern `AdminResourceListable` に抽出。2〜3本ずつ段階 PR | M×2 |

**完了条件**: 1-5 / 1-6 の request テスト緑、対象コントローラ合計行数 40%減。

#### トラック 3C: CSV / PDF のサービス抽出

| PR | 内容 | 規模 |
|---|---|---|
| 3C-1 | `app/services/csv/` を新設し、ゴールデンテスト済みの3系統（groups / rental_orders / food_products）を `Csv::GroupsCsvBuilder` 等へ移設、`includes` で N+1 解消 | M |
| 3C-2〜3 | 残り10系統を5系統ずつ移設。**各 PR の前にゴールデンテストを追加してから移す** | M×2 |
| 3C-4 | `print_pdf_controller.rb`（180行）と `health_center_submission_statuses_api_controller.rb`（267行）のデータ整形をサービスへ抽出。PDF はバイナリ比較せず「整形済みデータ構造」を単体テストで固定（wkhtmltopdf 出力は非決定的） | M |

**完了条件**: output_csv_controller.rb 120行以下（ルーティング→ビルダー呼び出しのみ）、全13系統にゴールデンテスト、CSV 生成時のクエリ数削減。

#### トラック 3D: シリアライズ統一

- **Alba** を導入し（軽量・DSL が小さく学生向き）、19モデルの `to_info_h` / `to_place_name_h` / `to_rental_item_info_h` 等を `api/app/serializers/` へ移設する。
- **キー名・構造は現状と完全一致させる**（特性テストで担保）。モデル5〜6個ずつ、3〜4PR に分割。
- 完了後、「モデルへの `to_*_h` 新設禁止」を AGENTS.md とレビュー規約に明記。

**完了条件**: モデル内の手書きシリアライズメソッド0、JSON レスポンス不変。

#### トラック 3E: user/ API 層の統一

| PR | 内容 | 規模 |
|---|---|---|
| 3E-1 | `user/src/api/core/` 新設: 既存 `api.ts` の共通 fetcher を `client.ts` へ、`ApiResponse<T>` / `ApiError` を `types.ts` へ、全エンドポイント URL を `endpoints.ts` の定数オブジェクトへ集約 | M |
| 3E-2 | SWR フックの汎用 factory `createApiHooks`（useGet / useGetList / useCreate / useUpdate / useDelete）を新設＋**Vitest 単体テスト導入** | M |
| 3E-3〜6 | 21ファイルをドメイン単位（4〜5ファイルずつ、最大の `rentItemsApi.ts` は単独 PR）で factory ベースに置換。`ApiResponse` 重複定義を 11→1 へ | M×4 |
| 3E-7 | `.scaffdog/templates` を factory 前提に更新（今後生成されるコードが新パターンになるように） | S |

**完了条件**: `src/api/` 1,500行以下、ApiResponse 定義1箇所、エンドポイント定義1ファイル、type-check / lint / build / e2e 緑、主要フォーム14種の手動回帰チェックリスト消化（凍結明けに stage で実施）。

**フェーズ3全体のリスクと対策**:
- `includes` 追加で JSON の並び順・nil 挙動が変わることがある → 特性テストは**並び順も含めて比較**。差異が出たら `order` を明示
- user/ のフォーム14種の回帰確認が手動 → 確認チェックリストを `docs/` に追加し、Playwright e2e を1本→3本（代表的な申請）へ漸増

---

### フェーズ4: ルート統一と DB クリーンアップ

**時期**: 2026年10月〜12月（学園祭後の窓）/ **規模**: M〜L（観測期間込み2〜3ヶ月）/ **リスククラス**: B〜C / **PR 約12本**

**目的**: レガシー直下ルートを廃止し `/api/v1` に一本化する。未使用テーブルを削除する。**3ステップ方式**で後方互換期間を設ける。

#### Step 1: API 側に新ルート追加（追加のみ・クラスB）

- `api/config/routes.rb` で、レガシーリソース群（groups, users, rental_orders, employees, fes_years, stocker_places 等約37リソース＋ `/sunny/stages`・`/rainy/stages`・`/check_all_registered` などの非リソース型）を **`scope path: '/api/v1'`**（module 指定なしの scope。`namespace` だとコントローラを `Api::V1::` へ移動する必要が生じるため不可）で二重マウントする。
- **衝突注意**: `/api/v1/users/*` には既存の動詞型ルートとの競合候補がある。`bin/rails routes` の前後 diff を PR に添付し、request テストで両系統のルーティング先を固定する。
- `ApplicationController` にレガシーパス（`/api/v1` でも `/api/auth` でもない API パス）への deprecation ログを仕込む: `Rails.logger.warn("[LEGACY-ROUTE] #{request.method} #{request.path}")`
- admin 系の動詞型 URL（`get_xxx_for_admin_view` 等）の**リソース型への正規化はこのフェーズではやらない**（F6 のリライトで新エンドポイントに寄せる。二重リネームの事故を避ける）。
- PR: ルート二重化1本＋deprecation ログ1本。

#### Step 2: フロント切替（リソース単位で分割・クラスB〜C）

- **user/**: 3E-1 で `endpoints.ts` に一元化済みのため、パス定数の書き換えが中心。ドメイン単位で2〜3PR。
- **admin_view/**: `$axios` 直書き90ファイルのうちレガシーパス利用箇所（`/fes_years` 35箇所、`/stocker_places` 14箇所ほか）を**機械的置換**（`"/fes_years` → `"/api/v1/fes_years` 等）。リソース単位で3〜4PR に分割し、各 PR ごとに stage で該当画面を目視確認。**Nuxt 2 側のロジックには一切触れない**（文字列のみ）。
- PR: 計6〜7本。

#### Step 3: レガシールート削除（クラスC）

- deprecation ログで**ゼロ件を2〜4週間観測した後**に routes.rb のレガシースコープを削除（1PR）。「ゼロ件観測」が唯一の削除条件であり、期間ではなく実測で判断する。
- 削除後1ヶ月は 404 を監視。routes.rb 内の TODO コメント（`current_user/regist_info` 統合等）もここで処理。
- 目標: routes.rb 230行以下。

#### DB クリーンアップ（クラスC・学園祭後の窓）

手順: (1) 本番 mysqldump でテーブル単位バックアップ → (2) `current_stocks`・`item_adjustments` の drop_table マイグレーション（down で再作成可能な reversible 実装）→ (3) stage で適用確認 → (4) 本番適用。復元手順書を `docs/` に置いてから実施する。

マイグレーション84本の squash は**やらない**（新規環境は `db:schema:load` で足りる。本番リスクに見合わない）。

**完了条件 (DoD)**:
- レガシーパスへの本番アクセス0件が観測された後にルート削除済み
- user/・admin_view 全画面が `/api/v1` のみ使用
- 未使用テーブル0
- `make openapi`（r2-oas）で生成される API 仕様が単一 namespace に整理されている

**リスクと対策**:
- 切替漏れの画面が翌年まで発覚しない → deprecation ログの集計を削除前の必須ゲートにする
- admin_view の置換ミス → 文字列置換のみ・リソース単位 PR・stage 目視のトリプルチェック。ロールバックは revert で即時可能

---

### フェーズ5: Rails 7.1 / Ruby 3.2 アップグレード

**時期**: 2026年11月〜2027年2月（学園祭後の窓）/ **規模**: M / **リスククラス**: C / **PR 約8本**

**目的**: EOL の Rails 6.1 / Ruby 3.0.7 を、サポート中の Rails 7.1+ / Ruby 3.2+ へ。フェーズ1のテストとフェーズ3で縮んだコードベースが前提。

**方式**: dual-boot（next_rails）は**使わない**。アプリ規模が小さく学生チームには複雑すぎるため、「**1ステップ=1PR＋stage soak（1週間運用）**」の直列方式を採る。各ステップは独立して止まれる。

**PR 分解**:

| PR | 内容 | 対象 | 規模 |
|---|---|---|---|
| 5-0 | 事前 gem 更新: Puma 4→6、mysql2、devise / devise_token_auth を Rails 7 対応版へ、rack-cors ほか（Renovate の PR トリアージで消化） | `api/Gemfile` | S×数本 |
| 5-1 | Rails 6.1→7.0（gem 更新＋`rails app:update` の config 差分。`load_defaults 6.1` のまま） | `api/Gemfile`, `api/config/` | M |
| 5-2 | `config.load_defaults 7.0` 切替（デフォルト変更を1項目ずつ確認） | `api/config/application.rb` | S |
| 5-3 | Ruby 3.0.7→3.2（`api/Dockerfile` の FROM、Gemfile ruby 行、CI の ruby-version、`.rubocop.yml` TargetRubyVersion。**Psych 4 の YAML エイリアス問題に注意**: `config/database.yml` 等で `aliases: true` が必要になる場合あり） | `api/Dockerfile` ほか | M |
| 5-4 | Rails 7.0→7.1 ＋ `load_defaults 7.1`（2PR） | 同上 | M |
| 5-5 | 追従更新: RuboCop 系、r2-oas、seed-fu、pdfkit / wkhtmltopdf-binary の動作確認。**PDF 出力は stage で全帳票を目視確認**（wkhtmltopdf はバージョン差でレイアウトが変わりやすい） | `api/Gemfile` | S |

**完了条件 (DoD)**: 本番が Rails 7.1.x / Ruby 3.2.x で1週間安定稼働（エラーレート平常）、CI 緑、PDF / CSV 帳票の出力確認済み、deprecation warning がログでゼロ。

**リスクと対策**:
- devise_token_auth の互換問題 → 5-0 で先に最新化し、認証フロー（login / トークン更新）の request テストを F1 の範囲に含めておく
- wkhtmltopdf 自体が EOL プロダクト → 本フェーズでは動作維持のみ。代替（grover 等）は「やらないこと」章に記載しスコープ外
- 学園祭サイクル → **翌年4月（申請期間開始）までに完了**を必達ラインとし、間に合わない場合は 7.0 で一旦止めて翌窓で 7.1

---

### フェーズ6: admin_view 段階的リライト

**時期**: 2027年2月〜2027年12月 / **規模**: XL（本計画最大、実働6〜9ヶ月想定）/ **リスククラス**: B〜C / **PR 35〜45本**

**目的**: EOL スタック（Nuxt 2 / Vue 2 / Vuetify 1 / webpack 4 / Node 16 / axios 0.21）の管理画面を廃止する。

**技術選定（決定）**: **Next.js（user/ と完全同一スタック: Next 15系・Pages Router・TypeScript strict・pnpm・Tailwind・ESLint 9 構成を踏襲）**。

理由: (1) チームの知識・レビュー・scaffdog テンプレ・認証実装（next-auth ＋ devise_token_auth ヘッダー処理が `user/src/api/api.ts` に既存）を流用できる。(2) Vue と React の2エコシステム並行維持は、入れ替わりの激しい学生チームに過大。Nuxt 3 案は却下（user_front の死蔵が示す通り Vue 側の継続性が弱い）。

**移行方式（決定）**: ストラングラー方式。新アプリ `admin/`（新ディレクトリ）を **admin-v2.nutfes.net**（stage→本番）で並行稼働させ、**機能グループ単位で旧画面のサイドメニューのリンクを新画面 URL へ差し替える**。リバースプロキシのパス振り分けより運用が単純で、ロールバックは「リンクを戻す」だけ。認証は両アプリとも devise_token_auth なので同一アカウントでログイン可能（セッション共有はしない。管理者ユーザー数が少なく許容）。

**段階**:

1. **基盤（3〜4PR）**: `admin/` scaffold（user/ の設定をコピー）、compose.yml / compose.prod.yml へのサービス追加、CI（lint / type-check / build）、cloudflare トンネル設定
2. **認証＋共通レイアウト（2PR）**: next-auth 設定を user/ から移植、サイドメニュー・テーブル共通コンポーネント
3. **設定駆動 CRUD 基盤（2〜3PR）**: 91ページの大半が同型 CRUD（一覧＋絞り込み＋検索＋詳細＋編集）であることを利用し、`ResourceTable` / `ResourceForm` ＋「**1リソース=1定義ファイル**（カラム定義・API エンドポイント・フィルタ）」の汎用基盤を作る。**ここが本フェーズの工数を決める最重要 PR**。Vuex の getter 内 dispatch 等のアンチパターンは移植せず、SWR＋factory（3E の成果物）に置き換える
4. **機能グループ移植（25〜30PR）**: ドメイン単位（参加団体 / ユーザー・代表者 / 各種申請12種 / 割当系 / マスタ系 / ダッシュボード・チャート / CSV・PDF 出力画面）で1グループ=1〜3PR。**使用頻度の高い画面から**移植し、グループごとに実行委員の現役ユーザーに受け入れ確認してもらい、リンクを切替
5. **完了処理（2〜3PR）**: 全グループ移行後、group-manager-admin.nutfes.net を新アプリへ向け、`admin_view/` 削除（**約32,000行削減**）、admin 系動詞型ルート（`get_xxx_for_admin_view` 等）を新エンドポイントへ正規化して routes.rb 最終整理（180行以下）

**リライト完了までの旧 admin_view の扱い**:
- 新機能追加は原則禁止（必要なら新 `admin/` 側に実装）
- セキュリティは Cloudflare Access（F1 で導入済み）＋ axios を 0.21.4（既知 CVE 修正版・同一マイナーで互換）へピン留めする最小更新のみ
- Node 16 はコンテナ隔離されている前提を維持

**完了条件 (DoD)**: 旧管理画面の全機能が新アプリで実行委員に受け入れ済み、`admin_view/` 削除、EOL 依存指標0、CI 緑。

**リスクと対策**:
- 91ページの移植が年度をまたぐ → 設定駆動 CRUD 基盤により1リソースの移植を「定義ファイル1枚」に圧縮。年度交代（4月）前に基盤＋高頻度画面を完了させ、**残りの同型ページ移植は新メンバーの練習課題として割り当てる**（オンボーディング教材を兼ねる）
- 2027年学園祭（9月）期間 → 凍結カレンダー適用。リンク切替方式なので**新旧混在運用のまま学園祭を越えてよい**

---

## 6. 決定事項とその理由（ADR 要約）

| 論点 | 決定 | 主な理由（括弧内は却下案） |
|---|---|---|
| テストFW | minitest 継続 | 379行の先例と fixtures が既存。学習コスト最小（RSpec 移行は価値<コスト） |
| シリアライザ | Alba 導入 | 軽量・高速・DSL 最小。現状キー完全互換で移設可能（jbuilder=ビュー依存、手書き PORO=規約維持が困難） |
| 依存更新ボット | Renovate | bundler / pnpm / docker / actions の横断グループ化で PR ノイズ最小（Dependabot=グループ化が弱い） |
| admin リライト先 | Next.js（user/ と同一構成） | 知識・認証実装・テンプレの流用、単一エコシステム化（Nuxt 3=Vue 系の継続性に難） |
| Rails アップグレード方式 | 直列1ステップ1PR＋stage soak | アプリ規模が小。dual-boot は学生チームに過剰 |
| マイグレーション84本 | squash しない | `db:schema:load` で新環境構築は足りる。squash は本番リスクに見合わない |
| user_front の保全 | git タグのみ（archive/user_front-2026） | ブランチ常設は混乱の元。タグで完全復元可能 |
| admin 動詞型 URL の正規化 | F6 まで延期 | F4 のルート統一と同時にやると二重リネームで事故りやすい |

## 7. やらないこと（non-goals）

- DB エンジン変更・カラムリネーム等のスキーマ再設計
- GraphQL / tRPC の導入
- OpenAPI からのクライアントコード自動生成（将来検討として記載のみ。r2-oas の仕様書生成は活用する）
- user/ の App Router 移行
- wkhtmltopdf の代替移行（grover 等）
- モノレポツール（turborepo 等）の導入
- i18n 基盤の刷新

## 8. 年間スケジュール

| 時期 | フェーズ | 凍結との関係 |
|---|---|---|
| 2026-06 | F0 / F1 着手 | クラス A のみで申請期間と共存 |
| 2026-07 | F1 完了 / F2 / F3 着手 | クラス B は stage 確認必須 |
| 2026-08 上旬まで | F3 継続 | 8月中旬から本番デプロイ凍結 |
| 2026-09 中旬 | 学園祭 | 完全凍結（hotfix のみ） |
| 2026-10〜11 | F3 完遂 / F4 Step1-2＋観測 | クラス C の窓が開く |
| 2026-11〜12 | F4 Step3・テーブル削除 / F5 着手 | |
| 2027-01〜02 | F5 完遂（Rails 7.1 / Ruby 3.2） | **4月の申請期間開始までに必達** |
| 2027-02〜03（春休み） | F6 基盤＋CRUD 共通基盤 | |
| 2027-04〜08 | F6 移植（新メンバーの教材を兼ねる） | 8月中旬から凍結 |
| 2027-09 | 学園祭 | 新旧 admin 並行稼働で越えてよい |
| 2027-10〜12 | F6 完遂・admin_view 削除・最終検収 | |

## 9. 再発防止の運用ルール（計画完了後も維持）

1. 新規 API エンドポイントは `/api/v1` のみ。レガシー直下への追加禁止。
2. レスポンス整形は `app/serializers`（Alba）。モデルへの `to_*_h` 新設禁止。
3. 同型コードの3回目の複製で共通化を検討する（Rule of Three）。admin 系一覧 API は `AdminResourceListable`、CRUD は基底コントローラ、user/ のフックは factory を必ず経由。
4. リファクタリング対象ファイルに触る PR はテスト同梱必須。SimpleCov の閾値は下げない（ratchet 方式）。
5. 凍結カレンダーを毎年4月に更新し、README と本計画書に反映する。
6. フェーズ完了ごとに付録 10.3 のチェックリストへ完了日・PR 番号を記録する。本計画書は年度交代の引き継ぎ資料を兼ねる。

---

## 10. 付録

### 10.1 レガシールート → /api/v1 対応表（F4 で使用）

下表は調査時点で確認できた利用箇所。**F4 Step1 の PR で `bin/rails routes` の全量 diff を添付し、本表を完成させること。**

| レガシーパス | 新パス | 主な利用元 |
|---|---|---|
| `/groups` | `/api/v1/groups` | user/ (`groupApi.ts`) |
| `/employees` | `/api/v1/employees` | user/ |
| `/food_products` | `/api/v1/food_products` | user/ |
| `/purchase_lists` | `/api/v1/purchase_lists` | user/ |
| `/cooking_process_orders` | `/api/v1/cooking_process_orders` | user/ |
| `/fire_equipment_orders` | `/api/v1/fire_equipment_orders` | user/ |
| `/power_orders` | `/api/v1/power_orders` | user/ |
| `/places` | `/api/v1/places` | user/, admin_view |
| `/shops` | `/api/v1/shops` | user/ |
| `/news` | `/api/v1/news` | user/ |
| `/stage_common_options` | `/api/v1/stage_common_options` | user/ |
| `/user_details` | `/api/v1/user_details` | user/ |
| `/user_page_settings` | `/api/v1/user_page_settings` | user/, admin_view |
| `/venue_maps` | `/api/v1/venue_maps` | user/ |
| `/check_all_registered/:group_id` | `/api/v1/check_all_registered/:group_id` | user/ |
| `/sunny/stages`, `/rainy/stages` | `/api/v1/sunny/stages`, `/api/v1/rainy/stages` | user/ |
| `/fes_years` | `/api/v1/fes_years` | admin_view（35箇所） |
| `/stocker_places` | `/api/v1/stocker_places` | admin_view（14箇所） |
| `/group_categories` | `/api/v1/group_categories` | admin_view |
| `/un_registered_groups` | `/api/v1/un_registered_groups` | admin_view |
| `/group_identification` | `/api/v1/group_identification` | admin_view |
| `/rental_items` ほか残リソース | `/api/v1/...` | F4 Step1 で全量確定 |

### 10.2 リファクタリング対象ファイル一覧（行数は2026-06-10時点）

| ファイル | 行数 | 対応フェーズ |
|---|---|---|
| `api/app/models/group.rb` | 908 | 3A |
| `api/app/controllers/api/v1/output_csv_controller.rb` | 683 | 3C |
| `api/config/routes.rb` | 367 | 4, 6 |
| `api/app/controllers/api/v1/health_center_submission_statuses_api_controller.rb` | 267 | 3C |
| `api/app/controllers/print_pdf_controller.rb` | 180 | 3C |
| `api/app/controllers/{rental,place,stage}_orders_controller.rb` | 各70 | 3B |
| `user/src/api/`（21ファイル） | 2,461 | 3E |
| `user_front/`（全体） | 12,936 | 2（削除） |
| `admin_view/nuxt-project/pages/`（91ファイル） | 約32,000（プロジェクト全体） | 6 |

### 10.3 進捗チェックリスト

> マージのたびに `- [x]` にし、`(完了日, PR#)` を追記する。

**フェーズ0**
- [ ] 0-1 計画書レビュー・マージ
- [ ] 0-2 凍結カレンダー日付確定
- [ ] 0-3 secret scanning / push protection 有効化

**フェーズ1**
- [ ] 1-1 SimpleCov / - [ ] 1-2 API テスト CI / - [ ] 1-3 fixtures / - [ ] 1-4 group.rb 特性テスト / - [ ] 1-5 Order 系テスト / - [ ] 1-6 admin 系テスト / - [ ] 1-7 CSV ゴールデン3本 / - [ ] 1-8 CI check-only 化 / - [ ] 1-9 admin ビルド CI / - [ ] 1-10 Renovate / - [ ] 1-11 シークレット衛生 / - [ ] 1-12 React 安定版 / - [ ] Cloudflare Access

**フェーズ2**
- [ ] 2-1 compose / Makefile 整理 / - [ ] 2-2 死蔵 Dockerfile 削除 / - [ ] 2-3 user_front 削除 / - [ ] 2-4 デッドページ削除 / - [ ] 2-5 到達不能コード削除 / - [ ] 2-6 Gemfile 整理 / - [ ] 2-7 ドキュメント刷新

**フェーズ3**
- [ ] 3A-1 / - [ ] 3A-2 / - [ ] 3A-3（group.rb）
- [ ] 3B-1 / - [ ] 3B-2 / - [ ] 3B-3(コントローラ)
- [ ] 3C-1 / - [ ] 3C-2 / - [ ] 3C-3 / - [ ] 3C-4（CSV/PDF）
- [ ] 3D-1〜4（Alba 移設）
- [ ] 3E-1 / - [ ] 3E-2 / - [ ] 3E-3〜6 / - [ ] 3E-7（user/ API 層）

**フェーズ4**
- [ ] Step1 ルート二重化＋deprecation ログ
- [ ] Step2 user/ 切替 / - [ ] Step2 admin_view 切替
- [ ] Step3 レガシールート削除（ログ0件観測後）
- [ ] テーブル削除（バックアップ→stage→本番）

**フェーズ5**
- [ ] 5-0 事前 gem 更新 / - [ ] 5-1 Rails 7.0 / - [ ] 5-2 defaults 7.0 / - [ ] 5-3 Ruby 3.2 / - [ ] 5-4 Rails 7.1 / - [ ] 5-5 追従更新＋PDF 確認

**フェーズ6**
- [ ] 基盤 / - [ ] 認証・レイアウト / - [ ] 設定駆動 CRUD 基盤 / - [ ] 機能グループ移植（ドメインごとに行を追加すること） / - [ ] ドメイン切替・admin_view 削除・routes 最終整理

### 10.4 引き継ぎチェックリスト（年度交代時）

- [ ] 環境変数一覧の確認（`webhook.env.example`、`api/.env`、user/ のビルド引数）
- [ ] 本番デプロイ手順の実演（`make prod-build` 系、compose.prod.yml）
- [ ] DB バックアップ / 復元手順の確認
- [ ] Cloudflare（トンネル設定 `cloudflare/{stage,prod}/config.yaml`、Access 設定）の管理者引き継ぎ
- [ ] 凍結カレンダーの更新（3.2節）
- [ ] 本計画書の進捗状況（10.3）のレビュー
