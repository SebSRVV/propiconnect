import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { FaMapMarkerAlt, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';

const prisma = new PrismaClient();

export default async function ListingsPage() {
  const alquileres = await prisma.alquiler.findMany({
    where: { estadoPublicacion: 'Disponible' },
    include: {
      usuario: true,
    },
    orderBy: { alquilerID: 'desc' },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">Propiedades disponibles</h1>
            <Link
              href="/"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {alquileres.length === 0 ? (
          <p className="text-center col-span-full text-gray-400">
            No hay propiedades disponibles en este momento.
          </p>
        ) : (
          alquileres.map((alquiler) => (
            <Link key={alquiler.alquilerID} href={`/listings/${alquiler.alquilerID}`}>
              <div className="bg-gray-800 p-6 rounded-lg hover:scale-105 transition cursor-pointer shadow hover:shadow-lg">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-blue-400">{alquiler.categoria}</h2>
                  <p className="text-sm text-gray-300 flex items-center gap-2">
                    <FaMapMarkerAlt /> {alquiler.direccion}
                  </p>
                </div>
                <div className="text-gray-300 space-y-2">
                  <p className="flex items-center gap-2">
                    <FaMoneyBillWave /> <span className="font-semibold">${alquiler.precio.toFixed(2)}</span>
                  </p>
                  {alquiler.descripcion && (
                    <p className="text-sm text-gray-400">{alquiler.descripcion.slice(0, 100)}...</p>
                  )}
                  <p className="flex items-center gap-2 text-green-400 mt-2">
                    <FaCheckCircle /> {alquiler.estadoPublicacion}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </section>

      <footer className="text-center text-sm text-white-500 py-6 bg-gray-800 border-t border-gray-700">
        © 2025 Proppiconnect. Todos los derechos reservados.
      </footer>
    </main>
  );
}
