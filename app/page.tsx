export const dynamic = 'force-dynamic';

import Link from "next/link";
import { FaSearch, FaHome, FaUserPlus, FaMoneyCheckAlt } from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white-500 tracking-tight">PROPICONNECT</h1>
          <nav className="space-x-4 text-sm">
            <Link href="/listings" className="text-gray-300 hover:text-blue-400 transition">Explorar</Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 transition">Dashboard</Link>
            <Link href="/login" className="text-gray-400 hover:text-blue-300 transition">Iniciar Sesión</Link>
            <Link href="/register" className="text-gray-400 hover:text-blue-300 transition">Registrarse</Link>
          </nav>
        </div>
      </header>

      <section className="text-center py-24 bg-gradient-to-b from-blue-900 via-blue-800 to-gray-900">
        <h2 className="text-5xl font-extrabold mb-4">Encuentra tu próximo hogar</h2>
        <p className="text-xl text-gray-300 mb-10">
          Alquila, vende o encuentra propiedades donde el pago puede compartirse entre varios usuarios.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/listings">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
              <FaSearch /> Buscar propiedades
            </button>
          </Link>
          <Link href="/create-listing">
            <button className="flex items-center gap-2 border border-blue-400 text-blue-400 px-6 py-3 rounded-md hover:bg-blue-500 hover:text-white transition">
              <FaHome /> Publicar propiedad
            </button>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-16 px-6">
        <h3 className="text-3xl font-semibold mb-10 text-center">¿Cómo funciona?</h3>
        <div className="grid md:grid-cols-3 gap-10 text-left text-gray-300">
          <div className="bg-gray-800 p-6 rounded-lg hover:scale-105 transition">
            <div className="flex items-center gap-3 text-blue-400 mb-3">
              <FaUserPlus size={20} />
              <h4 className="text-xl font-bold">1. Regístrate</h4>
            </div>
            <p>Crea una cuenta como <strong>propietario</strong> o <strong>inquilino</strong> para comenzar a usar la plataforma.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg hover:scale-105 transition">
            <div className="flex items-center gap-3 text-blue-400 mb-3">
              <FaHome size={20} />
              <h4 className="text-xl font-bold">2. Publica o explora</h4>
            </div>
            <p>Publica tu propiedad en minutos o explora miles de lugares disponibles en todo el país.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg hover:scale-105 transition">
            <div className="flex items-center gap-3 text-blue-400 mb-3">
              <FaMoneyCheckAlt size={20} />
              <h4 className="text-xl font-bold">3. Pago compartido</h4>
            </div>
            <p>Proppiconnect permite dividir el pago entre compañeros de habitación o arrendatarios.</p>
          </div>
        </div>
      </section>

      <footer className="text-center text-sm text-white-500 py-6 bg-gray-800 border-t border-gray-700">
        © 2025 Proppiconnect. Todos los derechos reservados.
      </footer>
    </main>
  );
}
