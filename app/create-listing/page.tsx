'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaFileAlt, FaMapMarkerAlt, FaDollarSign, FaImage } from 'react-icons/fa';

export default function CreateListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    precio: '',
    tipo: 'casa',
    modo: 'alquiler',
    imagenUrl: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/propiedad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear propiedad');

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8 w-full max-w-lg space-y-5">
        <h1 className="text-3xl font-bold text-center text-white mb-2">Publicar Propiedad</h1>
        {error && <div className="bg-red-200 text-red-800 p-2 rounded text-sm">{error}</div>}

        <div className="flex items-center bg-gray-700 rounded px-3 py-2">
          <FaHome className="text-gray-300 mr-2" />
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            required
            placeholder="Título"
            className="w-full bg-transparent text-white focus:outline-none"
          />
        </div>

        <div className="bg-gray-700 rounded px-3 py-2">
          <label htmlFor="descripcion" className="text-sm text-gray-300 block mb-1">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            required
            rows={3}
            className="w-full bg-transparent text-white resize-none focus:outline-none"
          />
        </div>

        <div className="flex items-center bg-gray-700 rounded px-3 py-2">
          <FaMapMarkerAlt className="text-gray-300 mr-2" />
          <input
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            required
            placeholder="Ubicación"
            className="w-full bg-transparent text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center bg-gray-700 rounded px-3 py-2">
          <FaDollarSign className="text-gray-300 mr-2" />
          <input
            type="number"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            required
            placeholder="Precio"
            className="w-full bg-transparent text-white focus:outline-none"
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="text-sm text-gray-300 block mb-1">Tipo</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none"
            >
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="habitacion">Habitación</option>
            </select>
          </div>

          <div className="w-1/2">
            <label className="text-sm text-gray-300 block mb-1">Modo</label>
            <select
              name="modo"
              value={form.modo}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white p-2 rounded focus:outline-none"
            >
              <option value="alquiler">Alquiler</option>
              <option value="venta">Venta</option>
            </select>
          </div>
        </div>

        <div className="flex items-center bg-gray-700 rounded px-3 py-2">
          <FaImage className="text-gray-300 mr-2" />
          <input
            name="imagenUrl"
            value={form.imagenUrl}
            onChange={handleChange}
            placeholder="URL de imagen (opcional)"
            className="w-full bg-transparent text-white focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 py-2 rounded text-white transition ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Publicando...' : 'Publicar propiedad'}
        </button>
      </form>
    </div>
  );
}
