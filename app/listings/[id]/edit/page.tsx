import db from '@/lib/db';
import { notFound } from 'next/navigation';
import EditForm from './EditForm';

interface Propiedad {
  id: number;
  titulo: string;
  ubicacion: string;
  descripcion: string;
  precio: number;
  tipo: string;
  estado: string;
  imagenUrl?: string;
}

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) return notFound();

  const [rows]: any = await db.query('SELECT * FROM propiedad WHERE id = ?', [id]);

  if (!rows || rows.length === 0) return notFound();

  const propiedad: Propiedad = rows[0];

  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Editar Propiedad</h1>
      <EditForm propiedad={propiedad} />
    </main>
  );
}
