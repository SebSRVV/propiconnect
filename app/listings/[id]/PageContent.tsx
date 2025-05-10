import { notFound } from 'next/navigation';
import db from '@/lib/db';
import PropertyClient from './PropertyClient';

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

export default async function PropertyPageContent({ propiedadID }: { propiedadID: string }) {
  const [rows]: any = await db.query('SELECT * FROM propiedad WHERE id = ?', [propiedadID]);

  if (!rows.length) return notFound();

  const propiedad: Propiedad = rows[0];
  propiedad.imagenUrl = propiedad.imagenUrl || getImagenPorTipo(propiedad.tipo);

  return <PropertyClient propiedad={propiedad} />;
}
