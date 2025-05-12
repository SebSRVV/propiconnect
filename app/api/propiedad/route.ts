import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Consulta todas las propiedades con datos relevantes
    const [rows]: any = await db.query(`
      SELECT 
        id, 
        titulo, 
        descripcion, 
        ubicacion, 
        precio, 
        tipo, 
        modo, 
        estado, 
        imagenUrl 
      FROM propiedad
    `);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('[LISTAR_PROPIEDADES_ERROR]', error);
    return NextResponse.json({ message: 'Error al obtener propiedades' }, { status: 500 });
  }
}
