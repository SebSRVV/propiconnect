// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Proppiconnect</h1>
          <nav className="space-x-4">
            <Link href="/listings" className="text-blue-600 hover:underline">Explorar Propiedades</Link>
            <Link href="/create-listing" className="text-blue-600 hover:underline">Publicar</Link>
            <Link href="/login" className="text-gray-600 hover:underline">Iniciar Sesión</Link>
            <Link href="/register" className="text-gray-600 hover:underline">Registrarse</Link>
          </nav>
        </div>
      </header>

      <section className="text-center py-20 bg-blue-100">
        <h2 className="text-4xl font-bold mb-4">Alquila o vende tu propiedad fácilmente</h2>
        <p className="text-xl text-gray-700 mb-8">Con Proppiconnect puedes publicar tu casa, departamento o habitación. Además, permite que varios usuarios compartan el pago.</p>
        <div className="space-x-4">
          <Link href="/listings">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">Buscar Propiedades</button>
          </Link>
          <Link href="/create-listing">
            <button className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50">Publicar Propiedad</button>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-12 px-4">
        <h3 className="text-2xl font-semibold mb-6">¿Cómo funciona?</h3>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div>
            <h4 className="font-bold">1. Regístrate</h4>
            <p className="text-gray-600">Crea una cuenta como propietario o usuario.</p>
          </div>
          <div>
            <h4 className="font-bold">2. Publica o Explora</h4>
            <p className="text-gray-600">Publica tu propiedad o busca lugares disponibles.</p>
          </div>
          <div>
            <h4 className="font-bold">3. Paga entre varios</h4>
            <p className="text-gray-600">Divide el pago entre compañeros de cuarto fácilmente.</p>
          </div>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-500 py-6 bg-gray-100">
        © 2025 Proppiconnect. Todos los derechos reservados.
      </footer>
    </main>
  );
}
