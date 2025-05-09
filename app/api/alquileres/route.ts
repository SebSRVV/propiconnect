import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { PrismaClient, alquiler_categoria, alquiler_estadoPublicacion } from '@prisma/client';

const prisma = new PrismaClient();

// CREAR PROPIEDAD
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.tipoUsuario !== 'Propietario') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { direccion, categoria, descripcion, precio } = body;

    if (!direccion || !categoria || precio === undefined || precio === null) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const parsedPrecio = parseFloat(precio);
    if (isNaN(parsedPrecio) || parsedPrecio <= 0) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
    }

    const nuevoAlquiler = await prisma.alquiler.create({
      data: {
        direccion,
        descripcion: descripcion || null,
        categoria: categoria as alquiler_categoria,
        precio: parsedPrecio,
        estadoPublicacion: alquiler_estadoPublicacion.Disponible,
        ownerID: Number(session.user.userID),
      },
    });

    return NextResponse.json(nuevoAlquiler, { status: 201 });
  } catch (error: any) {
    console.error('[ERROR AL CREAR ALQUILER]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// EDITAR PROPIEDAD
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.tipoUsuario !== 'Propietario') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { alquilerID, direccion, categoria, descripcion, precio, estadoPublicacion } = body;

    if (!alquilerID || !direccion || !categoria || precio === undefined || precio === null) {
      return NextResponse.json({ error: 'Faltan campos requeridos para editar' }, { status: 400 });
    }

    const parsedPrecio = parseFloat(precio);
    if (isNaN(parsedPrecio) || parsedPrecio <= 0) {
      return NextResponse.json({ error: 'Precio inválido' }, { status: 400 });
    }

    // Verificar propiedad del alquiler
    const alquiler = await prisma.alquiler.findUnique({
      where: { alquilerID: Number(alquilerID) },
    });

    if (!alquiler || alquiler.ownerID !== Number(session.user.userID)) {
      return NextResponse.json({ error: 'No autorizado a editar esta propiedad' }, { status: 403 });
    }

    const alquilerEditado = await prisma.alquiler.update({
      where: { alquilerID: Number(alquilerID) },
      data: {
        direccion,
        descripcion: descripcion || null,
        categoria: categoria as alquiler_categoria,
        precio: parsedPrecio,
        estadoPublicacion: estadoPublicacion || alquiler_estadoPublicacion.Disponible,
      },
    });

    return NextResponse.json(alquilerEditado, { status: 200 });
  } catch (error) {
    console.error('[ERROR AL EDITAR ALQUILER]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// ELIMINAR PROPIEDAD
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.tipoUsuario !== 'Propietario') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const alquilerID = searchParams.get('alquilerID');

    if (!alquilerID) {
      return NextResponse.json({ error: 'ID de propiedad no proporcionado' }, { status: 400 });
    }

    const alquiler = await prisma.alquiler.findUnique({
      where: { alquilerID: Number(alquilerID) },
    });

    if (!alquiler || alquiler.ownerID !== Number(session.user.userID)) {
      return NextResponse.json({ error: 'No autorizado a eliminar esta propiedad' }, { status: 403 });
    }

    await prisma.alquiler.delete({
      where: { alquilerID: Number(alquilerID) },
    });

    return NextResponse.json({ message: 'Propiedad eliminada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('[ERROR AL ELIMINAR ALQUILER]', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
