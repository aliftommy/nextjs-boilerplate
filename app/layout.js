import localFont from 'next/font/local';
import { Poppins } from 'next/font/google';
import AppEffects from '@/components/AppEffects';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { LangProvider, T } from '@/components/lang';
import { UIProvider } from '@/components/ui';
import { SITE_URL, pageMeta } from '@/lib/meta';
import './globals.css';

/* font brand: Alte Haas Grotesk (folder fonts/) */
const alte = localFont({
  src: [
    { path: '../fonts/AlteHaasGroteskRegular.ttf', weight: '100 500', style: 'normal' },
    { path: '../fonts/AlteHaasGroteskBold.ttf', weight: '600 900', style: 'normal' },
  ],
  variable: '--font-alte',
  display: 'swap',
});
/* teks hero beranda */
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-poppins', display: 'swap' });

export const metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  ...pageMeta(
    'Kopi Padu Rasa · Kopi to Go di 30 Toko',
    'Kopi Padu Rasa: kopi to go yang buka 24 jam di 30 toko se-Sulawesi Selatan. Pesan lewat GoFood, GrabFood, ShopeeFood, atau WhatsApp 0821-8717-165.',
  ),
  icons: {
    icon: [{ url: '/img/logo-mark.svg', type: 'image/svg+xml' }, { url: '/img/favicon-64.png', type: 'image/png', sizes: '64x64' }],
    apple: '/img/apple-touch-icon.png',
  },
};

export const viewport = { themeColor: '#fbf5e6' };

/* Dijalankan sebelum halaman tampil:
   - js / motion-ok: penanda untuk CSS (motion-ok tidak dipasang bila pengunjung mematikan animasi)
   - data-lang="en": pengunjung memilih English (?lang=en atau pilihan tersimpan), teks diganti sebelum tampil
   - intro: kunjungan pertama ke Beranda dalam sesi ini, stiker hero "ditempel" satu per satu
   - intro-veil: sama, tapi khusus saat Beranda dibuka langsung: tirai pembuka (logo tergores) menutup
     halaman sampai font & foto hero siap, lalu memudar (components/home/Hero.js)
   - --vw: lebar layar, dipakai CSS untuk memperkecil rak stiker hero di HP/tablet
   - cadangan: bila JavaScript situs belum jalan dalam 5 detik, motion-ok dicabut supaya konten tetap tampil */
const HEAD_SCRIPT = `(function(d){var c=d.classList,rm=false,l=null;c.add('js');
try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
if(!rm)c.add('motion-ok');
try{l=new URLSearchParams(location.search).get('lang')||localStorage.getItem('kpr-lang')}catch(e){}
if(l==='en'){d.setAttribute('data-lang','en');d.lang='en'}
if(!rm&&location.pathname.replace(/index\\.html$/,'')==='/'){var s=null;try{s=sessionStorage.getItem('kpr-intro');sessionStorage.setItem('kpr-intro','1')}catch(e){}if(!s)c.add('intro','intro-veil')}
var vw=function(){d.style.setProperty('--vw',String(d.clientWidth||innerWidth))};vw();addEventListener('resize',vw);
setTimeout(function(){if(!c.contains('app-ready'))c.remove('motion-ok')},5000);
})(document.documentElement)`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${alte.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body>
        <LangProvider>
          <UIProvider>
            <a className="skip-link" href="#konten"><T id="Lewati ke konten" en="Skip to content" /></a>
            <Header />
            {children}
            <Footer />
            <AppEffects />
          </UIProvider>
        </LangProvider>
      </body>
    </html>
  );
}
