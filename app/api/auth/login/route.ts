import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email y contraseña son obligatorios' }, { status: 400 });
    }

    const [rows]: any = await db.query('SELECT * FROM credencial WHERE email = ?', [email]);

    if (!rows.length) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 401 });
    }

    const user = rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
    }

    const response = NextResponse.json(
      { message: 'Login exitoso', user: { id: user.id, email: user.email } },
      { status: 200 }
    );

    // Guardar cookie de sesión (httpOnly)
    response.cookies.set('session', JSON.stringify({ id: user.id, email: user.email }), {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 día
    });

    return response;
  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
