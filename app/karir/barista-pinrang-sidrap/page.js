import { notFound } from 'next/navigation';
import LowonganPage from '@/components/karir/LowonganPage';
import { JOB, JOB_OPEN } from '@/lib/data';
import { pageMeta } from '@/lib/meta';

export const metadata = pageMeta(JOB.judul_tab.id, JOB.deskripsi_google);

export default function Page() {
  if (!JOB_OPEN) notFound();
  return <LowonganPage />;
}
