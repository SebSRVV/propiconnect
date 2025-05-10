'use client';

import db from '@/lib/db';
import { notFound } from 'next/navigation';
import PropertyClient from './PropertyClient';
import { useEffect, useState } from 'react';

interface Propiedad {
  id: number;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  precio: number;
  tipo: string;
  modo: 'alquiler' | 'venta';
  estado: string;
  imagenUrl?: string;
}

function getImagenPorTipo(tipo: string): string {
  const imagenes: Record<string, string> = {
    casa: '/casa.jpg',
    departamento: '/departamento.jpg',
    habitacion: '/habitacion.jpg',
  };
  return imagenes[tipo.toLowerCase()] || '/casa.jpg';
}

export default function PageContent({ propiedadID }: { propiedadID: string }) {
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        const res = await fetch(`/api/propiedad/${propiedadID}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        data.imagenUrl = data.imagenUrl || getImagenPorTipo(data.tipo);
        setPropiedad(data);
      } catch {
        setError(true);
      }
    };

    fetchPropiedad();
  }, [propiedadID]);

  if (error) return notFound();
  if (!propiedad) return <div className="text-white p-6">Cargando...</div>;

  return <PropertyClient propiedad={propiedad} />;
}
