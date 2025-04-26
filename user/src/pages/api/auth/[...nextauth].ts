import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // Rails APIにリクエストを送信して認証を行う
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/sign_in`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user: {
                email: credentials?.email,
                password: credentials?.password,
              },
            }),
          }
        );
        if (!res.ok) {
          throw new Error('認証に失敗しました');
        }

        // レスポンスからユーザー情報を取得
        const user = await res.json();

        // 認証に必要な情報を取得
        const accessToken = res.headers.get('access-token');
        const client = res.headers.get('client');
        const uid = res.headers.get('uid');

        if (accessToken && client && uid) {
          return {
            ...user.data,
            accessToken,
            client,
            uid,
          };
        } else {
          throw new Error('認証情報の取得に失敗しました');
        }
      },
    }),
  ],

  callbacks: {
    // ユーザー情報をJWTトークンに保存
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.client = user.client;
        token.uid = user.uid;
      }
      return token;
    },
    // セッションにJWTトークンの情報を追加
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.client = token.client;
      session.uid = token.uid;
      return session;
    },
  },

  session: {
    strategy: 'jwt',
  },

  // 環境変数で秘密鍵を設定
  secret: process.env.NEXTAUTH_SECRET,

  // ログ出力を設定
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
  },

  // デバッグモードを本番環境以外で有効にする
  debug: process.env.NODE_ENV !== 'production',

  // サインインページのルーティングを設定
  pages: {
    signIn: '/',
    signOut: '/logout',
    error: '/auth-error',
    newUser: '/home',
  },
});
