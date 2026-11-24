# rental（貸出・返却記録アプリ）

学園祭当日、物品の貸出場所に立つ実行委員スタッフが、参加団体に物品を渡した・返してもらった事実をスマホで記録するアプリです。

- 設計書: [`docs/rental/design.md`](../docs/rental/design.md)
- デザイン: Figma `2026.8_GM_RentalFrontDesign`（ページ `ver.1 mobile`）

## 前提

- 原則は Cloudflare Zero Trust（Access）でアクセス制御します。Accessを使えない構成では `RENTAL_PASSCODE` によるパスワード画面で入口を保護します
- API は直接呼ばず、Next.js の Route Handler（BFF）経由で呼びます
- API キーなどの秘匿値は settings リポジトリの `.env` で管理します

## 開発

リポジトリルートで次を実行します。

```bash
docker compose up api rental
```

- rental: http://localhost:8004
- API: http://localhost:3000

コミット前に実行してください。

```bash
docker compose run --rm rental pnpm run lint
docker compose run --rm rental pnpm run type-check
docker compose run --rm rental pnpm run fmt
```

## 技術構成

Next.js 16（App Router） / React 19 / TypeScript / Tailwind CSS 4 / pnpm 10.7.0、PWA 対応。

デザイントークン（色・タイポスケール）は `src/app/globals.css` の `@theme` にあります。色名は `user/` と揃えています。
