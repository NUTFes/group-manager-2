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

リポジトリルートからE2E専用のDockerイメージで実行します。Playwright用のNode.js、Chromium、依存パッケージはイメージ内へ入るため、ホストや通常のadmin_viewコンテナへ追加する必要はありません。

```bash
make test-admin-e2e
```
