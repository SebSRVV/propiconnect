import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';

// 👇 Este es el cambio importante: exportar "GET"
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'propiedades.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    const propiedades = JSON.parse(jsonData);

    return NextResponse.json(propiedades, { status: 200 });
  } catch (error) {
    console.error('Error leyendo propiedades.json:', error);
    return NextResponse.json(
      { mensaje: 'Error al leer propiedades' },
      { status: 500 }
    );
  }
}
