
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
      // 1) /current_user をクライアント側で自動的に叩きにいく
      await this.$auth.fetchUser()

      // 2) 認証済みユーザ情報は this.$auth.user にセットされる
      const user = this.$auth.user

      console.log(user)
      // role_id プロパティが返ってくる想定
      commit("setRole", user.data.role_id)

      // トークン系は @nuxtjs/auth が自動管理するので不要
    } catch (error) {
      // 取得エラーなら state をクリア
      commit("resetAll")
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
