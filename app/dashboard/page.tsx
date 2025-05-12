'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FaUserCircle,
  FaHome,
  FaMoneyBill,
  FaPlus,
  FaClipboardList,
  FaTrash,
} from 'react-icons/fa';
import Link from 'next/link';
import LogoutButton from '../components/LogoutButton';

export default function DashboardPage() {
  const router = useRouter();
  const [userSession, setUserSession] = useState<any>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem('session');
    if (!sessionData) {
      router.push('/login');
      return;
    }

    try {
      const parsed = JSON.parse(sessionData);
      setUserSession(parsed);
    } catch (error) {
      localStorage.removeItem('session');
      router.push('/login');
    }
  }, []);

  if (!userSession) return null; // o un loading spinner

  const { nombres, apellidos, telefono, tipoUsuario, email } = userSession;
  const isOwner = tipoUsuario === 'Propietario';

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Panel de Usuario</h1>
          <Link
            href="/"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      {/* Perfil */}
      <section className="max-w-6xl mx-auto mt-10 px-6">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-md flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="bg-blue-900 text-blue-400 p-4 rounded-full">
              <FaUserCircle size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white mb-1">
                {nombres} {apellidos}
              </h2>
              <p className="text-gray-300 text-sm">Teléfono: {telefono}</p>
              <p className="text-gray-300 text-sm">
                Rol: <span className="font-semibold">{tipoUsuario}</span>
              </p>
              <p className="text-gray-300 text-sm">Correo: {email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </section>

      {/* Acciones */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h3 className="text-xl font-bold text-gray-200 mb-8">
          {isOwner ? 'Acciones del Propietario' : 'Opciones para Inquilinos'}
        </h3>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isOwner ? (
            <>
              <DashboardCard
                icon={<FaPlus size={24} />}
                title="Publicar propiedad"
                link="/create-listing"
                description="Comparte tu propiedad con posibles inquilinos."
              />
              <DashboardCard
                icon={<FaClipboardList size={24} />}
                title="Mis propiedades"
                link="/my-listings"
                description="Revisa y gestiona tus propiedades."
              />
              <DashboardCard
                icon={<FaTrash size={24} />}
                title="Eliminar propiedad"
                link="/delete-listings"
                description="Quita publicaciones que ya no deseas mostrar."
              />
            </>
          ) : (
            <>
              <DashboardCard
                icon={<FaHome size={24} />}
                title="Explorar propiedades"
                link="/listings"
                description="Encuentra un lugar perfecto para ti."
              />
              <DashboardCard
                icon={<FaMoneyBill size={24} />}
                title="Mis pagos"
                link="/my-payments"
                description="Consulta tu historial y estado de pagos."
              />
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-white-500 py-6 bg-gray-800 border-t border-gray-700">
        © 2025 Proppiconnect. Todos los derechos reservados.
      </footer>
    </main>
  );
}

function DashboardCard({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link href={link}>
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:scale-[1.03] hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer">
        <div className="flex items-center gap-4 text-blue-400 mb-4">
          <div className="bg-blue-900 p-2 rounded-md">{icon}</div>
          <h4 className="text-lg font-semibold text-white">{title}</h4>
        </div>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </Link>
  );
}
