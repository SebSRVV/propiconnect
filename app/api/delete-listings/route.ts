import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import cookie from 'cookie';

export const dynamic = 'force-dynamic';

async function getUsuarioIDDesdeSesion(req: NextRequest): Promise<number | null> {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookiesParsed = cookie.parse(cookieHeader);
  const session = cookiesParsed.session;

  if (!session) return null;

  try {
    const sessionData = JSON.parse(session);
    const credencialID = sessionData.id;

    const [rows]: any = await db.query(
      'SELECT id FROM usuario WHERE credencialID = ?',
      [credencialID]
    );

    if (!rows.length) return null;

    return rows[0].id;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const usuarioID = await getUsuarioIDDesdeSesion(req);

    if (!usuarioID) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
    }

    const [propiedades]: any = await db.query(
      'SELECT * FROM propiedad WHERE propietarioID = ?',
      [usuarioID]
    );

    return NextResponse.json(propiedades, { status: 200 });
  } catch (err) {
    console.error('[DELETE_LISTINGS_GET_ERROR]', err);
    return NextResponse.json({ message: 'Error en el servidor' }, { status: 500 });
  }
}
