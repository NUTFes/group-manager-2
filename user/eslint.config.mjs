// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

const config = [
  // 互換ユーティリティを使って従来の shareable config を読み込みます
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),
  ...compat.extends('plugin:storybook/recommended'),
  ...compat.extends('plugin:tailwindcss/recommended'),
  ...compat.extends('plugin:prettier/recommended'),
  // 自分のカスタム設定
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        module: 'writable',
        exports: 'writable',
        require: 'readonly',
        globalThis: 'readonly',
        BigInt: 'readonly',
      },
    },
    plugins: {
      tailwindcss: (await import('eslint-plugin-tailwindcss')).default,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          tabWidth: 2,
          trailingComma: 'es5',
          bracketSpacing: true,
          printWidth: 80,
          arrowParens: 'always',
        },
      ],
    },
  },
];

export default config;
