# 各ディレクトリの使用技術まとめ 🎯

このドキュメントでは、各ディレクトリで使われている技術スタックとその判断方法をまとめています✨

## 📁 api/ (バックエンド API)

### 使用技術

- **Ruby** 3.0.7
- **Rails** 6.1.3.1 (API モード)
- **MySQL** (データベース)
- **Puma** (アプリケーションサーバー)

### 主要な Gem

- `devise` & `devise_token_auth` - 認証システム
- `rack-cors` - CORS 対応
- `pdfkit` - PDF 生成
- `slack-notifier` & `slack-ruby-client` - Slack 連携
- `r2-oas` - OpenAPI (Swagger) ドキュメント生成

### API判断方法 🔍

- **Ruby バージョン**: `Gemfile` の `ruby '3.0.7'`
- **Rails バージョン**: `Gemfile` の `gem 'rails', '~> 6.1.3.1'`
- **API モード**: `config/application.rb` の `config.api_only = true`
- **データベース**: `Gemfile` の `gem 'mysql2'` と `config/database.yml`

---

## 📁 user/ (ユーザー向けフロントエンド)

### Next.js技術スタック

- **Next.js** 15.0.3 (App Router)
- **React** 19.0.0-rc
- **TypeScript**
- **Tailwind CSS** 3.4.1
- **pnpm** 10.7.0 (パッケージマネージャー)

### Next.js主要ライブラリ

- `next-auth` - 認証
- `react-hook-form` & `zod` - フォーム管理・バリデーション
- `axios` - HTTP クライアント
- `swr` - データフェッチング
- `zustand` - 状態管理
- `framer-motion` - アニメーション
- `storybook` - UI コンポーネント開発

### Next.js判断方法 🔍

- **Next.js バージョン**: `package.json` の `"next": "15.0.3"`
- **Next.js 設定**: `next.config.ts` の存在
- **TypeScript**: `tsconfig.json` の存在と `.ts`/`.tsx` ファイル
- **パッケージマネージャー**: `package.json` の `"packageManager": "pnpm@10.7.0..."`
- **Tailwind CSS**: `tailwind.config.ts` と `package.json` の依存関係

---

## 📁 admin_view/nuxt-project/ (管理者向けフロントエンド)

### Nuxt2技術スタック

- **Nuxt.js** 2.15.8 (Options API)
- **Vue.js** 2.x
- **JavaScript** (TypeScript なし)
- **Vuetify** (UI フレームワーク)
- **Sass**

### Nuxt2主要ライブラリ

- `@nuxtjs/auth` - 認証
- `@nuxtjs/axios` - HTTP クライアント
- `@nuxtjs/moment` - 日時操作
- `firebase` - Firebase 連携
- `chart.js` & `vue-chartjs` - グラフ描画
- `pdfmake` - PDF 生成
- `vuex-persistedstate` - Vuex 永続化

### Nuxt2判断方法 🔍

- **Nuxt.js バージョン**: `package.json` の `"nuxt": "^2.15.8"`
- **Nuxt.js 2**: `nuxt.config.js` (`.js` 拡張子) と Options API スタイル
- **Vue 2**: Nuxt 2 は Vue 2 を使用
- **Vuetify**: `package.json` の `"@nuxtjs/vuetify"` と `buildModules`
- **認証設定**: `nuxt.config.js` の `auth` セクション

---

## 📁 user_front/ (ユーザー向けフロントエンド - 別実装)

### Nuxt3技術スタック

- **Nuxt.js** 3.x (Composition API)
- **Vue.js** 3.x
- **TypeScript**
- **Tailwind CSS** 3.2.4
- **Vue I18n** (多言語対応)

### Nuxt3主要ライブラリ

- `axios` - HTTP クライアント
- `firebase` - Firebase 連携
- `vee-validate` - フォームバリデーション
- `yup` - スキーマバリデーション

### Nuxt3判断方法 🔍

- **Nuxt.js バージョン**: `package.json` の `"nuxt": "^3.0.0"`
- **Nuxt.js 3**: `nuxt.config.ts` (`.ts` 拡張子) と Composition API スタイル
- **Vue 3**: Nuxt 3 は Vue 3 を使用
- **TypeScript**: `nuxt.config.ts` と `tsconfig.json` の存在
- **Tailwind CSS**: `@nuxtjs/tailwindcss` モジュールの使用
- **多言語対応**: `@intlify/unplugin-vue-i18n` の使用

---

## 🔍 技術判断のチェックポイント一覧

### Ruby / Rails プロジェクト

| ファイル | 確認内容 |
|---------|---------|
| `Gemfile` | Ruby バージョン、Rails バージョン、使用 Gem |
| `config/application.rb` | Rails 設定、API モードかどうか |
| `config/database.yml` | データベースの種類 |
| `Rakefile` | Rails プロジェクトの証明 |

### Next.js プロジェクト

| ファイル | 確認内容 |
|---------|---------|
| `package.json` | Next.js バージョン、React バージョン、依存ライブラリ |
| `next.config.ts` / `next.config.js` | Next.js 設定、出力モード |
| `tsconfig.json` | TypeScript の使用 |
| `tailwind.config.ts` | Tailwind CSS の使用 |
| `app/` ディレクトリ | App Router の使用 |
| `pages/` ディレクトリ | Pages Router の使用 |

### Nuxt.js プロジェクト

| ファイル | 確認内容 |
|---------|---------|
| `package.json` | Nuxt バージョン、Vue バージョン、依存ライブラリ |
| `nuxt.config.js` | Nuxt 2 (Options API) |
| `nuxt.config.ts` | Nuxt 3 (Composition API + TypeScript) |
| `tsconfig.json` | TypeScript の使用 (Nuxt 3) |
| `pages/` ディレクトリ | ページルーティング |
| `components/` ディレクトリ | コンポーネント |

### その他の判断材料

| ファイル | 確認内容 |
|---------|---------|
| `Dockerfile` | コンテナ化の設定、ベースイメージ |
| `docker-compose.yml` | サービス構成 |
| `.env` / 環境変数 | 環境設定 |
| `README.md` | プロジェクト概要、セットアップ手順 |

---

## 📊 プロジェクト構成まとめ

```text
group-manager-2/
├── api/              # Rails API (Ruby 3.0.7, Rails 6.1.3.1)
├── user/             # Next.js 15 + React 19 + TypeScript
├── admin_view/       # Nuxt.js 2 + Vue 2 + Vuetify
└── user_front/       # Nuxt.js 3 + Vue 3 + TypeScript
```

### アーキテクチャ

- **バックエンド**: Rails API (RESTful API)
- **フロントエンド**:
  - ユーザー向け: Next.js 15 (最新版) と Nuxt.js 3 (2つの実装)
  - 管理者向け: Nuxt.js 2 (レガシー)

---

## 💡 Tips

### バージョンの確認方法

```bash
# Ruby / Rails
cd api/
cat Gemfile | grep "ruby\|rails"

# Next.js
cd user/
cat package.json | grep "next"

# Nuxt.js (admin_view)
cd admin_view/nuxt-project/
cat package.json | grep "nuxt"

# Nuxt.js (user_front)
cd user_front/
cat package.json | grep "nuxt"
```

### 設定ファイルの場所

- **Rails**: `config/application.rb`, `config/database.yml`, `config/routes.rb`
- **Next.js**: `next.config.ts`, `tsconfig.json`
- **Nuxt.js 2**: `nuxt.config.js`
- **Nuxt.js 3**: `nuxt.config.ts`

---

**作成日**: 2025年11月18日
