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
import { GrMoney } from "react-icons/gr";

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
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [error, setError] = useState('');

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const [reseña, setReseña] = useState('');
  const [resenas, setResenas] = useState<Resena[]>([]);

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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Error al enviar la reseña.');
        return;
      }

      alert('Gracias por tu reseña.');
      setReseña('');
      fetchResenas(); // Actualizar lista
    } catch (err) {
      alert('Hubo un error al enviar la reseña.');
    }
  };

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
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FaHome className="text-blue-400" />
              {prop.titulo}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-300 mt-2">
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-blue-300" /> {prop.ubicacion}
              </span>
              <span className="flex items-center gap-1 capitalize">
                <FaTags className="text-blue-300" /> {prop.tipo}
              </span>
              <span className="flex items-center gap-1 capitalize">
                <FaClipboardList className="text-blue-300" /> {prop.modo}
              </span>
              <span
                className={`flex items-center gap-1 font-semibold ${
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

          <p className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <GrMoney />
            S/.{prop.precio.toLocaleString()}
            {prop.modo === 'alquiler' ? (
              <span className="text-sm text-gray-400 ml-1"> / mes</span>
            ) : (
              <span className="text-sm text-gray-400 ml-1"> PEN</span>
            )}
          </p>

          <div>
            <h2 className="text-xl font-semibold mb-2">Descripción</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {prop.descripcion}
            </p>
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

          {/* Sección de Reseñas */}
          <section className="mt-12 bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Reseñas</h2>

            {resenas.length === 0 ? (
              <p className="text-gray-400 text-sm">Aún no hay reseñas para esta propiedad.</p>
            ) : (
              <div className="space-y-4 mb-6">
                {resenas.map((review) => (
                  <div key={review.id} className="bg-gray-700 p-4 rounded-md">
                    <p className="text-sm text-gray-300 italic">"{review.comentario}"</p>
                    <p className="text-xs text-right text-gray-400 mt-2">
                      – {review.nombre}, {new Date(review.fechaCreacion).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="review" className="block text-sm text-gray-300 font-medium">
                Escribe tu reseña:
              </label>
              <textarea
                id="review"
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
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
