import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    

  if (secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  try {
    // Forzar la revalidación de la ruta de propiedades
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/listings`, {
      method: 'PURGE',
    });

    return NextResponse.json({ revalidated: true, now: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ message: 'Error al revalidar', error: err }, { status: 500 });
  }
}
