// app/checkout/page.tsx
import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen text-white flex justify-center items-center">Cargando...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
