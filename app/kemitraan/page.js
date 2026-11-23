import KemitraanPage from '@/components/kemitraan/KemitraanPage';
import { pageMeta } from '@/lib/meta';

export const metadata = pageMeta(
  'Kemitraan · Kopi Padu Rasa',
  'Alur kemitraan dan keuntungan investasi Kopi Padu Rasa. Info kemitraan: WhatsApp 0851 7704 9460.',
);

export default function Page() {
  return <KemitraanPage />;
}
