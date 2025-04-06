// eslint.config.cjs

const { FlatCompat } = require('@eslint/eslintrc');
const compat = new FlatCompat();

module.exports = [
  // 互換ユーティリティを使って、従来の shareable config を読み込みます
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),
  ...compat.extends('plugin:storybook/recommended'),
  ...compat.extends('plugin:tailwindcss/recommended'),
  ...compat.extends('plugin:prettier/recommended'),
  {
    files: ['*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  // 自分のカスタム設定
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
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
      tailwindcss: require('eslint-plugin-tailwindcss'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
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
