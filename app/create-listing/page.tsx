'use client';

import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { alquiler_categoria } from '@prisma/client';

export default function CreateListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    direccion: '',
    categoria: 'Casa' as alquiler_categoria,
    descripcion: '',
    precio: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) redirect('/login');
    if (session?.user.tipoUsuario !== 'Propietario') redirect('/');
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.direccion || !form.precio) {
      setError('Dirección y precio son obligatorios.');
      return;
    }

    const res = await fetch('/api/alquileres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        precio: parseFloat(form.precio),
        ownerID: session?.user.userID,
      }),
    });

    if (!res.ok) {
      setError('Error al crear la propiedad.');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Publicar nueva propiedad</h1>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            Dirección:
            <input
              name="direccion"
              type="text"
              value={form.direccion}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded bg-gray-800 text-white"
              required
            />
          </label>

          <label className="block">
            Categoría:
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded bg-gray-800 text-white"
            >
              <option value="Casa">Casa</option>
              <option value="Departamento">Departamento</option>
              <option value="Cuarto">Cuarto</option>
              <option value="Oficina">Oficina</option>
            </select>
          </label>

          <label className="block">
            Descripción:
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded bg-gray-800 text-white"
              rows={4}
            />
          </label>

          <label className="block">
            Precio:
            <input
              name="precio"
              type="number"
              min="0"
              step="0.01"
              value={form.precio}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded bg-gray-800 text-white"
              required
            />
          </label>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
          >
            Publicar propiedad
          </button>
        </form>
      </div>
    </main>
  );
}
