import PropertyPageContent from './PageContent';

export default async function Page({ params }: { params: { id: string } }) {
  return <PropertyPageContent propiedadID={params.id} />;
}
