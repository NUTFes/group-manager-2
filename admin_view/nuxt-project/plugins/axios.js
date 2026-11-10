import {
  AUTH_TOKEN_KEYS,
  readAuthTokenCookies,
  saveAuthTokenCookies,
} from "~/utils/auth-token-cookie";

export default function ({ $axios, app, redirect, route, req }) {
  const reauthenticationPath = "/reauthentication_required";
  const loginPath = "/api/auth/sign_in";

  // Cookie 保存を入れる前にログインしていた場合に備え、localStorage の値を Cookie に写す
  if (process.client && window.localStorage.getItem("access-token")) {
    const tokens = readAuthTokenCookies(document.cookie);
    if (!tokens["access-token"]) {
      saveAuthTokenCookies(
        Object.fromEntries(
          AUTH_TOKEN_KEYS.map((key) => [key, window.localStorage.getItem(key)])
        )
      );
    }
  }

  $axios.onRequest((config) => {
    if (!process.client) {
      // SSR 時は localStorage を読めないため、ブラウザから届いた Cookie から付ける
      const tokens = readAuthTokenCookies(req?.headers?.cookie);
      AUTH_TOKEN_KEYS.forEach((key) => {
        if (tokens[key]) config.headers[key] = tokens[key];
      });
      return;
    }

    config.headers.client = window.localStorage.getItem("client");
    config.headers["access-token"] =
      window.localStorage.getItem("access-token");
    config.headers.uid = window.localStorage.getItem("uid");
    config.headers["token-type"] = window.localStorage.getItem("token-type");
  });

  $axios.onResponse((response) => {
    if (!process.client) return;

    if (response.headers.client) {
      localStorage.setItem("access-token", response.headers["access-token"]);
      localStorage.setItem("client", response.headers.client);
      localStorage.setItem("uid", response.headers.uid);
      localStorage.setItem("token-type", response.headers["token-type"]);
      saveAuthTokenCookies(response.headers);
    }
  });

  $axios.onError((error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const currentPath = process.client
      ? app.router?.currentRoute?.path
      : route?.path;
    const isLoginRequest =
      requestUrl === loginPath || requestUrl.endsWith(loginPath);

    if (
      status === 401 &&
      !isLoginRequest &&
      currentPath !== reauthenticationPath
    ) {
      if (process.client) {
        app.router.replace(reauthenticationPath);
      } else {
        redirect(reauthenticationPath);
      }
    }

    return Promise.reject(error);
  });
}
