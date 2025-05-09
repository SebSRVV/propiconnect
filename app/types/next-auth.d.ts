import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      tipoUsuario: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    tipoUsuario: string;
  }

  interface JWT {
    id: number;
    tipoUsuario: string;
  }
}
