'use client';

import { useEffect, useState } from 'react';
import ClientWrapper from './ClientWrapper';

interface Propiedad {
  id: number;
  titulo: string;
  ubicacion: string;
  descripcion: string;
  precio: number;
  tipo: string;
  estado: string;
  propietarioId: number;
  imagenUrl?: string;
}

export default function DeleteListingsPage() {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/delete-listings');
        if (!res.ok) throw new Error('No autorizado o error de servidor');

        const data = await res.json();
        setPropiedades(data);
      } catch (err) {
        alert((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    setPropiedades((prev) => prev.filter((prop) => prop.id !== id));
  };

  if (loading) {
    return <p className="text-white text-center mt-10">Cargando tus propiedades...</p>;
  }

  return (
    <ClientWrapper propiedades={propiedades} onDelete={handleDelete} />
  );
}
