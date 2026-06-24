export default function ({ $axios, app }) {
  const reauthenticationPath = "/reauthentication_required";
  const loginPath = "/api/auth/sign_in";

  $axios.onRequest((config) => {
    config.headers.client = window.localStorage.getItem("client");
    config.headers["access-token"] =
      window.localStorage.getItem("access-token");
    config.headers.uid = window.localStorage.getItem("uid");
    config.headers["token-type"] = window.localStorage.getItem("token-type");
  });

  $axios.onResponse((response) => {
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
    const currentPath = app.router?.currentRoute?.path;

    if (
      status === 401 &&
      requestUrl !== loginPath &&
      currentPath !== reauthenticationPath
    ) {
      app.router.push(reauthenticationPath);
    }

    return Promise.reject(error);
  });
}
