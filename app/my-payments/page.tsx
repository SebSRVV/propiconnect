export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import db from '@/lib/db';

interface Pago {
  id: number;
  propiedad: string;
  monto: number | string;
  fechaPago: string;
  estado: string;
}

export default async function MyPaymentsPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  if (!session) {
    return redirect('/login');
  }

  let user: any;
  try {
    user = JSON.parse(session);
  } catch {
    return redirect('/login');
  }

  const credencialID = user.id;

  const [usuarioRows]: any = await db.query(
    'SELECT id FROM usuario WHERE credencialID = ?',
    [credencialID]
  );

  if (!usuarioRows.length) {
    return (
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-red-400">Usuario no encontrado.</p>
      </main>
    );
  }

  const usuarioID = usuarioRows[0].id;

  const [pagos]: any = await db.query(
    `SELECT p.id, pr.titulo AS propiedad, p.monto, p.fechaPago, p.estado
     FROM pago p
     JOIN reserva r ON p.reservaID = r.id
     JOIN grupo g ON r.grupoID = g.id
     JOIN propiedad pr ON g.propiedadID = pr.id
     WHERE p.usuarioID = ?
     ORDER BY p.fechaPago DESC`,
    [usuarioID]
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-12 relative">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white border-b border-gray-700 pb-4">Mis Pagos</h1>

        {pagos.length === 0 ? (
          <p className="text-gray-400 text-center mt-12">No tienes pagos registrados todavía.</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {pagos.map((pago: Pago) => {
              const monto = Number(pago.monto);
              return (
                <div
                  key={pago.id}
                  className="bg-gray-800 border border-gray-700 rounded-md p-5 shadow-md hover:border-blue-500 transition"
                >
                  <h2 className="text-lg font-semibold text-blue-400 mb-2">{pago.propiedad}</h2>
                  <p className="text-sm text-gray-400">
                    Fecha de pago:{' '}
                    {new Date(pago.fechaPago).toLocaleDateString('es-ES')}
                  </p>
                  <p className="text-sm text-gray-400">
                    Monto:{' '}
                    <span className="text-white font-bold">
                      ${isNaN(monto) ? '0.00' : monto.toFixed(2)}
                    </span>
                  </p>
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      pago.estado === 'pagado'
                        ? 'text-green-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    Estado: {pago.estado}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🔁 Botón fijo abajo a la derecha */}
      <Link
        href="/dashboard"
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg transition text-sm font-semibold"
      >
        Volver al Dashboard
      </Link>
    </main>
  );
}
