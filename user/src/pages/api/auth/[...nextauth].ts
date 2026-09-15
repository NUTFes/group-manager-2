import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    // 認証プロバイダーの設定
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      // APIにリクエストを送信して認証を行う
      async authorize(credentials) {
        const res = await fetch(`${process.env.SSR_API_URL}/api/auth/sign_in`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
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
    // useSessionを使用してJWTトークンの情報を取得する際に、追加で入力した認証情報も取得する
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.client = token.client;
      session.uid = token.uid;
      return session;
    },
  },

  // セッションの設定
  session: {
    strategy: 'jwt',
    maxAge: 3 * 24 * 60 * 60, // 3日
  },

  // ログ出力を設定
  // サーバーサイドのログ
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
    newUser: '/home',
  },

  // 特定のイベントに対するコールバックを設定
  events: {
    async signIn(message) {
      /* on successful sign in */
      console.log('signin user:', {
        ...message.user,
        timestamp: new Date().toLocaleString('ja-JP', {
          timeZone: 'Asia/Tokyo',
        }),
      });
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});
