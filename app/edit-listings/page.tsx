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
  estadoPublicacion: string;
};

export default function EditListingsPage() {
  const [alquileres, setAlquileres] = useState<Alquiler[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Alquiler>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const session = await getSession();
      if (!session || session.user.tipoUsuario !== 'Propietario') {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/mis-alquileres'); // crea este endpoint para listar
      const data = await res.json();
      setAlquileres(data);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleEdit = (alquiler: Alquiler) => {
    setEditingId(alquiler.alquilerID);
    setForm(alquiler);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/alquiler', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setEditingId(null);
      const updated = await res.json();
      setAlquileres((prev) =>
        prev.map((a) => (a.alquilerID === updated.alquilerID ? updated : a))
      );
    } else {
      alert('Error al actualizar');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Editar Propiedades</h1>
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
          <p className="text-gray-400">No tienes propiedades para editar.</p>
        ) : (
          <div className="space-y-6">
            {alquileres.map((a) =>
              editingId === a.alquilerID ? (
                <form
                  key={a.alquilerID}
                  onSubmit={handleSubmit}
                  className="bg-gray-800 p-6 rounded border border-gray-700"
                >
                  <input type="hidden" name="alquilerID" value={a.alquilerID} />
                  <label className="block mb-2">
                    Dirección:
                    <input
                      name="direccion"
                      value={form.direccion || ''}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white p-2 rounded mt-1"
                    />
                  </label>
                  <label className="block mb-2">
                    Categoría:
                    <select
                      name="categoria"
                      value={form.categoria || ''}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white p-2 rounded mt-1"
                    >
                      <option value="">Seleccione una categoría</option>
                      <option value="Casa">Casa</option>
                      <option value="Departamento">Departamento</option>
                      <option value="Habitación">Habitación</option>
                    </select>
                  </label>
                  <label className="block mb-2">
                    Precio:
                    <input
                      name="precio"
                      type="number"
                      value={form.precio || ''}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white p-2 rounded mt-1"
                    />
                  </label>
                  <label className="block mb-2">
                    Descripción:
                    <textarea
                      name="descripcion"
                      value={form.descripcion || ''}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white p-2 rounded mt-1"
                    />
                  </label>
                  <div className="flex gap-3 mt-4">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                      Guardar
                    </button>
                    <button type="button" onClick={handleCancel} className="bg-gray-600 px-4 py-2 rounded">
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  key={a.alquilerID}
                  className="bg-gray-800 p-6 rounded border border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-xl font-bold text-blue-400">{a.direccion}</h2>
                    <p className="text-gray-300 text-sm">Precio: S/.{a.precio.toFixed(2)}</p>
                    <p className="text-gray-400 text-sm">Categoría: {a.categoria}</p>
                  </div>
                  <button
                    onClick={() => handleEdit(a)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded text-sm"
                  >
                    Editar
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}
