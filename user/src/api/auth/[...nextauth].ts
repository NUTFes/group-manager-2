// pages/api/auth/[...nextauth].ts
import type { NextApiHandler } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'your@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // バックエンドの認証エンドポイントへ POST
        const res = await fetch('http://localhost:3000/users/sign_in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: {
              email: credentials?.email,
              password: credentials?.password,
            },
          }),
        });
        const user = await res.json();

        if (res.ok && user.id) {
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = { id: user.id, name: user.name, email: user.email } as {
          id: string;
          name: string;
          email: string;
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler: NextApiHandler = (req, res) => NextAuth(req, res, authOptions);
export default handler;
