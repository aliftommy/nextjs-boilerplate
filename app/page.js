import HomePage from '@/components/home/HomePage';
import { SITE } from '@/lib/data';
import { metaOf } from '@/lib/meta';

export const metadata = metaOf('Beranda');

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.nama_brand,
  legalName: SITE.perusahaan,
  address: { '@type': 'PostalAddress', streetAddress: SITE.kantor_pusat.jalan, addressLocality: 'Makassar', addressRegion: 'Sulawesi Selatan', addressCountry: 'ID' },
  contactPoint: [{ '@type': 'ContactPoint', telephone: '+62-821-8717-165', contactType: 'customer service', availableLanguage: ['Indonesian', 'English'] }],
  sameAs: Object.values(SITE.sosial_media).map((s) => s.link).filter((l) => !l.includes('wa.me')),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG) }} />
      <HomePage />
    </>
  );
}
