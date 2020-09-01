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
	headers['Content-Type'] = 'application/json';
	
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



### SignUp.vue

```
export default {
  name: 'SignUp',
  data () {
    return {
      show: false,
    }
  },
  methods: {
    open () {
      this.show = true
    },
    signUp: function() {
      this.$store.dispatch(
        'users/create',
        {
          'user': {
            name: this.name,
            email: this.email,
            role_id: 3,
            password: this.password,
            password_confirmation: this.password_confirmation
          }
        }
      )
    }
  },
  computed: {
    token() {
      return this.$store.users.accesstoken
    },
  },
  created: function() {
    if (this.$store.state.users.accesstoken) {
      this.$router.push('MyPage')
    }
  },
  watch: {
    accesstoken (newAccesstoken) {
      this.$router.push('MyPage')
    }
  }
}
```





これでできた、と思ったらエラー



` unknown action type: post`とのことなので

`users/post`に変更とかしてみたら

422 (Unprocessable Entity)が出た。



CSRF tokenで問題があるかもしれない



また、`RAILS/log/development.log`によると

```
Started POST "/api/auth" for 172.20.0.1 at 2020-08-28 11:14:49 +0000
  [1m[35m (8.1ms)[0m  [1m[35mSET NAMES utf8mb4,  @@SESSION.sql_mode = CONCAT(CONCAT(@@sql_mode, ',STRICT_ALL_TABLES'), ',NO_AUTO_VALUE_ON_ZERO'),  @@SESSION.sql_auto_is_null = 0, @@SESSION.wait_timeout = 2147483[0m
  [1m[35m (10.9ms)[0m  [1m[34mSELECT `schema_migrations`.`version` FROM `schema_migrations` ORDER BY `schema_migrations`.`version` ASC[0m
Processing by Api::Auth::RegistrationsController#create as HTML
  Parameters: {"data"=>{"name"=>"mashimo", "email"=>"mashimo@nutfes.com", "role_id"=>3, "password"=>"[FILTERED]", "password_confirmation"=>"[FILTERED]"}, "registration"=>{"data"=>{"name"=>"mashimo", "email"=>"mashimo@nutfes.com", "role_id"=>3, "password"=>"[FILTERED]", "password_confirmation"=>"[FILTERED]"}}}
[31mUnpermitted parameters: :data, :registration[0m
Filter chain halted as :validate_sign_up_params rendered or redirected
Completed 422 Unprocessable Entity in 11ms (Views: 0.3ms | ActiveRecord: 0.0ms | Allocations: 6073) 
```



validateが悪さをしているみたいだが？？？

# 参考サイト

[Vue.jsでかんたんなログイン画面（トークン認証）を作ってみた](https://qiita.com/kumagaias/items/f3486da415d3024c7ed4)

[Vue、Vuexとaxiosを使って郵便番号から住所を取得する](https://qiita.com/oda3104/items/73f79e8fbbc5ca611c15)

[axiosのget,post,deleteメソッド](https://qiita.com/chenglin/items/f59a6daff76fa0f582af)

[Vuex](https://vuex.vuejs.org/ja)



