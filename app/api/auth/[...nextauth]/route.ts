import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // o usa ruta relativa si el alias no está configurado

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
