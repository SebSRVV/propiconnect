import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Leer y tipar los datos del body
    const body = await req.json();

    const {
      email,
      password,
      nombres,
      apellidos,
      telefono,
      tipoUsuario,
    } = body as {
      email: string;
      password: string;
      nombres: string;
      apellidos: string;
      telefono: string | number;
      tipoUsuario: 'Inquilino' | 'Propietario';
    };

    // Validación básica
    if (!email || !password || !nombres || !apellidos || !telefono || !tipoUsuario) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.credencial.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 409 });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear credencial
    const newCredencial = await prisma.credencial.create({
      data: {
        email,
        password: hashedPassword,
      }as any,
    });

    // Crear usuario asociado y conectar con la credencial
    const newUsuario = await prisma.usuario.create({
      data: {
        nombres,
        apellidos,
        telefono: typeof telefono === 'string' ? parseInt(telefono) : telefono,
        tipoUsuario,
        credencial: {
          connect: {
            credencialID: newCredencial.credencialID,
          },
        },
      }as any,
    });

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente', usuario: newUsuario },
      { status: 201 }
    );

  } catch (error) {
    console.error('[ERROR EN REGISTRO]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
