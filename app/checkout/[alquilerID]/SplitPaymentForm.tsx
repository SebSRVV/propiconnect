'use client';

import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function SplitPaymentForm({ precio }: { precio: number }) {
  const [splits, setSplits] = useState([{ email: '', amount: '' }]);
  const [error, setError] = useState('');

  const handleChange = (index: number, key: 'email' | 'amount', value: string) => {
    const updated = [...splits];
    updated[index][key] = value;
    setSplits(updated);
  };

  const handleAdd = () => {
    setSplits([...splits, { email: '', amount: '' }]);
  };

  const handleRemove = (index: number) => {
    const updated = splits.filter((_, i) => i !== index);
    setSplits(updated);
  };

  const total = splits.reduce((sum, s) => {
    const amount = parseFloat(s.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = splits.every(
      s => s.email.trim() && !isNaN(parseFloat(s.amount)) && parseFloat(s.amount) > 0
    );

    if (!isValid) {
      setError('Todos los campos deben estar completos y los montos deben ser mayores a 0.');
      return;
    }

    if (Math.abs(total - precio) > 0.01) {
      setError(`La suma total debe ser exactamente S/.${precio.toFixed(2)}. Actualmente: S/.${total.toFixed(2)}`);
      return;
    }

    setError('');
    alert('✅ Pago dividido registrado con éxito');
    console.log('Pago dividido registrado:', splits);
  };

  return (
    <section className="mt-12 bg-gray-800 p-6 rounded-lg shadow space-y-6">
      <h2 className="text-xl font-semibold text-white">Dividir pago</h2>
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
          Confirmar pago
        </button>
      </form>
    </section>
  );
}
