// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // 既存の SVG を処理するルールを取得
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg"),
    );

    if (fileLoaderRule) {
      config.module.rules.push(
        // *.svg?url の場合、既存のファイルローダールールを利用
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // 例: import iconUrl from './icon.svg?url'
        },
        // その他の *.svg は @svgr/webpack を利用して React コンポーネント化
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [/url/] }, // ?url が付かない場合
          use: ["@svgr/webpack"],
        },
      );

      // 既存のファイルローダールールから *.svg を除外
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;
