export const dynamic = 'force-dynamic';

import db from '@/lib/db';
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

export default async function ListingsPage() {
  const [rows]: any = await db.query('SELECT * FROM propiedad');
  const propiedades: Propiedad[] = rows;

  return <ClientWrapper propiedadesIniciales={propiedades} />;
}
