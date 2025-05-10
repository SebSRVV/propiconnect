import dynamic from 'next/dynamic';

const ListingsClient = dynamic(() => import('./ListingsClient'), { ssr: false });

export default function ListingsPage() {
  return <ListingsClient />;
}
