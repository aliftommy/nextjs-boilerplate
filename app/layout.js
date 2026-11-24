import localFont from 'next/font/local';
import { Open_Sans, Poppins } from 'next/font/google';
import AppEffects from '@/components/AppEffects';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { LangProvider, T } from '@/components/lang';
import { UIProvider } from '@/components/ui';
import { SITE_URL, metaOf } from '@/lib/meta';
import './globals.css';

const alte = localFont({
  src: [
    { path: '../fonts/AlteHaasGroteskRegular.woff2', weight: '100 500', style: 'normal' },
    { path: '../fonts/AlteHaasGroteskBold.woff2', weight: '600 900', style: 'normal' },
  ],
  variable: '--font-alte',
  display: 'swap',
});
const poppins = Poppins({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-poppins', display: 'swap' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans', display: 'swap' });

export const metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  ...metaOf('Beranda'),
  icons: {
    icon: [{ url: '/img/favicon.svg', type: 'image/svg+xml' }, { url: '/img/favicon-64.png', type: 'image/png', sizes: '64x64' }],
    apple: '/img/apple-touch-icon.png',
  },
};

export const viewport = { themeColor: '#564732' };

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
    <html lang="id" className={`${alte.variable} ${poppins.variable} ${openSans.variable}`} suppressHydrationWarning>
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
