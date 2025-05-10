import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaMapMarkerAlt, FaMoneyBillWave, FaUser } from 'react-icons/fa';
import SplitPaymentForm from './SplitPaymentForm';

const prisma = new PrismaClient();

// ✅ NO uses PageProps ni ningún tipo global aquí
export default async function PropertyDetailPage({
  params,
}: {
  params: { alquilerID: string };
}) {
  const alquiler = await prisma.alquiler.findUnique({
    where: { alquilerID: Number(params.alquilerID) },
    include: { usuario: true },
  });

  if (!alquiler) return notFound();

  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{alquiler.categoria}</h1>
          <Link
            href="/listings"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Volver al listado
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow space-y-4">
          <p className="flex items-center gap-2 text-gray-300">
            <FaMapMarkerAlt /> {alquiler.direccion}
          </p>
          <p className="flex items-center gap-2 text-gray-300">
            <FaMoneyBillWave />
            <span className="text-lg font-bold text-green-400">S/.{alquiler.precio.toFixed(2)}</span>
          </p>
          <p className="text-gray-400">{alquiler.descripcion || 'Sin descripción.'}</p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FaUser /> Publicado por: {alquiler.usuario?.name || 'Propietario'}
          </p>
        </div>

        <SplitPaymentForm precio={alquiler.precio} />
      </div>
    </main>
  );
}
