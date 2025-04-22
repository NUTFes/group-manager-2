export default async function ({ route, store, app, redirect }) {
  // 認証チェックをスキップするページのパス
  const skipPaths = ['/', '/login', '/users/sign_in', '/users/sign_out'];
  
  // ログインページ関連の場合はチェックをスキップ
  if (skipPaths.includes(route.path)) {
    console.log('認証対象外のパスのためスキップ:', route.path);
    return;
  }

  console.log('認証チェック実行:', route.path);
  
  // ユーザー情報をバックエンドから取得して確認
  try {
    // ユーザー情報が取得できれば認証済み
    const userData = await app.$axios.$get('/current_user');
    
    // ユーザー情報をストアやAuthモジュールに設定
    if (userData && app.$auth) {
      console.log('認証済みユーザー検出', userData);
      app.$auth.setUser(userData);
      app.$auth.setLoggedIn(true);
    }
  } catch (error) {
    console.log('認証エラー', error.response?.status);
    
    // 401エラーの場合はログインページへリダイレクト
    if (error.response && error.response.status === 401) {
      console.log('認証が必要です、ログインページへリダイレクト');
      return redirect('/');
    }
  }
} 