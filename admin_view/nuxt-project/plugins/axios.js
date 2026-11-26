export default function ({ $axios, app, redirect, route }) {
  const reauthenticationPath = "/reauthentication_required";
  const loginPath = "/api/auth/sign_in";

  $axios.onRequest((config) => {
    if (!process.client) return;

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
    }
  });

  // 再ログイン後に戻るページを @nuxtjs/auth の rewriteRedirects 用に保存する。
  // ログイン後の redirect("home") がこの値を読み出して消す。
  const saveRedirectPath = (currentRoute) => {
    const fullPath = currentRoute?.fullPath;
    const isRelativePath =
      typeof fullPath === "string" &&
      fullPath.startsWith("/") &&
      !fullPath.startsWith("//");

    if (
      !isRelativePath ||
      currentRoute.path === (app.$auth?.options?.redirect?.login || "/") ||
      currentRoute.path === reauthenticationPath
    ) {
      return;
    }

    app.$auth?.$storage?.setUniversal("redirect", fullPath);
  };

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
      // 画面遷移中の asyncData では router.currentRoute が遷移元のままなので、
      // Nuxt が遷移開始時に更新する context.route（遷移先）を保存する。
      saveRedirectPath(process.client ? app.context?.route : route);

      if (process.client) {
        app.router.replace(reauthenticationPath);
      } else {
        redirect(reauthenticationPath);
      }
    }

    return Promise.reject(error);
  });
}
