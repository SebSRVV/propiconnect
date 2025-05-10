import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function MyListingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.tipoUsuario !== 'Propietario') {
    redirect('/login');
  }

  const prisma = new PrismaClient();

  const propiedades = await prisma.alquiler.findMany({
    where: {
      ownerID: Number(session.user.userID),
    },
    orderBy: {
      alquilerID: 'desc',
    },
  });

  await prisma.$disconnect();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold">Mis Propiedades Publicadas</h1>
          <Link
            href="/dashboard"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          >
            Volver al Dashboard
          </Link>
        </div>

        {propiedades.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            No has publicado ninguna propiedad aún.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {propiedades.map((prop) => (
              <div
                key={prop.alquilerID}
                className="bg-gray-800 border border-gray-700 rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <h2 className="text-xl font-semibold text-blue-400 mb-2">
                  {prop.direccion}
                </h2>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium text-white">Categoría:</span> {prop.categoria}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium text-white">Descripción:</span>{' '}
                  {prop.descripcion || 'Sin descripción'}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium text-white">Precio:</span>{' '}
                  <span className="text-green-400 font-bold">S/.{prop.precio.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-white">Estado:</span>{' '}
                  <span
                    className={`font-semibold ${
                      prop.estadoPublicacion === 'Disponible'
                        ? 'text-green-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    {prop.estadoPublicacion}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
