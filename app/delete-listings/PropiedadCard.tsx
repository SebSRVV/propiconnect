'use client';

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

export default function PropiedadCard({
  prop,
  onDelete,
  puedeEliminar = false,
}: {
  prop: Propiedad;
  onDelete: (id: number) => void;
  puedeEliminar?: boolean;
}) {
  const handleDelete = async () => {
    const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar "${prop.titulo}"?`);
    if (!confirmDelete) return;

    const res = await fetch(`/api/propiedad/${prop.id}`, { method: 'DELETE' });

    if (res.ok) {
      onDelete(prop.id);
    } else {
      alert('Error al eliminar la propiedad');
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow hover:border-blue-500 hover:shadow-lg transition relative">
      <Link href={`/listings/${prop.id}`}>
        <img
          src={prop.imagenUrl || getImagenPorTipo(prop.tipo)}
          alt={prop.titulo}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      </Link>

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
        S/.{prop.precio.toLocaleString()} <span className="text-sm text-gray-400">PEN</span>
      </p>

      {puedeEliminar && (
        <button
          onClick={handleDelete}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition"
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
