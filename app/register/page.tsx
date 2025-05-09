'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaUser, FaPhone } from 'react-icons/fa';

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

export default function RegisterPage() {
  const isClient = useIsClient();
  const router = useRouter();

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState<'Inquilino' | 'Propietario'>('Inquilino');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombres, apellidos, telefono, email, password, tipoUsuario }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error en el registro');

      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Crear cuenta</h1>

        {error && <div className="bg-red-200 text-red-800 p-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-gray-200">
          <div className="flex items-center bg-gray-700 rounded px-3 py-2">
            <FaUser className="text-gray-300 mr-2" />
            <input
              type="text"
              placeholder="Nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
              className="w-full bg-transparent text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center bg-gray-700 rounded px-3 py-2">
            <FaUser className="text-gray-300 mr-2" />
            <input
              type="text"
              placeholder="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
              className="w-full bg-transparent text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center bg-gray-700 rounded px-3 py-2">
            <FaPhone className="text-gray-300 mr-2" />
            <input
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              className="w-full bg-transparent text-white focus:outline-none"
            />
          </div>

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

          <div className="bg-gray-700 rounded px-3 py-2">
            <label htmlFor="tipoUsuario" className="text-sm text-gray-300 mb-1 block">Tipo de usuario</label>
            <select
              id="tipoUsuario"
              value={tipoUsuario}
              onChange={(e) => setTipoUsuario(e.target.value as 'Inquilino' | 'Propietario')}
              className="w-full bg-transparent text-white focus:outline-none"
            >
              <option value="Inquilino">Inquilino</option>
              <option value="Propietario">Propietario</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-400 font-medium hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
