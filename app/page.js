import HomePage from '@/components/home/HomePage';
import { pageMeta } from '@/lib/meta';

export const metadata = pageMeta(
  'Kopi Padu Rasa · Kopi to Go di 30 Toko',
  'Kopi Padu Rasa: kopi to go yang buka 24 jam di 30 toko se-Sulawesi Selatan. Pesan lewat GoFood, GrabFood, ShopeeFood, atau WhatsApp 0821-8717-165.',
);

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kopi Padu Rasa',
  legalName: 'PT. Sinergi Rasa Nusantara',
  address: { '@type': 'PostalAddress', streetAddress: 'Jl Urip Sumoharjo', addressLocality: 'Makassar', addressRegion: 'Sulawesi Selatan', addressCountry: 'ID' },
  contactPoint: [{ '@type': 'ContactPoint', telephone: '+62-821-8717-165', contactType: 'customer service', availableLanguage: ['Indonesian', 'English'] }],
  sameAs: ['https://www.instagram.com/kopipadurasa/', 'https://www.tiktok.com/@kopipadurasa', 'https://www.threads.com/@kopipadurasa', 'https://www.facebook.com/profile.php?id=61581414843097'],
};

/* Foto hero tidak di-preload lewat react-dom: petunjuk preload ikut terbawa ke data prefetch Beranda,
   sehingga halaman lain ikut mengunduhnya. <img> hero sudah ada di HTML dengan fetchPriority="high",
   jadi browser tetap mengunduhnya paling awal. */
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG) }} />
      <HomePage />
    </>
  );
}
