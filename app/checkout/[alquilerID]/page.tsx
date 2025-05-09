'use client';

import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { FaMapMarkerAlt, FaMoneyBillWave, FaUser, FaPlus, FaTrash } from 'react-icons/fa';

const prisma = new PrismaClient();

export default async function PropertyDetailPage({ params }: { params: { alquilerID: string } }) {
  const alquiler = await prisma.alquiler.findUnique({
    where: { alquilerID: Number(params.alquilerID) },
    include: { usuario: true },
  });

  if (!alquiler) return notFound();

  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{alquiler.categoria}</h1>
          <Link
            href="/listings"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Volver al listado
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow space-y-4">
          <p className="flex items-center gap-2 text-gray-300">
            <FaMapMarkerAlt /> {alquiler.direccion}
          </p>
          <p className="flex items-center gap-2 text-gray-300">
            <FaMoneyBillWave />{' '}
            <span className="text-lg font-bold text-green-400">S/.{alquiler.precio.toFixed(2)}</span>
          </p>
          <p className="text-gray-400">{alquiler.descripcion || 'Sin descripción.'}</p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FaUser /> Publicado por: {alquiler.usuario?.name || 'Propietario'}
          </p>
        </div>

        <SimulatedSplitPayment precio={alquiler.precio} />
      </div>
    </main>
  );
}

// 🔽 Componente mejorado y corregido
function SimulatedSplitPayment({ precio }: { precio: number }) {
  const [splits, setSplits] = useState([{ email: '', amount: '' }]);
  const [error, setError] = useState('');

  // ✅ Suma robusta que ignora campos vacíos
  const total = splits.reduce((sum, s) => {
    const amount = parseFloat(s.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const handleChange = (index: number, key: 'email' | 'amount', value: string) => {
    const updated = [...splits];
    updated[index][key] = value;
    setSplits(updated);
  };

  const handleAdd = () => {
    setSplits([...splits, { email: '', amount: '' }]);
  };

  const handleRemove = (index: number) => {
    setSplits(splits.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = splits.every(s => s.email.trim() && !isNaN(parseFloat(s.amount)) && parseFloat(s.amount) > 0);

    if (!isValid) {
      setError('Todos los campos deben estar correctamente llenados con montos mayores a 0.');
      return;
    }

    if (Math.abs(total - precio) > 0.01) {
      setError(`La suma total debe ser exactamente S/.${precio.toFixed(2)}. Actualmente: S/.${total.toFixed(2)}`);
      return;
    }

    setError('');
    console.log('✅ Pago dividido simulado con éxito:', splits);
    alert('✅ Pago dividido simulado con éxito');
  };

  return (
    <section className="mt-12 bg-gray-800 p-6 rounded-lg shadow space-y-6">
      <h2 className="text-xl font-semibold text-white">Simular pago dividido</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {splits.map((split, index) => (
          <div key={index} className="flex items-center gap-4">
            <input
              type="email"
              required
              placeholder="correo@usuario.com"
              className="bg-gray-700 p-2 rounded w-full text-sm"
              value={split.email}
              onChange={(e) => handleChange(index, 'email', e.target.value)}
            />
            <input
              type="number"
              required
              min={0}
              step="any"
              placeholder="Monto S/."
              className="bg-gray-700 p-2 rounded w-32 text-sm"
              value={split.amount}
              onChange={(e) => handleChange(index, 'amount', e.target.value)}
            />
            {splits.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-600"
          >
            <FaPlus /> Añadir otro usuario
          </button>
          <p className="text-sm text-gray-300">
            Total actual: <strong>S/.{total.toFixed(2)}</strong>
          </p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded text-white font-semibold text-sm mt-4"
        >
          Confirmar pago simulado
        </button>
      </form>
    </section>
  );
}
