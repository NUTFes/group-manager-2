// plugins/axios.js
export default function ({ $axios }) {
  // クッキーを含める
  $axios.defaults.withCredentials = true;
  
  // シンプルなリクエスト時の処理
  $axios.onRequest(config => {
    console.log(`Request to ${config.url} [${config.method}]`);
    return config;
  });

  // シンプルなレスポンス時の処理
  $axios.onResponse(response => {
    console.log(`Response from ${response.config.url} [${response.config.method}]`);
    return response;
  });

  // 401エラー処理のみ残す
  $axios.onError(error => {
    console.error('Axios Error:', error);
    
    if (error.response && error.response.status === 401) {
      // ログインページ以外の場合のみリダイレクト
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/login') {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  });
}
