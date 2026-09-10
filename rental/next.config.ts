import type { NextConfig } from "next";

// SSR_API_URL はサーバー専用（Server Component / Route Handler）の値のため、
// ここでは扱わない。nextConfig.env の値は NEXT_PUBLIC_ 接頭辞の有無に関わらず
// クライアントバンドルへ埋め込まれてしまうため、SSR_API_URL を含めるとコンテナ
// 内部向けURLがブラウザに露出する。サーバー側では process.env.SSR_API_URL を
// 直接参照する（コンテナの環境変数として Dockerfile/compose で設定済み）。
const apiUrlByEnv: Record<string, string> = {
  development: "http://localhost:3000",
  staging: "https://stg-group-manager-api.nutfes.net",
  production: "https://group-manager-api.nutfes.net",
};

const APP_ENV = process.env.APP_ENV || "development";
const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  apiUrlByEnv[APP_ENV] ||
  apiUrlByEnv.development;

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
