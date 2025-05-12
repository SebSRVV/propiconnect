import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email y contraseña son obligatorios' }, { status: 400 });
    }

    // Obtener la credencial y el usuario asociado
    const [rows]: any = await db.query(
      `SELECT c.id AS credencialID, c.email, c.password, u.id AS usuarioID, u.tipoUsuario
       FROM credencial c
       JOIN usuario u ON c.id = u.credencialID
       WHERE c.email = ?`,
      [email]
    );

    if (!rows.length) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 401 });
    }

    const user = rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: 'Contraseña incorrecta' }, { status: 401 });
    }

    // Crear sesión con todos los datos necesarios
    const sessionData = {
      id: user.credencialID,
      email: user.email,
      tipoUsuario: user.tipoUsuario,
    };

    const response = NextResponse.json(
      { message: 'Login exitoso', user: sessionData },
      { status: 200 }
    );

    // Guardar la sesión en cookie httpOnly
    response.cookies.set('session', JSON.stringify(sessionData), {
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
