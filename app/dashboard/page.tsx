import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import {
  FaHome,
  FaMoneyBill,
  FaPlus,
  FaClipboardList,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const { user } = session;
  const isOwner = user.tipoUsuario === 'Propietario';

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Panel de {user.tipoUsuario}</h1>
            <p className="text-sm text-gray-400">Bienvenido, {user.name}</p>
          </div>
          <Link
            href="/"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isOwner ? (
            <>
              <DashboardCard
                icon={<FaPlus size={24} />}
                title="Publicar nueva propiedad"
                link="/create-listing"
                description="Comparte tu propiedad con posibles inquilinos."
              />
              <DashboardCard
                icon={<FaClipboardList size={24} />}
                title="Mis propiedades"
                link="/my-listings"
                description="Revisa, edita o elimina tus propiedades publicadas."
              />
              <DashboardCard
                icon={<FaEdit size={24} />}
                title="Editar propiedad"
                link="/edit-listings"
                description="Accede a la edición de tus propiedades."
              />
              <DashboardCard
                icon={<FaTrash size={24} />}
                title="Eliminar propiedad"
                link="/delete-listings"
                description="Elimina propiedades que ya no deseas publicar."
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
                description="Revisa el historial y estado de tus pagos."
              />
            </>
          )}
        </div>
      </section>

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
