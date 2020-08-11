# はじめに

このISSUEはログイン周りのユーザーの情報をVuexで管理する解決を図っている。



storeの構成は以下のようにする。

```
store
├─modules
│	└─users.js
├─getters.js
└─index.js
```



## Vuex

Vuexには**State**,**Getter**,**Mutation**,**Action**の４つの構成要素が存在する。

### State

アプリ全体の状態を保持するオブジェクト

アプリ全体や、複数ヶ所で使用されるデータを保持するべきである。

### Getter

リストをフィルタリングしたりカウントするときに使う。

### Mutation

ストアの状態を変更するために使う。

Mutationをコミットすることでのみ変更が行える。

同期処理でなければいけない。

### Action

複雑な処理などのpublicに扱えるメソッド

APIとの通信などを行う。

MutationもActionを通して行うことが望ましい。

# 開発

モデルごとにストアを作成する。