import { NextResponse } from 'next/server';
import db from '@/lib/db';
import cookie from 'cookie';

export async function POST(req: Request) {
  try {
    const { titulo, descripcion, ubicacion, precio, tipo, modo, imagenUrl } = await req.json();

    if (!titulo || !descripcion || !ubicacion || !precio || !tipo || !modo) {
      return NextResponse.json({ message: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const cookieHeader = req.headers.get('cookie') || '';
    const cookiesParsed = cookie.parse(cookieHeader);
    const session = cookiesParsed.session;

    if (!session) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    let user;
    try {
      user = JSON.parse(session);
    } catch {
      return NextResponse.json({ message: 'Sesión inválida' }, { status: 401 });
    }

    const credencialID = user.id;

    const [rows]: any = await db.query(
      'SELECT id, tipoUsuario FROM usuario WHERE credencialID = ?',
      [credencialID]
    );

    if (!rows.length) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const usuario = rows[0];

    if (usuario.tipoUsuario !== 'Propietario') {
      return NextResponse.json({ message: 'Solo los propietarios pueden publicar propiedades' }, { status: 403 });
    }

    // Insertar propiedad
    await db.query(
      `INSERT INTO propiedad (titulo, descripcion, ubicacion, precio, tipo, modo, imagenUrl, propietarioID)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        descripcion,
        ubicacion,
        precio,
        tipo,
        modo,
        imagenUrl || null,
        usuario.id,
      ]
    );

    // Emitir evento por WebSocket
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/emit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'nueva-propiedad',
        data: {
          titulo,
          descripcion,
          ubicacion,
          precio,
          tipo,
          modo,
          imagenUrl,
        },
      }),
    });

    return NextResponse.json({ message: 'Propiedad publicada exitosamente' }, { status: 201 });

  } catch (error) {
    console.error('[CREAR_PROPIEDAD_ERROR]', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
