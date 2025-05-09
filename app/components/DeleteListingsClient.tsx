'use client';

import { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaMoneyBillWave, FaTrash } from 'react-icons/fa';

type Alquiler = {
  alquilerID: number;
  direccion: string;
  descripcion: string | null;
  categoria: string;
  precio: number;
};

export default function DeleteListingsClient({ alquileres }: { alquileres: Alquiler[] }) {
  const [list, setList] = useState<Alquiler[]>(alquileres);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta propiedad?');
    if (!confirmDelete) return;

    const res = await fetch(`/api/alquiler?alquilerID=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setList((prev) => prev.filter((item) => item.alquilerID !== id));
    } else {
      alert('Error al eliminar');
    }
  };

  if (list.length === 0) {
    return <p className="text-gray-400">No tienes propiedades publicadas.</p>;
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {list.map((alquiler) => (
        <div
          key={alquiler.alquilerID}
          className="bg-gray-800 p-6 rounded-lg hover:scale-105 transition cursor-pointer shadow hover:shadow-lg"
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-blue-400">{alquiler.categoria}</h2>
            <p className="text-sm text-gray-300 flex items-center gap-2">
              <FaMapMarkerAlt /> {alquiler.direccion}
            </p>
          </div>
          <div className="text-gray-300 space-y-2">
            <p className="flex items-center gap-2">
              <FaMoneyBillWave /> <span className="font-semibold">S/.{alquiler.precio.toFixed(2)}</span>
            </p>
            {alquiler.descripcion && (
              <p className="text-sm text-gray-400">{alquiler.descripcion.slice(0, 100)}...</p>
            )}
          </div>
          <button
            onClick={() => handleDelete(alquiler.alquilerID)}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 text-sm"
          >
            <FaTrash /> Eliminar propiedad
          </button>
        </div>
      ))}
    </section>
  );
}
