// lib/authOptions.ts
import type { AuthOptions, SessionStrategy, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null;

        const credencial = await prisma.credencial.findUnique({
          where: { email },
          include: { usuario: true },
        });

        const usuario = credencial?.usuario;

        if (!credencial || !usuario || !credencial.password) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, credencial.password);
        if (!passwordMatch) return null;

        // ✅ Retorna solo propiedades compatibles con el tipo User
        return {
          id: String(usuario.userID),
          name: `${usuario.nombres} ${usuario.apellidos}`,
          email: credencial.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy, // asegura tipado correcto
  },
  callbacks: {
    async jwt({ token, user }) {
      // Al iniciar sesión por primera vez
      if (user) {
        token.userID = user.id;

        // Recuperamos tipoUsuario desde Prisma
        const credencial = await prisma.credencial.findUnique({
          where: { email: user.email! },
          include: { usuario: true },
        });

        token.tipoUsuario = credencial?.usuario?.tipoUsuario;
      }
      return token;
    },
    async session({ session, token }) {
      // Incluimos los campos adicionales en la sesión
      if (token && session.user) {
        session.user.userID = token.userID;
        session.user.tipoUsuario = token.tipoUsuario;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
};
