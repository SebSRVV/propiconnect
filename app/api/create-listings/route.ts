import { NextResponse } from 'next/server';
import db from '@/lib/db';
import cookie from 'cookie';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { titulo, descripcion, ubicacion, precio, tipo, modo, imagenUrl } = body;

    // Validación de campos requeridos
    if (
      !titulo?.trim() ||
      !descripcion?.trim() ||
      !ubicacion?.trim() ||
      typeof precio !== 'number' ||
      precio <= 0 ||
      !tipo?.trim() ||
      !modo?.trim()
    ) {
      return NextResponse.json({ message: 'Datos inválidos o incompletos' }, { status: 400 });
    }

    // Leer cookies de sesión
    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ message: 'No autorizado (sin cookies)' }, { status: 401 });
    }

    const cookiesParsed = cookie.parse(cookieHeader);
    const session = cookiesParsed.session;
    if (!session) {
      return NextResponse.json({ message: 'Sesión no encontrada' }, { status: 401 });
    }

    let user;
    try {
      user = JSON.parse(session);
    } catch {
      return NextResponse.json({ message: 'Sesión inválida' }, { status: 401 });
    }

    const credencialID = user?.id;
    if (!credencialID) {
      return NextResponse.json({ message: 'ID de usuario inválido' }, { status: 401 });
    }

    // Verificar que el usuario exista y sea propietario
    const [rows]: any = await db.query(
      'SELECT id, tipoUsuario FROM usuario WHERE credencialID = ?',
      [credencialID]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const usuario = rows[0];
    if (usuario.tipoUsuario !== 'Propietario') {
      return NextResponse.json(
        { message: 'Solo los propietarios pueden publicar propiedades' },
        { status: 403 }
      );
    }

    // Insertar propiedad
    await db.query(
      `INSERT INTO propiedad (titulo, descripcion, ubicacion, precio, tipo, modo, imagenUrl, estado, propietarioID)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'disponible', ?)`,
      [
        titulo.trim(),
        descripcion.trim(),
        ubicacion.trim(),
        precio,
        tipo.trim(),
        modo.trim(),
        imagenUrl?.trim() || null,
        usuario.id,
      ]
    );

    return NextResponse.json({ message: 'Propiedad publicada exitosamente' }, { status: 201 });

  } catch (error) {
    console.error('[ERROR_PUBLICAR_PROPIEDAD]', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
