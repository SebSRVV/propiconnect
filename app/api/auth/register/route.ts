import { NextResponse } from 'next/server';
import { PrismaClient, usuario_tipoUsuario } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type RegisterBody = {
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  password: string;
  tipoUsuario: 'Inquilino' | 'Propietario';
};

export async function POST(req: Request) {
  try {
    const body: RegisterBody = await req.json();
    const { nombres, apellidos, telefono, email, password, tipoUsuario } = body;

    // Validaciones
    if (!nombres || !apellidos || !telefono || !email || !password || !tipoUsuario) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    if (!['Inquilino', 'Propietario'].includes(tipoUsuario)) {
      return NextResponse.json({ message: 'Tipo de usuario inválido' }, { status: 400 });
    }

    const telefonoParsed = parseInt(telefono);
    if (isNaN(telefonoParsed)) {
      return NextResponse.json({ message: 'Teléfono inválido' }, { status: 400 });
    }

    const existing = await prisma.credencial.findFirst({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: 'Este correo ya está registrado' }, { status: 400 });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear credencial
    const credencial = await prisma.credencial.create({
  data: {
    email,
    password: hashedPassword,
  } as any,
});


    await prisma.usuario.create({
  data: {
    nombres,
    apellidos,
    telefono: telefonoParsed,
    tipoUsuario: tipoUsuario as usuario_tipoUsuario,
    credencial: {
      connect: {
        credencialID: credencial.credencialID,
      },
    },
  } as any,
});

    return NextResponse.json({ message: 'Registro exitoso' }, { status: 201 });

  } catch (error) {
    console.error('[REGISTRO ERROR]', error);
    return NextResponse.json({ message: 'Error en el servidor' }, { status: 500 });
  }
}
