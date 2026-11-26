# nuxt-project

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## E2E tests

Node.js 18以上のホスト環境で実行します。環境選択と将来のコンテナ実行への移行方針は [AGENTS.md](../../AGENTS.md) を参照してください。

```bash
npm ci
npx playwright install chromium
npm run test:e2e
```
