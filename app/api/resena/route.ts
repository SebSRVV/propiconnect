import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import cookie from 'cookie';

/**
 * GET /api/resena?propiedadID=123
 * Devuelve las reseñas de una propiedad con nombre de usuario.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const propiedadID = searchParams.get('propiedadID');

    if (!propiedadID) {
      return NextResponse.json({ message: 'ID de propiedad requerido' }, { status: 400 });
    }

    const [rows]: any = await db.query(
      `SELECT r.id, CONCAT(u.nombres, ' ', u.apellidos) AS nombre, r.comentario, r.fechaCreacion
       FROM resena r
       JOIN usuario u ON r.usuarioID = u.id
       WHERE r.propiedadID = ?
       ORDER BY r.fechaCreacion DESC`,
      [propiedadID]
    );

    return NextResponse.json({ resenas: rows }, { status: 200 });
  } catch (error) {
    console.error('[RESEÑA_GET_ERROR]', error);
    return NextResponse.json({ message: 'Error al obtener reseñas' }, { status: 500 });
  }
}

/**
 * POST /api/resena
 * Publica una nueva reseña para una propiedad.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { propiedadID, comentario } = body;

    if (!comentario || !comentario.trim()) {
      return NextResponse.json({ message: 'El comentario no puede estar vacío.' }, { status: 400 });
    }

    // Leer y parsear cookies
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

    // Buscar el usuario por credencialID
    const result: any = await db.query(
      'SELECT id FROM usuario WHERE credencialID = ?',
      [credencialID]
    );
    const usuarioRows = result[0];

    if (!usuarioRows.length) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const usuarioID = usuarioRows[0].id;

    // Insertar reseña
    await db.query(
      `INSERT INTO resena (propiedadID, usuarioID, comentario) VALUES (?, ?, ?)`,
      [propiedadID, usuarioID, comentario.trim()]
    );

    return NextResponse.json({ message: 'Reseña publicada con éxito' }, { status: 201 });

  } catch (error) {
    console.error('[RESEÑA_POST_ERROR]', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
