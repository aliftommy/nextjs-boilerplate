import KarirPage from '@/components/karir/KarirPage';
import { pageMeta } from '@/lib/meta';

export const metadata = pageMeta(
  'Karir · Kopi Padu Rasa',
  'Karir di Kopi Padu Rasa: kesempatan bertumbuh bagi siapa pun yang mau belajar dan berkembang, termasuk yang baru memulai perjalanan karier.',
);

export default function Page() {
  return <KarirPage />;
}
