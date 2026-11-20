// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    client?: string;
    uid?: string;
  }
  interface User {
    accessToken?: string;
    client?: string;
    uid?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    client?: string;
    uid?: string;
  }
}
