'use client';

import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Alquiler = {
  alquilerID: number;
  direccion: string;
  descripcion: string | null;
  categoria: string;
  precio: number;
};

export default function DeleteListingsPage() {
  const [alquileres, setAlquileres] = useState<Alquiler[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAlquileres = async () => {
      const session = await getSession();
      if (!session || session.user.tipoUsuario !== 'Propietario') {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/mis-alquileres'); // debes crear este endpoint
      const data = await res.json();
      setAlquileres(data);
      setLoading(false);
    };

    fetchAlquileres();
  }, [router]);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('¿Estás seguro de eliminar esta propiedad?');
    if (!confirmDelete) return;

    const res = await fetch(`/api/alquiler?alquilerID=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setAlquileres((prev) => prev.filter((a) => a.alquilerID !== id));
    } else {
      alert('Error al eliminar la propiedad');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Eliminar Propiedades</h1>
          <Link
            href="/dashboard"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Volver al Dashboard
          </Link>
        </div>

        {loading ? (
          <p>Cargando propiedades...</p>
        ) : alquileres.length === 0 ? (
          <p className="text-gray-400">No tienes propiedades publicadas.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {alquileres.map((a) => (
              <div
                key={a.alquilerID}
                className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold text-blue-400">{a.direccion}</h2>
                  <p className="text-sm text-gray-300 mb-1">Categoría: {a.categoria}</p>
                  <p className="text-sm text-gray-300 mb-3">Precio: S/.{a.precio.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">{a.descripcion || 'Sin descripción'}</p>
                </div>
                <button
                  onClick={() => handleDelete(a.alquilerID)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
