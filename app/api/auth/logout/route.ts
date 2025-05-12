// app/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));

  // Elimina la cookie de sesión
  response.cookies.set('session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
