import { notFound } from 'next/navigation';
import PageContent from './PageContent';

export default function Page({ params }: { params: { id: string } }) {
  return <PageContent propiedadID={params.id} />;
}
