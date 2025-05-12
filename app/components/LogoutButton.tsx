'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Eliminar sesión de localStorage
    localStorage.removeItem('session');

    // Redirigir a la página de logout (que elimina cookie y redirige a /login)
    router.push('/logout');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-lg transition-all text-white py-2 px-4 rounded-md shadow"
    >
      Cerrar sesión
    </button>
  );
}
