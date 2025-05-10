import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const propiedadID = searchParams.get('propiedadID');

    if (!propiedadID) {
      return NextResponse.json({ message: 'Falta el ID de la propiedad' }, { status: 400 });
    }

    const [resenas]: any = await db.query(
      `SELECT r.id, r.comentario, r.fechaCreacion, u.nombres AS nombre
       FROM resena r
       JOIN usuario u ON r.usuarioID = u.id
       WHERE r.propiedadID = ?
       ORDER BY r.fechaCreacion DESC`,
      [propiedadID]
    );

    return NextResponse.json({ resenas }, { status: 200 });

  } catch (error) {
    console.error('[RESEÑA_GET_ERROR]', error);
    return NextResponse.json({ message: 'Error al obtener reseñas' }, { status: 500 });
  }
}
