# scaffdog の使い方

Scaffdog を使用して Next.js 用のコンポーネント雛形を自動生成できます。

## コンポーネントの作成方法

以下のコマンドを実行することで src/components 配下に雛形を作成します。

```
pnpm run scaff:component

docker compose run --rm pnpm run scaff:component
```

入力する値関係なく作成されるファイル、フォルダ名はパスカルケース(Hoge等)に変換されます。
