'use client';
import Link from 'next/link';
import { COMMON, WA_ORDER } from '@/lib/data';
import { IconGlobe, IconWa } from './icons';
import { T, useLang } from './lang';
import { LangSwitch, useUI } from './ui';

const F = COMMON.footer;

const SOCIAL_ICON = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.6 3h3c.3 2.1 1.6 3.6 3.6 3.9V10c-1.3 0-2.5-.4-3.6-1v6.2a5.7 5.7 0 1 1-5.7-5.7h.5v3.2h-.5a2.5 2.5 0 1 0 2.7 2.5z" /></svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.6 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.6-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.6V21z" /></svg>
  ),
  Threads: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M18.4 8.6C17.4 5.5 15.1 4 12 4 7.6 4 5 7.2 5 12s2.6 8 7 8c3.1 0 5.4-1.7 6.1-4.4.6-2.5-.9-4.4-3.5-4.9-2.8-.5-5.3.6-5.3 2.5 0 1.6 1.6 2.5 3.3 2.3 2-.2 3.1-1.8 3.1-4.5" />
    </svg>
  ),
  WhatsApp: <IconWa />,
};
const SOCIAL_LABEL = {
  Instagram: 'Instagram @kopipadurasa', TikTok: 'TikTok @kopipadurasa', Facebook: 'Facebook',
  Threads: 'Threads @kopipadurasa', WhatsApp: 'WhatsApp 0821-8717-165',
};

const EXPLORE = [
  { href: '/', id: 'Beranda', en: 'Home' },
  { href: '/menu/', id: 'Menu', en: 'Menu' },
  { href: '/kemitraan/', id: 'Kemitraan', en: 'Partnership' },
  { href: '/lokasi/', id: 'Lokasi', en: 'Locations' },
  { href: '/karir/', id: 'Karir', en: 'Careers' },
];

export default function Footer() {
  const { t, L, lang, setLang } = useLang();
  const { openStores } = useUI();
  return (
    <footer className="site-footer">
      <svg className="footer__dome" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40C380 2 1060 2 1440 40z" /></svg>
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link className="brand brand--light brand--wide" href="/" aria-label={L('Kopi Padu Rasa, ke beranda', 'Kopi Padu Rasa, go to home')}>
            <img className="brand__mark" src="/img/logo-mark-light.svg" alt="" width="42" height="42" />
            <span className="brand__word" aria-hidden="true">Kopi Padu Rasa</span>
          </Link>
          <p><T id="Kopi to go, buka 24 jam di 30 toko se-Sulawesi Selatan." en="Coffee to go, open 24 hours at 30 stores across South Sulawesi." /></p>
        </div>
        <div className="footer__col footer__col--wide">
          <h2 className="footer__title">{t(F.pesan_online.judul)}</h2>
          <div className="footer__apps">
            {['GoFood', 'GrabFood', 'ShopeeFood'].map((a) => (
              <button key={a} type="button" className="chip-app" data-app={a} onClick={() => openStores(a)}>{a}</button>
            ))}
            <a className="chip-app chip-app--wa" href={WA_ORDER} target="_blank" rel="noopener">WhatsApp</a>
          </div>
        </div>
        <nav className="footer__col" aria-label={L('Jelajahi', 'Explore')}>
          <h2 className="footer__title">{t(F.jelajahi.judul)}</h2>
          <ul>
            {EXPLORE.map((n) => (
              <li key={n.href}><Link href={n.href}><T id={n.id} en={n.en} /></Link></li>
            ))}
          </ul>
        </nav>
        <div className="footer__col">
          <h2 className="footer__title">{t(F.kantor_pusat.judul)}</h2>
          <address>
            PT. Sinergi Rasa Nusantara<br />Jl Urip Sumoharjo<br />
            <T id="Makassar, Sulawesi Selatan" en="Makassar, South Sulawesi" /><br />Indonesia
          </address>
        </div>
        <div className="footer__col">
          <h2 className="footer__title">{t(F.ikuti_kami.judul)}</h2>
          <ul className="social">
            {F.ikuti_kami.ikon.map((s) => (
              <li key={s.nama}>
                <a href={s.link} target="_blank" rel="noopener" aria-label={SOCIAL_LABEL[s.nama] || s.nama}>{SOCIAL_ICON[s.nama]}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>{F.hak_cipta}</p>
        <LangSwitch lang={lang} setLang={setLang} label={L('Pilih bahasa', 'Choose language')} />
        <Link className="region" href="/lokasi/"><IconGlobe />{F.wilayah.teks}</Link>
      </div>
    </footer>
  );
}
