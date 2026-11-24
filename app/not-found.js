import Link from 'next/link';
import { T } from '@/components/lang';

export const metadata = { title: 'Halaman tidak ditemukan · Kopi Padu Rasa' };

export default function NotFound() {
  return (
    <main id="konten">
      <section className="page-hero page-hero--center notfound" aria-labelledby="nfTitle">
        <div className="container">
          <p className="kicker">404</p>
          <h1 className="page-title" id="nfTitle"><T id="Halaman tidak ditemukan" en="Page not found" /></h1>
          <p className="page-lead">
            <T id="Alamat yang kamu buka tidak ada atau sudah dipindah. Yuk kembali ke beranda, atau langsung cek menu dan lokasi toko."
              en="The page you opened doesn't exist or has moved. Head back home, or check the menu and store locations." />
          </p>
          <div className="notfound__cta">
            <Link className="btn btn--primary" href="/"><span><T id="Ke beranda" en="Go home" /></span><span className="arr" aria-hidden="true">→</span></Link>
            <Link className="btn btn--ghost" href="/menu/"><T id="Lihat menu" en="See the menu" /></Link>
            <Link className="btn btn--ghost" href="/lokasi/"><T id="Lihat lokasi" en="See locations" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
