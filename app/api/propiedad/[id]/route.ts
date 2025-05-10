import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Extraer ID manualmente desde la URL
    const url = new URL(req.url);
    const segments = url.pathname.split('/');
    const idStr = segments[segments.length - 1];
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
    }

    const [rows]: any = await db.query('SELECT * FROM propiedad WHERE id = ?', [id]);

    if (!rows.length) {
      return NextResponse.json({ message: 'Propiedad no encontrada' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Error en el servidor' }, { status: 500 });
  }
}
