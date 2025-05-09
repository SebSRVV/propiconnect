import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function MyListingsPage() {
  const session = await getServerSession(authOptions);

  // Redirigir si no está autenticado o no es Propietario
  if (!session || session.user.tipoUsuario !== 'Propietario') {
    redirect('/login');
  }

  const prisma = new PrismaClient();

  // Obtener propiedades del usuario autenticado
  const propiedades = await prisma.alquiler.findMany({
    where: {
      ownerID: Number(session.user.userID),
    },
    orderBy: {
      alquilerID: 'desc',
    },
  });

  await prisma.$disconnect(); // cerrar conexión al final

  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Mis Propiedades Publicadas</h1>

      {propiedades.length === 0 ? (
        <p>No has publicado ninguna propiedad aún.</p>
      ) : (
        <div className="space-y-6">
          {propiedades.map((prop) => (
            <div
              key={prop.alquilerID}
              className="border border-gray-700 rounded-lg p-4 bg-gray-800"
            >
              <h2 className="text-xl font-semibold mb-2">{prop.direccion}</h2>
              <p className="mb-1">Categoría: {prop.categoria}</p>
              <p className="mb-1">Descripción: {prop.descripcion || 'Sin descripción'}</p>
              <p className="mb-1">Precio: S/.{prop.precio}</p>
              <p className="mb-1">Estado: {prop.estadoPublicacion}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
