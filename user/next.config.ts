// next.config.ts
import type { NextConfig } from 'next';
import type { RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack(config) {
    // 既存の SVG を処理するルールを取得
    const rules = config.module.rules as RuleSetRule[];
    const fileLoaderRule = rules.find(
      (rule): rule is RuleSetRule =>
        rule.test instanceof RegExp && rule.test.test('.svg')
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
          use: ['@svgr/webpack'],
        }
      );

      // 既存のファイルローダールールから *.svg を除外
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;
