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
      async authorize(credentials) {
        const res = await fetch(
          // TODO: 環境変数でAPIを切り替えれるようにする
          'https://your-rails-api.com/api/v1/auth/sign_in',
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
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.client = user.client;
        token.uid = user.uid;
      }
      return token;
    },
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
  // TODO: 環境変数にNEXTAUTH_SECRETを設定する
  secret: process.env.NEXTAUTH_SECRET,
});
