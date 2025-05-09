import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { FaHome, FaMoneyBill, FaPlus, FaClipboardList } from 'react-icons/fa';
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
          <h1 className="text-2xl font-bold text-white">Panel de {user.tipoUsuario}</h1>
          <p className="text-gray-400">Bienvenido, {user.name}</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto py-16 px-6">
        <div className="grid md:grid-cols-2 gap-10">
          {isOwner ? (
            <>
              <DashboardCard
                icon={<FaPlus />}
                title="Publicar nueva propiedad"
                link="/create-listing"
                description="Comparte tu propiedad con posibles inquilinos."
              />
              <DashboardCard
                icon={<FaClipboardList />}
                title="Mis propiedades"
                link="/my-listings"
                description="Revisa, edita o elimina tus propiedades publicadas."
              />
            </>
          ) : (
            <>
              <DashboardCard
                icon={<FaHome />}
                title="Explorar propiedades"
                link="/listings"
                description="Encuentra un lugar perfecto para ti."
              />
              <DashboardCard
                icon={<FaMoneyBill />}
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
      <div className="bg-gray-800 p-6 rounded-lg hover:scale-105 hover:bg-gray-700 transition">
        <div className="flex items-center gap-3 text-blue-400 mb-3">
          {icon}
          <h4 className="text-xl font-bold">{title}</h4>
        </div>
        <p className="text-gray-300">{description}</p>
      </div>
    </Link>
  );
}
