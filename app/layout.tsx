// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import AuthSessionProvider from './SessionProvider'; // Importa tu wrapper client

export const metadata: Metadata = {
  title: 'Proppiconnect',
  description: 'Encuentra y publica propiedades fácilmente',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
