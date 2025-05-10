import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

interface RegisterData {
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  password: string;
  tipoUsuario: 'Inquilino' | 'Propietario';
}

export async function POST(req: Request) {
  try {
    const body: RegisterData = await req.json();
    const { nombres, apellidos, telefono, email, password, tipoUsuario } = body;

    if (!email || !password || !nombres || !apellidos || !telefono || !tipoUsuario) {
      return NextResponse.json({ message: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // 1. Verificar si el email ya existe
    const [existingRows]: any = await db.query(
      'SELECT id FROM credencial WHERE email = ?',
      [email]
    );

    if (existingRows.length > 0) {
      return NextResponse.json({ message: 'Este correo ya está registrado' }, { status: 409 });
    }

    // 2. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insertar credencial
    const [credResult]: any = await db.query(
      'INSERT INTO credencial (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    const credencialID = credResult.insertId;

    // 4. Insertar usuario vinculado a la credencial
    await db.query(
      `INSERT INTO usuario (nombres, apellidos, telefono, tipoUsuario, credencialID)
       VALUES (?, ?, ?, ?, ?)`,
      [nombres, apellidos, telefono, tipoUsuario, credencialID]
    );

    return NextResponse.json({ message: 'Registro exitoso' }, { status: 201 });
  } catch (error) {
    console.error('[REGISTER_ERROR]', error);
    return NextResponse.json({ message: 'Error en el servidor' }, { status: 500 });
  }
}
