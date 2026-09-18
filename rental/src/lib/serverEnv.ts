// サーバー専用の環境変数解決。クライアントバンドルに入れてはいけない値を扱うため、
// このモジュールを Client Component から import しないこと。
//
// SSR_API_URL を next.config.ts の env に入れない理由: nextConfig.env の値は
// NEXT_PUBLIC_ 接頭辞の有無に関わらずクライアントバンドルへ埋め込まれるため、
// コンテナ内部向けURLがブラウザに露出する（#2196 のレビューより）。

const ssrApiUrlByEnv: Record<string, string> = {
  development: "http://api:3000",
  staging: "https://stg-group-manager-api.nutfes.net",
  production: "https://group-manager-api.nutfes.net",
};

export const APP_ENV = process.env.APP_ENV || "development";

export const isProduction = APP_ENV === "production";

// Access を通さずに動かしてよいのはローカル開発だけ。staging も本番同様に
// Access の設定を要求する（設定漏れで記録者を偽装できる状態にしないため）
export const isDevelopment = APP_ENV === "development";

// 環境変数が未設定でも動くよう APP_ENV ごとの既定値を持つ。
// NEXT_PUBLIC_API_URL と対称にするための措置（#2196 のレビューより）。
export const SSR_API_URL =
  process.env.SSR_API_URL?.trim() ||
  ssrApiUrlByEnv[APP_ENV] ||
  ssrApiUrlByEnv.development;

export const RENTAL_API_TOKEN = process.env.RENTAL_API_TOKEN?.trim() || "";

export const CF_ACCESS_TEAM_DOMAIN =
  process.env.CF_ACCESS_TEAM_DOMAIN?.trim() || "";

export const CF_ACCESS_AUD = process.env.CF_ACCESS_AUD?.trim() || "";

// 合言葉。設定すると Cloudflare Access の代わりに入口を守る（設計書6章）。
// Access が設定されていればそちらが優先で、こちらは使わない。
export const RENTAL_PASSCODE = process.env.RENTAL_PASSCODE?.trim() || "";

// Access を通さないローカル開発用の記録者メール。本番では使わない。
export const DEV_RECORDER_EMAIL =
  process.env.DEV_RECORDER_EMAIL?.trim() || "dev@example.com";
