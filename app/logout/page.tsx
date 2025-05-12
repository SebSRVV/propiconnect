'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { IoIosLogOut } from "react-icons/io";

export default function NoAutorizadoPage() {
  const router = useRouter();

  // Redirección opcional automática después de unos segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); // o a login
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6 text-center">
      <IoIosLogOut  size={64} className="text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Sesion cerrada</h1>
      <p className="mb-4 text-gray-300">
        Cerraste sesión con éxito.
      </p>
      <form
  action="/logout"
  method="POST"
  onSubmit={() => {
    localStorage.removeItem('session');
  }}
>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-blue-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
      >
        <FaArrowLeft />
        Volver
      </button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        Serás redirigido automáticamente al inicio en 5 segundos.
      </p>
    </div>
  );
}
