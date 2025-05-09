import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body as {
      email: string;
      password: string;
    };

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Correo y contraseña son obligatorios' },
        { status: 400 }
      );
    }

    // Buscar usuario por email
    const credencial = await prisma.credencial.findUnique({
      where: { email },
      include: {
        usuario: true,
      },
    });

    if (!credencial || !credencial.password) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    // Comparar contraseñas
    const passwordMatch = await bcrypt.compare(password, credencial.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: 'Inicio de sesión exitoso',
        usuario: credencial.usuario,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[ERROR EN LOGIN]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
