// @ts-check
// この設定ファイルを TypeScript チェックの対象にする
import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';
import Prettier from 'eslint-config-prettier';
import * as importPlugin from 'eslint-plugin-import';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  globalIgnores(['**/*.mjs']),
  // 除外するファイルパターンを指定

  eslint.configs.recommended,
  // 基本的な ESLint 推奨ルール

  tseslint.configs.recommendedTypeChecked,
  // 型情報を必要とする推奨ルールセット

  tseslint.configs.stylisticTypeChecked,
  // 型情報付きのスタイリスティックルールセット

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    // 対象ファイルパターンを指定

    ignores: ['**/*.mjs', 'node_modules/**', '.pnpm-store/**'],
    // 除外するファイルパターンを指定

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      // @typescript-eslint プラグインを登録
      // prettier-ignore
      'import': importPlugin,
      // import プラグインを登録
      '@next/next': nextPlugin,
      // Next.js プラグインを登録
    },

    rules: {
      // smarthrのルールをコピーしてきた
      // https://github.com/kufu/eslint-config-smarthr
      ...eslint.configs.recommended.rules,
      ...Prettier.rules,
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-object-literal-type-assertion': 'off',
      '@typescript-eslint/no-triple-slash-reference': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/prefer-interface': 'off',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      '@typescript-eslint/unified-signatures': 'warn',
      'no-useless-constructor': 'off',

      // Next.js 関連のルール
      '@next/next/google-font-display': 'error',
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      '@next/next/no-page-custom-font': 'error',
      '@next/next/no-sync-scripts': 'error',
      '@next/next/no-title-in-document-head': 'error',
      '@next/next/no-unwanted-polyfillio': 'error',

      'array-callback-return': 'warn',
      'arrow-body-style': ['error', 'as-needed'],
      'block-scoped-var': 'warn',
      curly: ['warn', 'multi-line'],
      'default-param-last': 'error',
      'dot-notation': 'error',
      eqeqeq: 'error',
      'import/no-duplicates': 'error',
      'import/no-useless-path-segments': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'parent',
              position: 'before',
            },
          ],
          alphabetize: {
            order: 'asc',
          },
          'newlines-between': 'always',
        },
      ],
      'no-async-promise-executor': 'error',
      'no-caller': 'error',
      'no-catch-shadow': 'error',
      'no-confusing-arrow': [
        'error',
        {
          allowParens: true,
        },
      ],
      'no-div-regex': 'warn',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-parens': ['error', 'functions'],
      'no-floating-decimal': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-import-assign': 'error',
      'no-inner-declarations': 'warn',
      'no-iterator': 'error',
      'no-label-var': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'warn',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-return-await': 'error',
      'no-script-url': 'warn',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow': 'error',
      'no-shadow-restricted-names': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'warn',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'no-unused-vars': [
        'error',
        {
          vars: 'local',
          args: 'none',
        },
      ],
      'no-useless-call': 'warn',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-rename': 'error',
      'no-var': 'error',
      'no-void': 'error',
      'no-with': 'error',
      'object-shorthand': ['error', 'properties'],
      'prefer-arrow-callback': 'warn',
      'prefer-const': [
        'warn',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: true,
        },
      ],
      'prefer-numeric-literals': 'error',
      'prefer-regex-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'warn',
      radix: 'error',
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
        },
      ],
      'symbol-description': 'error',
      'template-curly-spacing': 'error',
      'valid-typeof': [
        'error',
        {
          requireStringLiterals: true,
        },
      ],
      'vars-on-top': 'warn',
      'wrap-iife': ['error', 'any'],
      'yield-star-spacing': ['error', 'after'],
    },

    languageOptions: {
      parser: tsParser,
      // 指定したパーサーでコードを解析

      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2020,
        ...globals.commonjs,
        // 各環境のグローバル変数を定義
      },

      parserOptions: {
        project: './tsconfig.app.json',
        // 型情報付き lint 用の tsconfig ファイルパス

        tsconfigRootDir: import.meta.dirname,
        // tsconfig の基準ディレクトリを設定（このファイルの位置）

        projectService: true,
        // 型チェックサービスを有効化

        ecmaFeatures: {
          jsx: true,
          // JSX 構文を解析可能にする
        },
      },
    },
  }
);
