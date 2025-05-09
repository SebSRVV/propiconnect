import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const authOptions = {
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
  
          return {
            id: String(usuario.userID),
            name: `${usuario.nombres} ${usuario.apellidos}`,
            email: credencial.email,
            tipoUsuario: usuario.tipoUsuario,
          };
        },
      }),
    ],
    session: {
      strategy: 'jwt',
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.userID = user.id;
          token.tipoUsuario = user.tipoUsuario;
        }
        return token;
      },
      async session({ session, token }) {
        if (token && session.user) {
          session.user.userID = token.userID as number;
          session.user.tipoUsuario = token.tipoUsuario as string;
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: '/login',
    },
  };
  
  // Exporta el handler con authOptions
  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST };
  
