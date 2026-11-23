import LokasiPage from '@/components/lokasi/LokasiPage';
import { pageMeta } from '@/lib/meta';

export const metadata = pageMeta(
  'Lokasi 30 Toko · Kopi Padu Rasa',
  'Daftar 30 toko Kopi Padu Rasa di Sulawesi Selatan, semuanya buka 24 jam. Lengkap dengan petunjuk arah dan link GoFood, GrabFood, dan ShopeeFood per toko.',
);

export default function Page() {
  return <LokasiPage />;
}
