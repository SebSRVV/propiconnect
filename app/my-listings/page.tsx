import db from '@/lib/db';
import Link from 'next/link';

interface Propiedad {
  id: number;
  titulo: string;
  ubicacion: string;
  descripcion: string;
  precio: number;
  tipo: string;
  estado: string;
  imagenUrl?: string;
}

function getImagenPorTipo(tipo: string) {
  const tipos: Record<string, string> = {
    casa: '/casa.jpg',
    departamento: '/departamento.jpg',
    habitacion: '/habitacion.jpg',
  };

  return tipos[tipo.toLowerCase()] || '/casa.jpg';
}

export default async function ListingsPage() {
  const [rows]: any = await db.query('SELECT * FROM propiedad');
  const propiedades: Propiedad[] = rows;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 shadow">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Explorar Propiedades</h1>
          <Link
            href="/"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto py-12 px-6">
        {propiedades.length === 0 ? (
          <p className="text-center text-gray-400">
            No hay propiedades disponibles en este momento.
          </p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propiedades.map((prop) => (
              <Link key={prop.id} href={`/listings/${prop.id}`}>
                <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow hover:border-blue-500 hover:shadow-lg transition cursor-pointer relative">
                  <img
                    src={prop.imagenUrl || getImagenPorTipo(prop.tipo)}
                    alt={prop.titulo}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />

                  {/* Estado badge */}
                  <span
                    className={`absolute top-4 left-4 text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide
                      ${
                        prop.estado === 'disponible'
                          ? 'bg-green-600 text-green-100'
                          : prop.estado === 'alquilada'
                          ? 'bg-yellow-600 text-yellow-100'
                          : prop.estado === 'vendida'
                          ? 'bg-red-600 text-red-100'
                          : 'bg-gray-600 text-gray-100'
                      }
                    `}
                  >
                    {prop.estado}
                  </span>

                  <h3 className="text-lg font-bold text-white mb-1">{prop.titulo}</h3>
                  <p className="text-sm text-gray-400 mb-1">{prop.ubicacion}</p>
                  <p className="text-sm text-gray-400 capitalize mb-1">{prop.tipo}</p>

                  <p className="text-xl font-semibold text-blue-400 mt-2">
                    ${prop.precio.toLocaleString()} <span className="text-sm text-gray-400">USD</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="text-center text-sm text-white-500 py-6 bg-gray-800 border-t border-gray-700">
        © 2025 Proppiconnect. Todos los derechos reservados.
      </footer>
    </main>
  );
}
