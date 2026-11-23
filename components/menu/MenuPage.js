'use client';
/* MENU
   - pita kategori menempel di bawah header; kategori yang sedang dibaca ditandai (ScrollTrigger)
     dan pitanya ikut bergeser ke kategori itu (GSAP ScrollTo)
   - klik kategori: halaman bergulir halus ke kategorinya (GSAP ScrollTo) */
import { useRef, useState } from 'react';
import { ADDONS, MENU, NOTE_EN, SLUG } from '@/lib/data';
import { gsap, motionOK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import ProductCard from '../ProductCard';
import { T, useDocTitle, useLang } from '../lang';
import { useReveal } from '../reveal';
import { AppGrid } from '../ui';

const catId = (c) => c.alamat_bagian.split('#')[1] || '';
const CATS = [...MENU.kategori.map((c) => ({ id: catId(c), c })), { id: 'padu-plus', addons: true }];

/* jarak dari atas layar ke kategori setelah digulir: header yang menempel + pita kategori */
function stickyOffset() {
  const nav = document.querySelector('.cat-nav');
  const top = nav ? parseFloat(getComputedStyle(nav).top) || 0 : 0;
  return top + (nav ? nav.offsetHeight : 0) + 12;
}

export default function MenuPage() {
  const ref = useRef(null);
  const navRef = useRef(null);
  const { t, L } = useLang();
  const [active, setActive] = useState(null);
  useReveal(ref);
  useDocTitle('Menu · Kopi Padu Rasa', 'Menu · Kopi Padu Rasa');

  useGSAP((ctx, contextSafe) => {
    const nav = navRef.current;
    const motion = motionOK();
    const mark = contextSafe((id) => {
      setActive(id);
      const a = nav.querySelector(`a[href="#${id}"]`);
      if (a) gsap.to(nav, { scrollTo: { x: Math.max(0, a.offsetLeft - 16) }, duration: motion ? 0.5 : 0, ease: 'power2.out', overwrite: true });
    });
    CATS.forEach(({ id }) => {
      ScrollTrigger.create({
        trigger: '#' + id,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => { if (self.isActive) mark(id); },
      });
    });

    /* dibuka lewat alamat bertanda bagian (mis. /menu/#menu-seliter): tepat di bawah pita kategori */
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) requestAnimationFrame(() => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - stickyOffset()));
    }
  }, { scope: ref });

  const go = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    gsap.to(window, { scrollTo: { y: el, offsetY: stickyOffset(), autoKill: true }, duration: motionOK() ? 0.9 : 0, ease: 'power3.inOut' });
    history.replaceState(null, '', '#' + id);
  };

  return (
    <main id="konten" ref={ref}>
      <section className="page-hero" id="pesan-online" aria-labelledby="menuTitle">
        <div className="container">
          <p className="kicker">Menu</p>
          <h1 className="page-title" id="menuTitle"><T id="Pesan lewat Aplikasi" en="Order Through the Apps" /></h1>
          <p className="page-lead"><T id="Pilih aplikasi favoritmu, atau chat minPadu di WhatsApp." en="Pick your favorite app, or chat with minPadu on WhatsApp." /></p>
          <AppGrid />
        </div>
      </section>

      <nav className="cat-nav" aria-label={L('Kategori menu', 'Menu categories')}>
        <div className="container">
          <ul className="cat-nav__list" ref={navRef}>
            {CATS.map(({ id, c, addons }) => (
              <li key={id}>
                <a href={'#' + id} className={active === id ? 'is-active' : undefined} onClick={(e) => go(e, id)}>
                  {addons ? t(ADDONS.judul) : t(c.judul)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="container menu-body">
        {MENU.kategori.map((c) => {
          const id = catId(c);
          const kind = /hangat/.test(id) ? 'hot' : /seliter/.test(id) ? 'liter' : 'plain';
          return (
            <section className="menu-cat" id={id} key={id} aria-labelledby={id + '-t'}>
              <div className="menu-cat__head">
                <h2 className="h2" id={id + '-t'}>{t(c.judul)}</h2>
                <span className="menu-cat__count">{c.produk.length} {L('pilihan', c.produk.length > 1 ? 'items' : 'item')}</span>
                {c.keterangan && <p className="menu-cat__note">{L(c.keterangan, NOTE_EN[c.keterangan] || c.keterangan)}</p>}
              </div>
              <div className="pgrid">
                {c.produk.map((p) => (
                  <ProductCard key={p.nama} p={p} showFav
                    kind={typeof p.harga === 'object' ? 'size' : SLUG[p.nama] ? kind : 'plain'} />
                ))}
              </div>
            </section>
          );
        })}

        <section className="menu-cat" id="padu-plus" aria-labelledby="padu-plus-t">
          <div className="addons" data-reveal>
            <div>
              <h2 className="addons__title" id="padu-plus-t">{t(ADDONS.judul)}</h2>
              <p className="addons__label">{t(ADDONS.teks)}</p>
            </div>
            <table className="addons__table">
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">{L('Tambahan', 'Add-on')}</span></th>
                  {ADDONS.tabel.kolom.map((k) => <th scope="col" key={k.id}>{t(k)}</th>)}
                </tr>
              </thead>
              <tbody>
                {ADDONS.tabel.baris.map((r) => (
                  <tr key={r.nama}><th scope="row">{r.nama}</th><td>{r.Normal}</td><td>{r.Besar}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
