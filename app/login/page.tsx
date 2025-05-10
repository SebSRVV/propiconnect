'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaHome } from 'react-icons/fa';

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

export default function LoginPage() {
  const isClient = useIsClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Iniciar sesión</h1>

        {error && <div className="bg-red-200 text-red-800 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-gray-200">
          <div className="flex items-center bg-gray-700 rounded px-3 py-2">
            <FaEnvelope className="text-gray-300 mr-2" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center bg-gray-700 rounded px-3 py-2">
            <FaLock className="text-gray-300 mr-2" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-blue-400 font-medium hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>

      <button
        onClick={() => router.push('/')}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg transition duration-300"
        title="Volver al inicio"
      >
        <FaHome className="text-xl" />
      </button>
    </div>
  );
}
