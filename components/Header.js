'use client';
/* HEADER: bar melayang yang menempel saat di-scroll (desktop), header penuh + burger (HP/tablet).
   ScrollTrigger memberi kelas .is-stuck begitu halaman ter-scroll melewati jarak bar dari atas;
   perubahan bentuk bar sendiri diatur transisi CSS (.site-header.is-stuck ...). */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useUI } from './ui';
import { T, useLang } from './lang';

/* pilihan bahasa ID/EN di header dinonaktifkan; ganti ke true untuk menampilkannya lagi */
const SHOW_LANG_IN_HEADER = false;

const NAV = [
  { href: '/', id: 'Beranda', en: 'Home' },
  { href: '/kemitraan/', id: 'Kemitraan', en: 'Partnership' },
  { href: '/lokasi/', id: 'Lokasi', en: 'Locations' },
  { href: '/karir/', id: 'Karir', en: 'Careers' },
];

export default function Header() {
  const ref = useRef(null);
  const pathname = usePathname();
  const { L, lang, setLang } = useLang();
  const { openDrawer } = useUI();

  useGSAP(() => {
    const header = ref.current;
    let gap = parseFloat(getComputedStyle(header).paddingTop) || 0;
    const quiet = Date.now() + 600; // posisi scroll dipulihkan saat halaman dibuka: langsung menempel, tanpa animasi
    const settle = () => {
      header.classList.add('is-settling');
      requestAnimationFrame(() => requestAnimationFrame(() => header.classList.remove('is-settling')));
    };
    settle();
    ScrollTrigger.create({
      start: () => Math.max(gap - 1, 2),
      end: 'max',
      onToggle: (self) => {
        if (Date.now() < quiet) settle();
        header.classList.toggle('is-stuck', self.isActive);
      },
      onRefreshInit: () => { gap = parseFloat(getComputedStyle(header).paddingTop) || 0; },
    });
  }, { scope: ref });

  const current = (h) => (h === pathname ? 'page' : undefined);

  return (
    <header className="site-header" ref={ref}>
      <div className="container nav-shell">
        <div className="nav-surface" aria-hidden="true" />
        <div className="navbar">
          <Link className="brand brand--wide" href="/" aria-label={L('Kopi Padu Rasa, ke beranda', 'Kopi Padu Rasa, go to home')}>
            <img className="brand__mark" src="/img/logo-mark.svg" alt="" width="42" height="42" />
            <span className="brand__word" aria-hidden="true">Kopi Padu Rasa</span>
          </Link>
          <nav className="nav" aria-label={L('Navigasi utama', 'Main navigation')}>
            <ul className="nav__list">
              {NAV.map((n) => (
                <li className="nav__item" key={n.href}>
                  <Link className="nav__link" href={n.href} aria-current={current(n.href)}><T id={n.id} en={n.en} /></Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header__actions">
            {SHOW_LANG_IN_HEADER && (
              <div className="lang" role="group" aria-label={L('Pilih bahasa', 'Choose language')}>
                <button type="button" className="lang__btn" aria-pressed={lang === 'id'} title="Bahasa Indonesia" onClick={() => setLang('id')}>ID</button>
                <button type="button" className="lang__btn" aria-pressed={lang === 'en'} title="English" onClick={() => setLang('en')}>EN</button>
              </div>
            )}
            <Link className="nav-cta" href="/menu/" aria-current={current('/menu/')}>Menu</Link>
            <button type="button" className="burger" aria-haspopup="dialog" aria-label={L('Buka menu', 'Open menu')} onClick={openDrawer}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
