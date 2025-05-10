import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: any }
) {
  try {
    const propiedadID = context.params.id;

    if (!propiedadID) {
      return NextResponse.json({ message: 'ID no proporcionado' }, { status: 400 });
    }

    const [rows]: any = await db.query('SELECT * FROM propiedad WHERE id = ?', [propiedadID]);

    if (!rows.length) {
      return NextResponse.json({ message: 'Propiedad no encontrada' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });

  } catch (error) {
    console.error('[GET_PROPIEDAD_ERROR]', error);
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}
