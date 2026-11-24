'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { COMMON, NAV, href } from '@/lib/data';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useUI } from './ui';
import { useLang } from './lang';

const SHOW_LANG_IN_HEADER = false;

const MENU_BTN = COMMON.header.tombol_menu;
const MENU_HREF = href(MENU_BTN.link);
const LINKS = NAV.map((n) => ({ ...n, href: href(n.link) })).filter((n) => n.href !== MENU_HREF);

export default function Header() {
  const ref = useRef(null);
  const pathname = usePathname();
  const { t, L, lang, setLang } = useLang();
  const { openDrawer } = useUI();

  useGSAP(() => {
    const header = ref.current;
    let gap = parseFloat(getComputedStyle(header).paddingTop) || 0;
    const quiet = Date.now() + 600;
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
            <img className="brand__mark" src="/img/logo-mark-light.svg" alt="" width="42" height="42" />
            <span className="brand__word" aria-hidden="true">Kopi Padu Rasa</span>
          </Link>
          <nav className="nav" aria-label={L('Navigasi utama', 'Main navigation')}>
            <ul className="nav__list">
              {LINKS.map((n) => (
                <li className="nav__item" key={n.href}>
                  <Link className="nav__link" href={n.href} aria-current={current(n.href)}>{t(n)}</Link>
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
            <Link className="nav-cta" href={MENU_HREF} aria-current={current(MENU_HREF)}>{MENU_BTN.teks}</Link>
            <button type="button" className="burger" aria-haspopup="dialog" aria-label={t(COMMON.header.tombol_menu_hp)} onClick={openDrawer}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
