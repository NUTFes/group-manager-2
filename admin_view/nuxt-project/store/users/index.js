import axios from "axios";

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
  role: null,
  accessToken: null,
  client: null,
  uid: null
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
  }
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
      const response = await this.$axios.$get("api/v1/users/get_user_detail", {
        headers: {
          "Content-Type": "application/json",
          "access-token": localStorage.getItem("access-token"),
          client: localStorage.getItem("client"),
          uid: localStorage.getItem("uid")
        }
      });

      console.log(response);
      commit("setRole", response.user.role_id);
      commit("setAccessToken", response.user.accessToken);
      commit("setClient", response.user.client);
      commit("setUid", response.user.uid);
    } catch (error) {
      commit("setRole", null);
      commit("setAccessToken", null);
      commit("setClient", null);
      commit("setUid", null);
    }
  }
};

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
  }
};
