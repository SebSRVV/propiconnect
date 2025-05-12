'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaArrowLeft } from 'react-icons/fa';

export default function NoAutorizadoPage() {
  const router = useRouter();

  // Redirección opcional automática después de unos segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); // o a login
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6 text-center">
      <FaLock size={64} className="text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Acceso Denegado</h1>
      <p className="mb-4 text-gray-300">
        No tienes permiso para acceder a esta página. Solo los propietarios pueden realizar esta acción.
      </p>

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
      >
        <FaArrowLeft />
        Volver
      </button>

      <p className="mt-4 text-sm text-gray-500">
        Serás redirigido automáticamente al inicio en 10 segundos.
      </p>
    </div>
  );
}
