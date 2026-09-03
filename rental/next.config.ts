import type { NextConfig } from "next";

const apiUrlByEnv: Record<string, string> = {
  development: "http://localhost:3000",
  staging: "https://stg-group-manager-api.nutfes.net",
  production: "https://group-manager-api.nutfes.net",
};

const APP_ENV = process.env.APP_ENV || "development";
const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  apiUrlByEnv[APP_ENV] ??
  apiUrlByEnv.development;

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
