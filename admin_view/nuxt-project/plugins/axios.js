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
