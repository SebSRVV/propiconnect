'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Propiedad {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  precio: number;
  tipo: string;
  modo: 'alquiler' | 'venta';
  estado: string;
  imagenUrl?: string;
}

export default function PropertyClient({ propiedad }: { propiedad: Propiedad }) {
  const [fecha, setFecha] = useState('');
  const router = useRouter();

  const handleReservar = () => {
    if (propiedad.modo === 'alquiler' && !fecha) {
      alert('Selecciona una fecha para alquilar');
      return;
    }

    const params = new URLSearchParams({
      propiedadID: propiedad.id.toString(),
      modo: propiedad.modo,
      ...(propiedad.modo === 'alquiler' && { fecha }),
    });

    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 shadow">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Detalles de la Propiedad</h1>
          <Link
            href="/listings"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition"
          >
            Volver a explorar
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto py-12 px-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-md">
          <img
            src={propiedad.imagenUrl}
            alt={propiedad.titulo}
            className="w-full h-64 object-cover"
          />
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-1">{propiedad.titulo}</h2>
              <p className="text-gray-400 text-sm">{propiedad.ubicacion}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="text-white capitalize">{propiedad.tipo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Modo</p>
                <p className="text-white capitalize">{propiedad.modo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className="text-white capitalize">{propiedad.estado}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Precio</p>
                <p className="text-blue-400 font-semibold text-lg">
                  ${propiedad.precio.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Descripción</p>
              <p className="text-gray-300 whitespace-pre-line">{propiedad.descripcion}</p>
            </div>

            {propiedad.modo === 'alquiler' && (
              <div>
                <label htmlFor="fecha" className="block text-sm text-gray-400 mb-1">
                  Fecha de inicio de alquiler
                </label>
                <input
                  type="date"
                  id="fecha"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="bg-gray-700 text-white rounded px-3 py-2 focus:outline-none"
                  required
                />
              </div>
            )}

            <button
              onClick={handleReservar}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition"
            >
              {propiedad.modo === 'alquiler' ? 'Alquilar esta propiedad' : 'Comprar esta propiedad'}
            </button>
          </div>
        </div>
      </section>

      <footer className="text-center text-sm text-white-500 py-6 bg-gray-800 border-t border-gray-700">
        © 2025 Proppiconnect. Todos los derechos reservados.
      </footer>
    </main>
  );
}
