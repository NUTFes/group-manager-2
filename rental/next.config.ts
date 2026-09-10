import type { NextConfig } from "next";

const apiConfig: Record<
  string,
  { SSR_API_URL: string; NEXT_PUBLIC_API_URL: string }
> = {
  development: {
    SSR_API_URL: "http://api:3000",
    NEXT_PUBLIC_API_URL: "http://localhost:3000",
  },
  staging: {
    SSR_API_URL: "https://stg-group-manager-api.nutfes.net",
    NEXT_PUBLIC_API_URL: "https://stg-group-manager-api.nutfes.net",
  },
  production: {
    SSR_API_URL: "https://group-manager-api.nutfes.net",
    NEXT_PUBLIC_API_URL: "https://group-manager-api.nutfes.net",
  },
};

const APP_ENV = process.env.APP_ENV || "development";
const configuredApi = apiConfig[APP_ENV] || apiConfig.development;
const SSR_API_URL =
  process.env.SSR_API_URL?.trim() || configuredApi.SSR_API_URL;
const NEXT_PUBLIC_API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || configuredApi.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  env: {
    SSR_API_URL,
    NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
