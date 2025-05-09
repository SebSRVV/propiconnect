'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    password: '',
    tipoUsuario: 'Inquilino',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message || 'Error al registrar usuario');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-4">Registro</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="nombres" placeholder="Nombres" onChange={handleChange} required className="border p-2 rounded" />
        <input name="apellidos" placeholder="Apellidos" onChange={handleChange} required className="border p-2 rounded" />
        <input name="telefono" placeholder="Teléfono" type="number" onChange={handleChange} className="border p-2 rounded" />
        <input name="email" placeholder="Correo electrónico" type="email" onChange={handleChange} required className="border p-2 rounded" />
        <input name="password" placeholder="Contraseña" type="password" onChange={handleChange} required className="border p-2 rounded" />
        <select name="tipoUsuario" onChange={handleChange} className="border p-2 rounded">
          <option value="Inquilino">Inquilino</option>
          <option value="Propietario">Propietario</option>
        </select>
        <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Registrarse
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        ¿Ya tienes cuenta? <a href="/login" className="text-blue-600 underline">Inicia sesión</a>
      </p>
    </div>
  );
}
