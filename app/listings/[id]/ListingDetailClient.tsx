'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaMapMarkerAlt,
  FaHome,
  FaTags,
  FaClipboardList,
  FaShoppingCart,
  FaHandshake,
  FaCalendarAlt,
} from 'react-icons/fa';
import { GrMoney } from 'react-icons/gr';

interface Propiedad {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  tipo: string;
  modo: string;
  estado: string;
  ubicacion: string;
  imagenUrl?: string;
}

interface Resena {
  id: number;
  nombre: string;
  comentario: string;
  fechaCreacion: string;
}

function getImagenPorTipo(tipo: string) {
  const tipos: Record<string, string> = {
    casa: '/casa.jpg',
    departamento: '/departamento.jpg',
    habitacion: '/habitacion.jpg',
  };
  return tipos[tipo.toLowerCase()] || '/casa.jpg';
}

export default function ListingDetailClient() {
  const { id } = useParams();
  const router = useRouter();

  const [userSession, setUserSession] = useState<any>(null);
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [error, setError] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [reseña, setReseña] = useState('');
  const [resenas, setResenas] = useState<Resena[]>([]);

  // Verificación de sesión
  useEffect(() => {
    const sessionData = localStorage.getItem('session');
    if (!sessionData) {
      router.push('/login');
      return;
    }

    try {
      const parsed = JSON.parse(sessionData);
      setUserSession(parsed);
    } catch (error) {
      localStorage.removeItem('session');
      router.push('/login');
    }
  }, []);

  // Cargar datos de propiedad y reseñas
  useEffect(() => {
    if (id) {
      fetchPropiedad();
      fetchResenas();
    }
  }, [id]);

  const fetchPropiedad = async () => {
    try {
      const res = await fetch(`/api/propiedad/${id}`);
      if (!res.ok) throw new Error('No se encontró la propiedad');
      const data = await res.json();
      setPropiedad(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchResenas = async () => {
    try {
      const res = await fetch(`/api/resena?propiedadID=${id}`);
      const data = await res.json();
      if (res.ok) {
        setResenas(data.resenas || []);
      } else {
        console.error('Error al obtener reseñas:', data.message);
      }
    } catch (err) {
      console.error('Error al cargar reseñas:', err);
    }
  };

  const handleCheckout = () => {
    if (!id || !fechaInicio) {
      alert('Por favor selecciona la fecha de inicio.');
      return;
    }

    const queryParams = new URLSearchParams({
      fecha: fechaInicio,
      modo: propiedad!.modo,
    });

    if (fechaFin) queryParams.append('hasta', fechaFin);

    router.push(`/checkout/${id}?${queryParams.toString()}`);
  };

  const handleEnviarReseña = async () => {
    if (!reseña.trim()) {
      alert('La reseña no puede estar vacía.');
      return;
    }

    try {
      const res = await fetch('/api/resena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propiedadID: Number(id),
          comentario: reseña,
          nombre: userSession?.nombres || 'Anónimo', // si tu backend lo acepta
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Error al enviar la reseña.');
        return;
      }

      alert('Gracias por tu reseña.');
      setReseña('');
      fetchResenas();
    } catch (err) {
      alert('Hubo un error al enviar la reseña.');
    }
  };

  if (!userSession) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p className="text-xl text-gray-300">Verificando sesión...</p>
      </main>
    );
  }

  if (error) {
    return <p className="text-red-400 text-center mt-10">{error}</p>;
  }

  if (!propiedad) {
    return <p className="text-gray-400 text-center mt-10">Cargando propiedad...</p>;
  }

  const prop = propiedad;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/listings"
          className="inline-block text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow transition"
        >
          ← Volver a listado
        </Link>

        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg space-y-6">
          <img
            src={prop.imagenUrl || getImagenPorTipo(prop.tipo)}
            alt={`Imagen de ${prop.titulo}`}
            className="w-full h-64 object-cover rounded-md"
          />

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
              <FaHome className="text-blue-400 text-2xl" />
              {prop.titulo}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-300 mt-2">
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-400" />
                {prop.ubicacion}
              </span>
              <span className="flex items-center gap-2 capitalize">
                <FaHome className="text-yellow-400" />
                {prop.tipo}
              </span>
              <span className="flex items-center gap-2 capitalize">
                <FaClipboardList className="text-blue-300" /> {prop.modo}
              </span>
              <span
                className={`flex items-center gap-2 font-semibold ${
                  prop.estado === 'disponible'
                    ? 'text-green-400'
                    : prop.estado === 'alquilada'
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
              >
                <FaHandshake />
                {prop.estado}
              </span>
            </div>
          </div>

          <hr className="border-gray-600" />

          <div className="flex items-center justify-between text-lg mt-4">
            <p className="text-blue-400 font-bold flex items-center gap-2">
              <GrMoney className="text-xl" />
              S/.{prop.precio.toLocaleString()}
              <span className="text-sm text-gray-400 ml-1">
                {prop.modo === 'alquiler' ? '/ mes' : 'PEN'}
              </span>
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Descripción</h2>
            <div className="bg-gray-700 text-gray-300 p-4 rounded-md leading-relaxed whitespace-pre-line">
              {prop.descripcion}
            </div>
          </div>

          {prop.estado === 'disponible' && (
            <div className="mt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    <FaCalendarAlt className="inline mr-1" /> Fecha de inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-300">
                    <FaCalendarAlt className="inline mr-1" /> Fecha de fin (opcional)
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md shadow-md flex items-center justify-center gap-2 text-lg font-semibold transition"
                onClick={handleCheckout}
              >
                <FaShoppingCart />
                {prop.modo === 'alquiler' ? 'Alquilar propiedad' : 'Comprar propiedad'}
              </button>
            </div>
          )}

          <section className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">Reseñas</h2>

            {resenas.length === 0 ? (
              <p className="text-gray-400 text-sm mb-6">
                Aún no hay reseñas para esta propiedad.
              </p>
            ) : (
              <div className="space-y-4 mb-6">
                {resenas.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-700 p-4 rounded-md border border-gray-600"
                  >
                    <p className="text-sm text-gray-200 italic">"{review.comentario}"</p>
                    <p className="text-xs text-right text-gray-400 mt-2">
                      – {review.nombre},{' '}
                      {new Date(review.fechaCreacion).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gray-700 border border-gray-600 p-4 rounded-md space-y-3">
              <label htmlFor="review" className="block text-sm text-gray-300 font-medium">
                Escribe tu reseña:
              </label>
              <textarea
                id="review"
                rows={3}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Comparte tu experiencia..."
                value={reseña}
                onChange={(e) => setReseña(e.target.value)}
              />
              <button
                onClick={handleEnviarReseña}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Enviar reseña
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
