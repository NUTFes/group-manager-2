/**
 * vuexについて
 *
 * これらのファイルはstate.js, mutation.jsなどに分割することができる。
 * それぞれでexportしていればまとめるところもいらない
 */

/**
 * state
 * 保持するデータのこと
 * 外から参照するのは問題ない
 */
export const state = () => ({
  role: 4,
  accessToken: null,
  client: null,
  uid: null,
});

/**
 * mutation
 * データの変更を行うメソッドのこと
 * 基本的には外から叩かないようにする（カウンターとかだったら叩いてもいい）
 * あと非同期はダメ
 */
export const mutations = {
  setRole(state, number) {
    state.role = number;
  },
  setAccessToken(state, text) {
    state.accessToken = text;
  },
  setClient(state, text) {
    state.client = text;
  },
  setUid(state, text) {
    state.uid = text;
  },
  resetAll(state) {
    state.role = null;
    state.accessToken = null;
    state.client = null;
    state.uid = null;
  },
};

/**
 * action
 * データを変形させたいときに行うメソッド
 * 基本的にはaxiosとかで使うといい
 *
 * asyncはtry/catchでawaitでのエラーを検知できる
 * awaitを非同期で行いたいことに書いておく
 * また、かならずawaitで取得したデータは変数にいれること
 */
export const actions = {
  async getUser({ commit }) {
    try {
      // $auth.fetchUserではなく直接axiosでユーザー情報を取得
      // withCredentialsを明示的に指定してCookieを含める
      const response = await this.$axios.$get('/current_user', {
        withCredentials: true
      });
      
      if (response && response.data) {
        console.log('ユーザー情報取得成功:', response);
        
        // role_id プロパティが返ってくる想定
        commit("setRole", response.data.role_id);
        
        // Auth moduleが使用可能ならユーザー情報を設定
        if (this.$auth) {
          this.$auth.setUser(response);
          this.$auth.setLoggedIn(true);
        }
      } else {
        throw new Error('ユーザー情報が取得できませんでした');
      }
    } catch (error) {
      console.error('ユーザー情報取得エラー:', error);
      // 取得エラーなら state をクリア
      commit("resetAll");
      
      // Auth moduleが使用可能なら状態をリセット
      if (this.$auth) {
        this.$auth.setUser(null);
        this.$auth.setLoggedIn(false);
      }
    }
  },
}

/**
 * getter
 * stateを扱いやすい形に変形して提供する
 * findなどでLINQみたいにできる
 * よくわからないけどdispatchがないといわれる
 */

export const getters = {
  getRole(state, dispatch) {
    if (state.role === null) {
      dispatch("getUser");
    }
    return state.role;
  },
  getAccessToken(state, dispatch) {
    if (state.accessToken === null) {
      dispatch("getUser");
    }
    return state.accessToken;
  },
  getClient(state, dispatch) {
    if (state.client === null) {
      dispatch("getUser");
    }
    return state.client;
  },
  getUid(state, dispatch) {
    if (state.uid === null) {
      dispatch("getUser");
    }
    return state.uid;
  },
};
