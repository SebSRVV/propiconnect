// types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      userID: string;
      tipoUsuario: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    tipoUsuario: string;
    userID: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userID: string;
    tipoUsuario: string;
  }
}
