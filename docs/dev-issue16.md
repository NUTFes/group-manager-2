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

## 雛形

モデルごとにストアを作成する。

雛形と一緒にとりあえずstateとgetterを作成

uid, access-token, clientでいいかなとりあえず（token-typeも必要かな〜）



`~@/store/modules/users.js`

```
export default {
	namespaced: true,
	state:{
		uid: [],
		accesstoken: [],
		client: []
	},
	getters: {
		getUid: state => state.uid,
		getAccesstoken: state => state.accesstoken,
		getClient: state => state.client
	},
	mutations: {},
	actions: {}
}
```



## mutation

ここでmutationとactionになにをいれるのかを考える。

まずは、フォーム入力後のレスポンスがあったときのlocal strage に入れている部分をmutationとしてstateに追加する実装をする必要がある。



`~@/store/modules/users.js`

```
mutations: {
	create (state, data){
		state.uid = data.uid;
		state.accesstoken = data.accesstoken;
		state.client = data.client;
    }
}
```



まだ動かして確認もできないけど多分いい感じ

`users/create`を呼び出すことでセットできる。



## action

次にactionに実装するものを考える。

axiosでpostしている動作を書く。

しかしrouterの記述をstoreに書きたくないので考え中

ちょっとわからなそうだったらmutation呼び出して書き換えることにする



`~@/store/modules/users.js`

```
actions: {
	create ({commit, dispatch}, data){
		dispatch(
			'post',
			{url: '/api/auth', data},
			{root: true}
		).then(res => commit('create', res.data))
			.catch(err => err)
	}
}
```

postというactionにurlを指定してdispatchをしたものをcommitをする。



```
async request ({dispatch, rootState}, {method, url, data}) {
	const headers = {}
	headers['Content-Type'] = 'aplication/json';
	
	const options = {
		method,
		url: `${process.env.VUE_APP_URL}${url}`,
		headers,
		data,
		timeout: 15000
	}
	
	return axios(options)
		.then(res => res)
		.catch(err => {
			console.log(err)
		})
}
```

axiosでresがあったときのheadersと接続オプションを作成してそれを引数にAPIに定められたメソッドを行い、axiosの結果を返す。



```
async post({dispatch}, requests) {
	requests.method = 'post'
	return dispatch('request', requests)
}
```

axiosのメソッドを指定し、requestというactionをdispatchしたものを返す。



これでできた、と思ったらエラー



` unknown action type: post`とのことなので

# 参考サイト

[Vue.jsでかんたんなログイン画面（トークン認証）を作ってみた](https://qiita.com/kumagaias/items/f3486da415d3024c7ed4)

[Vue、Vuexとaxiosを使って郵便番号から住所を取得する](https://qiita.com/oda3104/items/73f79e8fbbc5ca611c15)

[axiosのget,post,deleteメソッド](https://qiita.com/chenglin/items/f59a6daff76fa0f582af)

[Vuex](https://vuex.vuejs.org/ja)



