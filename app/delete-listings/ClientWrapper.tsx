'use client';

import { useState } from 'react';
import Link from 'next/link';
import PropiedadCard from './PropiedadCard';

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

export default function ClientWrapper({ propiedadesIniciales }: { propiedadesIniciales: Propiedad[] }) {
  const [propiedades, setPropiedades] = useState(propiedadesIniciales);

  const handleDelete = (id: number) => {
    setPropiedades((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 shadow">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Explorar Propiedades</h1>
          <Link
            href="/dashboard"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition"
          >
            Volver al dashboard
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
              <PropiedadCard key={prop.id} prop={prop} onDelete={handleDelete} />
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
