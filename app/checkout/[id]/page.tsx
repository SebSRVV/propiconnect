'use client';

export const dynamic = 'force-dynamic';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaCalendarAlt,
  FaDollarSign,
  FaUserPlus,
  FaCheckCircle,
  FaTrash,
  FaMapMarkerAlt,
  FaHome,
  FaTag,
  FaList,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaEnvelope,
  FaExclamationTriangle,
  FaArrowLeft,
  FaClipboardCheck,
} from 'react-icons/fa';

interface Propiedad {
  id: number;
  titulo: string;
  ubicacion: string;
  precio: number;
  tipo: string;
  modo: 'alquiler' | 'venta';
  imagenUrl?: string;
}

interface Participante {
  email: string;
  monto: number;
}

function getImagenPorTipo(tipo: string): string {
  const imagenes: Record<string, string> = {
    casa: '/casa.jpg',
    departamento: '/departamento.jpg',
    habitacion: '/habitacion.jpg',
  };
  return imagenes[tipo.toLowerCase()] || '/casa.jpg';
}

export default function CheckoutPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const fecha = searchParams.get('fecha');
  const modo = searchParams.get('modo') || 'alquiler';

  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [nuevoEmail, setNuevoEmail] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const totalAportado = participantes.reduce((sum, p) => sum + p.monto, 0);
  const restante = propiedad ? propiedad.precio - totalAportado : 0;

  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        const res = await fetch(`/api/propiedad/${id}`);
        if (!res.ok) throw new Error('No se pudo cargar la propiedad');
        const data = await res.json();
        setPropiedad(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPropiedad();
  }, [id]);

  const handleAgregar = () => {
    const email = nuevoEmail.trim().toLowerCase();
    const monto = parseFloat(nuevoMonto);

    if (!email || isNaN(monto) || monto <= 0) {
      setMensaje('Ingresa un correo válido y un monto mayor a 0.');
      return;
    }

    if (participantes.some((p) => p.email === email)) {
      setMensaje('Este correo ya fue agregado.');
      return;
    }

    setParticipantes([...participantes, { email, monto }]);
    setNuevoEmail('');
    setNuevoMonto('');
    setMensaje('');
  };

  const handleEliminar = (index: number) => {
    const copia = [...participantes];
    copia.splice(index, 1);
    setParticipantes(copia);
  };

  const handleConfirmar = async () => {
    setMensaje('');
    if (!id || !fecha) {
      setMensaje('Faltan datos: asegúrate de tener una fecha válida.');
      return;
    }

    if (restante > 0) {
      setMensaje('El monto total no cubre el precio de la propiedad.');
      return;
    }

    setConfirming(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propiedadID: Number(id),
          fechaInicio: fecha,
          adicionales: participantes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');

      setResultado(data);
      setMensaje('');
      setPropiedad((prev) =>
        prev ? { ...prev, estado: modo === 'venta' ? 'vendida' : 'alquilada' } : prev
      );
    } catch (err: any) {
      setMensaje(err.message || 'Error al confirmar');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <FaClock className="mr-2 animate-spin" /> Cargando propiedad...
      </div>
    );
  }

  if (error || !propiedad) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
        <FaExclamationTriangle className="mr-2 text-red-400" /> Error: {error}
      </div>
    );
  }

  const imagen = propiedad.imagenUrl || getImagenPorTipo(propiedad.tipo);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 shadow">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaClipboardCheck /> Checkout de Propiedad #{propiedad.id}
          </h1>
          <button
            onClick={() => router.push('/listings')}
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
          >
            <FaArrowLeft /> Volver a la lista
          </button>
        </div>
      </header>

      <section className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <img src={imagen} alt={propiedad.titulo} className="w-full h-64 object-cover rounded-t-lg" />

          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaHome /> {propiedad.titulo}
            </h2>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              <FaMapMarkerAlt /> {propiedad.ubicacion}
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1"><FaTag /> Tipo</p>
                <p className="capitalize">{propiedad.tipo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1"><FaList /> Modo</p>
                <p className="capitalize">{propiedad.modo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1"><FaMoneyBillWave /> Precio total</p>
                <p className="text-blue-400 font-semibold">
                  S/. {propiedad.precio.toLocaleString()}
                </p>
              </div>
              {fecha && (
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><FaCalendarAlt /> Fecha de inicio</p>
                  <p className="flex items-center gap-2">{fecha}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-700 p-4 rounded-md space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <FaUsers /> División de pagos
              </h3>

              <div className="flex gap-4 flex-wrap sm:flex-nowrap">
                <input
                  type="email"
                  placeholder="Correo del usuario"
                  value={nuevoEmail}
                  onChange={(e) => setNuevoEmail(e.target.value)}
                  className="flex-1 bg-gray-800 px-3 py-2 rounded text-white"
                />
                <input
                  type="number"
                  placeholder="Monto"
                  value={nuevoMonto}
                  onChange={(e) => setNuevoMonto(e.target.value)}
                  className="w-32 bg-gray-800 px-3 py-2 rounded text-white"
                />
                <button
                  onClick={handleAgregar}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                >
                  <FaUserPlus className="inline" /> Agregar
                </button>
              </div>

              {participantes.length > 0 && (
                <ul className="text-sm mt-4 space-y-2">
                  {participantes.map((p, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded"
                    >
                      <span>
                        <FaEnvelope className="inline mr-1" /> {p.email} — S/. {p.monto.toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleEliminar(i)}
                        className="text-red-400 hover:text-red-600 text-xs"
                      >
                        <FaTrash className="inline" /> Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="text-sm mt-4 text-gray-300 space-y-1">
                <p>
                  Total aportado:{' '}
                  <span className="text-white font-semibold">
                    S/. {totalAportado.toFixed(2)}
                  </span>
                </p>
                <p>
                  Restante:{' '}
                  <span className={restante > 0 ? 'text-red-400' : 'text-green-400'}>
                    S/. {restante.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            {mensaje && (
              <div className="text-sm text-red-400 flex items-center gap-2">
                <FaExclamationTriangle /> {mensaje}
              </div>
            )}

            {resultado ? (
              <div className="bg-green-800 p-4 rounded-md border border-green-500 text-sm mt-4 space-y-2">
                <p className="flex items-center gap-2">
                  <FaCheckCircle /> {resultado.message}
                </p>
                <p><strong>Grupo ID:</strong> {resultado.grupoID}</p>
                <p><strong>Reserva ID:</strong> {resultado.reservaID}</p>
                <button
                  className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                  onClick={() => router.push('/dashboard')}
                >
                  Ir al panel
                </button>
              </div>
            ) : (
              <button
                onClick={handleConfirmar}
                disabled={restante > 0 || confirming}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {confirming
                  ? 'Procesando...'
                  : `Confirmar ${modo === 'venta' ? 'compra' : 'alquiler'}`}
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
