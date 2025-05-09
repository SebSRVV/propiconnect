import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { PrismaClient, alquiler_categoria, alquiler_estadoPublicacion } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Verificar sesión y tipo de usuario
    if (!session || session.user.tipoUsuario !== 'Propietario') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { direccion, categoria, descripcion, precio } = body;

    // Validación de datos
    if (!direccion || !categoria || precio === undefined || precio === null) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const parsedPrecio = parseFloat(precio);
    if (isNaN(parsedPrecio) || parsedPrecio <= 0) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
    }

    // Crear nuevo alquiler
    const nuevoAlquiler = await prisma.alquiler.create({
      data: {
        direccion,
        descripcion: descripcion || null,
        categoria: categoria as alquiler_categoria,
        precio: parsedPrecio,
        estadoPublicacion: alquiler_estadoPublicacion.Disponible,
        ownerID: session.user.userID,
      },
    });

    return NextResponse.json(nuevoAlquiler, { status: 201 });

  } catch (error: any) {
    console.error('[ERROR AL CREAR ALQUILER]', error);

    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Registro duplicado o conflicto de claves únicas' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
