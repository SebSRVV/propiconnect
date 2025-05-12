'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaDoorOpen,
  FaTags,
  FaClipboardList,
  FaHandshake,
  FaFilter,
} from 'react-icons/fa';

interface Propiedad {
  id: number;
  titulo: string;
  ubicacion: string;
  descripcion: string;
  precio: number;
  tipo: string;
  modo: string;
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

function getTipoIcono(tipo: string) {
  const t = tipo.toLowerCase();
  if (t === 'casa') return { icon: <FaHome className="text-yellow-300" />, label: 'Casa' };
  if (t === 'departamento') return { icon: <FaBuilding className="text-blue-300" />, label: 'Departamento' };
  if (t === 'habitacion' || t === 'habitación')
    return { icon: <FaDoorOpen className="text-purple-300" />, label: 'Habitación' };
  return { icon: <FaHome className="text-gray-300" />, label: tipo };
}

function getModoBadge(modo: string) {
  if (modo.toLowerCase() === 'venta') {
    return {
      icon: <FaTags className="mr-1" />,
      label: 'Venta',
      className: 'bg-blue-700 text-blue-100',
    };
  } else {
    return {
      icon: <FaClipboardList className="mr-1" />,
      label: 'Alquiler',
      className: 'bg-indigo-700 text-indigo-100',
    };
  }
}

export default function ListingsPage() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [orden, setOrden] = useState('recientes');
  const [tipoFiltro, setTipoFiltro] = useState('Todos');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/propiedad');
      const data = await res.json();
      setPropiedades(data);
    };

    fetchData();
  }, []);

  const propiedadesFiltradas = propiedades.filter((p) =>
    tipoFiltro.toLowerCase() === 'todos' ? true : p.tipo.toLowerCase() === tipoFiltro.toLowerCase()
  );

  const propiedadesOrdenadas = [...propiedadesFiltradas].sort((a, b) => {
    if (orden === 'precio-mayor') return b.precio - a.precio;
    if (orden === 'precio-menor') return a.precio - b.precio;
    if (orden === 'alquiler') return a.modo.toLowerCase() === 'alquiler' ? -1 : 1;
    if (orden === 'venta') return a.modo.toLowerCase() === 'venta' ? -1 : 1;
    return b.id - a.id; // recientes por defecto
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 shadow">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Explorar Propiedades</h1>
          <Link
            href="/"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto py-10 px-6 flex gap-10">
        {/* Filtro lateral */}
        <aside className="w-full max-w-[220px] bg-gray-800 border border-gray-700 p-4 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaFilter /> Filtrar por tipo
          </h2>
          <ul className="space-y-2 text-sm">
            {['Todos', 'Casa', 'Departamento', 'Habitacion'].map((tipo) => {
              const { icon, label } = getTipoIcono(tipo);
              return (
                <li key={tipo}>
                  <button
                    className={`w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center gap-2 ${
                      tipoFiltro === tipo ? 'bg-gray-700 font-bold' : ''
                    }`}
                    onClick={() => setTipoFiltro(tipo)}
                  >
                    {icon} {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1">
          <div className="flex justify-end mb-6">
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-md text-sm"
            >
              <option value="recientes">Más recientes</option>
              <option value="precio-menor">Precio: Menor a mayor</option>
              <option value="precio-mayor">Precio: Mayor a menor</option>
              <option value="alquiler">Solo alquiler</option>
              <option value="venta">Solo venta</option>
            </select>
          </div>

          {propiedadesOrdenadas.length === 0 ? (
            <p className="text-center text-gray-400">
              No hay propiedades disponibles en este momento.
            </p>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {propiedadesOrdenadas.map((prop) => {
                const { icon, label } = getTipoIcono(prop.tipo);
                const modoBadge = getModoBadge(prop.modo);

                return (
                  <Link key={prop.id} href={`/listings/${prop.id}`}>
                    <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer relative group">
                      <div className="relative">
                        <img
                          src={prop.imagenUrl || getImagenPorTipo(prop.tipo)}
                          alt={prop.titulo}
                          className="w-full h-48 object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                        />
                        {/* Estado */}
                        <span
                          className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide
                            ${
                              prop.estado === 'disponible'
                                ? 'bg-green-600 text-green-100'
                                : prop.estado === 'alquilada'
                                ? 'bg-yellow-600 text-yellow-100'
                                : prop.estado === 'vendida'
                                ? 'bg-red-600 text-red-100'
                                : 'bg-gray-600 text-gray-100'
                            }`}
                        >
                          <FaHandshake className="inline mr-1" />
                          {prop.estado}
                        </span>

                        {/* Tipo */}
                        <span className="absolute bottom-2 right-2 bg-gray-900/80 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1 shadow">
                          {icon}
                          <span className="capitalize">{label}</span>
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mt-4 truncate">{prop.titulo}</h3>
                      <p className="text-sm text-gray-300 flex items-center gap-2 mt-1 mb-2">
                        <FaMapMarkerAlt className="text-red-400" />
                        {prop.ubicacion}
                      </p>

                      <div className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded ${modoBadge.className}`}>
                        {modoBadge.icon}
                        {modoBadge.label}
                      </div>

                      <p className="text-xl font-semibold text-blue-400 mt-3">
                        S/.{prop.precio.toLocaleString()}
                        <span className="text-sm text-gray-400">
                          {prop.modo === 'alquiler' ? ' / mes' : ' PEN'}
                        </span>
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer className="text-center text-sm text-white-500 py-6 bg-gray-800 border-t border-gray-700">
        © 2025 Proppiconnect. Todos los derechos reservados.
      </footer>
    </main>
  );
}
