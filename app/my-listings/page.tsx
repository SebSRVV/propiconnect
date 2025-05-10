import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import Link from 'next/link';

interface Propiedad {
  id: number;
  titulo: string;
  ubicacion: string;
  precio: number;
  tipo: string;
  modo: string;
  estado: string;
  imagenUrl: string | null;
}

function getImagenPorTipo(tipo: string): string {
  const imagenes: Record<string, string> = {
    casa: '/casa.jpg',
    departamento: '/departamento.jpg',
    habitacion: '/habitacion.jpg',
  };
  return imagenes[tipo.toLowerCase()] || '/casa.jpg';
}

export default async function MyListingsPage() {
  const cookieStore = cookies();
  const session = cookieStore.get('session');

  if (!session) redirect('/login');

  let user;
  try {
    user = JSON.parse(session.value);
  } catch {
    redirect('/login');
  }

  const credencialID = user.id;

  // Verificar que el usuario sea propietario
  const [usuarios]: any = await db.query(
    'SELECT id, tipoUsuario FROM usuario WHERE credencialID = ?',
    [credencialID]
  );

  if (!usuarios.length || usuarios[0].tipoUsuario !== 'Propietario') {
    return redirect('/dashboard');
  }

  const propietarioID = usuarios[0].id;

  // Obtener propiedades del propietario
  const [rows]: any = await db.query(
    'SELECT * FROM propiedad WHERE propietarioID = ?',
    [propietarioID]
  );

  const propiedades: Propiedad[] = rows;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 shadow">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Mis Publicaciones</h1>
          <Link
            href="/dashboard"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition"
          >
            Volver al panel
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto py-12 px-6">
        {propiedades.length === 0 ? (
          <p className="text-center text-gray-400">Aún no has publicado propiedades.</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propiedades.map((prop) => (
              <Link key={prop.id} href={`/listings/${prop.id}`}>
                <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow hover:border-blue-500 hover:shadow-lg transition cursor-pointer">
                  <img
                    src={prop.imagenUrl || getImagenPorTipo(prop.tipo)}
                    alt={prop.titulo}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-bold text-white mb-1">{prop.titulo}</h3>
                  <p className="text-sm text-gray-400">{prop.ubicacion}</p>
                  <p className="text-sm text-gray-400 capitalize">{prop.tipo} – {prop.modo}</p>
                  <p className="text-sm text-gray-400">Estado: {prop.estado}</p>
                  <p className="text-blue-400 font-semibold text-md mt-1">${prop.precio.toLocaleString()}</p>
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
