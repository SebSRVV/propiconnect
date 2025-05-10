'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function EditForm({ propiedad }: { propiedad: Propiedad }) {
  const router = useRouter();

  const [form, setForm] = useState<Propiedad>(propiedad);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/propiedad/${form.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/listings');
    } else {
      alert('Error al actualizar la propiedad');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <input
        type="text"
        name="titulo"
        value={form.titulo}
        onChange={handleChange}
        placeholder="Título"
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
      />
      <input
        type="text"
        name="ubicacion"
        value={form.ubicacion}
        onChange={handleChange}
        placeholder="Ubicación"
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
      />
      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
      />
      <input
        type="number"
        name="precio"
        value={form.precio}
        onChange={handleChange}
        placeholder="Precio"
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
      />
      <select
        name="tipo"
        value={form.tipo}
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
      >
        <option value="casa">Casa</option>
        <option value="departamento">Departamento</option>
        <option value="habitacion">Habitación</option>
      </select>
      <select
        name="estado"
        value={form.estado}
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
      >
        <option value="disponible">Disponible</option>
        <option value="alquilada">Alquilada</option>
        <option value="vendida">Vendida</option>
      </select>

      <input
        type="text"
        name="imagenUrl"
        value={form.imagenUrl || ''}
        onChange={handleChange}
        placeholder="URL de imagen (opcional)"
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
      >
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
}
