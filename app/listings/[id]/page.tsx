import PropertyPageContent from './PageContent';

export default function Page({ params }: { params: { id: string } }) {
  return <PropertyPageContent propiedadID={params.id} />;
}
