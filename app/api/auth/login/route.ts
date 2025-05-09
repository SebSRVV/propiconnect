import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Correo", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const credencial = await prisma.credencial.findFirst({
          where: { email },
        });

        if (!credencial || !credencial.password) return null;

        const usuario = await prisma.usuario.findFirst({
          where: { credencialID: credencial.credencialID },
        });

        if (!usuario) return null;

        const valid = await bcrypt.compare(password, credencial.password);
        if (!valid) return null;

        return {
          id: usuario.userID,
          name: `${usuario.nombres} ${usuario.apellidos}`,
          email: credencial.email,
          tipoUsuario: usuario.tipoUsuario,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tipoUsuario = user.tipoUsuario;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.tipoUsuario = token.tipoUsuario as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
