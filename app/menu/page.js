import MenuPage from '@/components/menu/MenuPage';
import { pageMeta } from '@/lib/meta';

export const metadata = pageMeta(
  'Menu · Kopi Padu Rasa',
  'Menu Kopi Padu Rasa: Kopi Padu Krimi, Kopi Padu Aren, Padu Matcha, Padu Coklat, Padu Hangat, dan Seliter Padu. Harga mulai Rp 13.000.',
);

export default function Page() {
  return <MenuPage />;
}
