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
  propietarioId: number;
  imagenUrl?: string;
}

export default function ClientWrapper({
  propiedades,
  onDelete,
}: {
  propiedades: Propiedad[];
  onDelete: (id: number) => void;
}) {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 px-6 py-6 shadow">
        <h1 className="text-3xl font-bold text-center">Mis Propiedades</h1>
      </header>

      <section className="max-w-6xl mx-auto py-12 px-6">
        {propiedades.length === 0 ? (
          <p className="text-center text-gray-400">No has publicado propiedades aún.</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propiedades.map((prop) => (
              <PropiedadCard
                key={prop.id}
                prop={prop}
                onDelete={onDelete}
                puedeEliminar={true} // todas estas son del usuario
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}