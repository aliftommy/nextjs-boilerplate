'use client';
import { useRef } from 'react';
import { CARD_APPS, POP, STORE_PART, STORES, onApp, page, part } from '@/lib/data';
import { gsap, motionOK, useGSAP } from '@/lib/gsap';
import { IconBag, IconDine, IconPin } from '../icons';
import { useDocTitle, useLang } from '../lang';
import { useReveal } from '../reveal';

const ZOOM_IN = { duration: 0.5, ease: 'power3.out' };
const ZOOM_OUT = { duration: 0.42, ease: 'power3.inOut' };

function photoFrame(btn, img) {
  const c = btn.getBoundingClientRect();
  const f = img.getBoundingClientRect();
  const pos = parseFloat(btn.dataset.photoPos || '.5');
  if (c.width / c.height >= f.width / f.height) {
    const s = c.width / f.width;
    const cropH = (f.width * c.height) / c.width;
    const top = (f.height - cropH) * pos;
    const bottom = f.height - cropH - top;
    return { x: c.left - f.left, y: c.top - f.top - top * s, scale: s, clipPath: `inset(${top}px 0px ${bottom}px 0px)` };
  }
  const s = c.height / f.height;
  const cropW = (f.height * c.width) / c.height;
  const left = (f.width - cropW) * pos;
  const right = f.width - cropW - left;
  return { x: c.left - f.left - left * s, y: c.top - f.top, scale: s, clipPath: `inset(0px ${right}px 0px ${left}px)` };
}
const FULL = { x: 0, y: 0, scale: 1, clipPath: 'inset(0px 0px 0px 0px)' };

const SHOW_STORE_PHOTOS = true;
const LOGO_FOR_NO_PHOTO = true;
const TAB = page('Lokasi').judul_tab;
const HEAD = part('Lokasi', 'Judul halaman');

function StoreCard({ s, first }) {
  const { t, L } = useLang();
  const tk = STORE_PART.teks_kartu;
  const photo = SHOW_STORE_PHOTOS ? s.foto : null;
  const alt = L('Toko Kopi Padu Rasa ' + s.nama, 'Kopi Padu Rasa ' + s.nama + ' store');
  return (
    <article className={'store' + (photo ? ' store--photo' : '')} data-reveal>
      {photo && (
        <button type="button" className="store__photo" data-photo={`/img/toko/${photo}-full.webp`} data-photo-alt={alt}
          data-photo-pos={s.posisi_foto ?? 0.5} aria-label={L('Lihat foto utuh toko ' + s.nama, 'View full photo of the ' + s.nama + ' store')}>
          <img src={`/img/toko/${photo}-600.webp`}
            srcSet={`/img/toko/${photo}-600.webp 600w, /img/toko/${photo}-900.webp 900w`}
            sizes="(max-width: 640px) calc(100vw - 32px), 300px" width="600" height="600"
            loading={first ? undefined : 'lazy'} fetchPriority={first ? 'high' : undefined} decoding="async" alt={alt} />
        </button>
      )}
      {!photo && SHOW_STORE_PHOTOS && LOGO_FOR_NO_PHOTO && (
        <div className="store__photo store__photo--logo" aria-hidden="true">
          <img src="/img/toko/logo-600.webp" srcSet="/img/toko/logo-600.webp 600w, /img/toko/logo-900.webp 900w"
            sizes="(max-width: 640px) calc(100vw - 32px), 300px" width="600" height="600" loading="lazy" decoding="async" alt="" />
        </div>
      )}
      <div className="store__top">
        <span className="store__no">{s.no}</span>
        <span className="store__open"><i aria-hidden="true" />{t(tk.jam)}</span>
      </div>
      <h3 className="store__name">{s.nama}</h3>
      <p className="store__region">{t(tk.wilayah)}</p>
      <ul className="store__svc" aria-label={t(tk.label_layanan)}>
        {s.dine_in && <li className="svc svc--dine"><IconDine />{t(tk.dine_in)}</li>}
        <li className="svc"><IconBag />{t(tk.takeaway)}</li>
      </ul>
      {CARD_APPS.length > 0 && (
        <div className="store__apps">
          {CARD_APPS.map((a) => (onApp(s, a) ? (
            <a key={a} className="app-pill" data-c={a.toLowerCase()} href={s.link[a]} target="_blank" rel="noopener"
              aria-label={L(`Pesan dari toko ${s.nama} di ${a}`, `Order from ${s.nama} on ${a}`)}>{a}</a>
          ) : (
            <span key={a} className="app-pill is-off">{a} <small>· {t(POP.label_toko_belum_tersedia)}</small></span>
          )))}
        </div>
      )}
      <a className="store__dir" href={s.link.petunjuk_arah} target="_blank" rel="noopener"
        aria-label={L('Petunjuk arah ke Kopi Padu Rasa ' + s.nama, 'Directions to Kopi Padu Rasa ' + s.nama)}>
        <span>{t(tk.tombol)}</span><IconPin />
      </a>
    </article>
  );
}

function usePhotoLightbox(gridRef, dlgRef) {
  useGSAP((ctx, contextSafe) => {
    const grid = gridRef.current;
    const dlg = dlgRef.current;
    const img = dlg.querySelector('img');
    const motion = motionOK();
    let btn = null;
    let busy = false;

    const cleanup = () => {
      gsap.killTweensOf(img);
      gsap.set(img, { clearProps: 'transform,clipPath,opacity,visibility' });
      img.removeAttribute('src');
      dlg.classList.remove('is-shown');
      if (btn) btn.classList.remove('is-zoomed');
      btn = null;
      busy = false;
    };

    const open = contextSafe(async (b) => {
      if (busy) return;
      busy = true;
      btn = b;
      img.alt = b.dataset.photoAlt;
      dlg.setAttribute('aria-label', img.alt);
      gsap.set(img, { visibility: 'hidden' });
      img.src = b.dataset.photo;
      if (!dlg.open) dlg.showModal();
      try { await img.decode(); } catch {}
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!dlg.open) return;
        if (!img.naturalWidth) { dlg.close(); return; }
        const from = photoFrame(b, img);
        b.classList.add('is-zoomed');
        dlg.classList.add('is-shown');
        gsap.set(img, { visibility: 'visible' });
        if (!motion) { busy = false; return; }
        gsap.fromTo(img, from, { ...FULL, ...ZOOM_IN, onComplete: () => { busy = false; } });
      }));
    });

    const close = contextSafe(() => {
      if (!dlg.open || busy) return;
      dlg.classList.remove('is-shown');
      if (!motion || !btn || !btn.isConnected) { dlg.close(); return; }
      busy = true;
      const r = btn.getBoundingClientRect();
      const onScreen = r.bottom > 0 && r.top < window.innerHeight;
      if (onScreen) gsap.to(img, { ...photoFrame(btn, img), ...ZOOM_OUT, onComplete: () => dlg.close() });
      else gsap.to(img, { opacity: 0, duration: 0.25, onComplete: () => dlg.close() });
    });

    const onGridClick = (e) => { const b = e.target.closest('[data-photo]'); if (b) open(b); };
    const preloaded = new Set();
    const preload = (e) => {
      const src = e.target.closest('[data-photo]')?.dataset.photo;
      if (src && !preloaded.has(src)) { preloaded.add(src); new Image().src = src; }
    };
    const onCancel = (e) => { e.preventDefault(); close(); };

    grid.addEventListener('click', onGridClick);
    grid.addEventListener('pointerover', preload);
    grid.addEventListener('focusin', preload);
    dlg.addEventListener('click', close);
    dlg.addEventListener('cancel', onCancel);
    dlg.addEventListener('close', cleanup);
    return () => {
      grid.removeEventListener('click', onGridClick);
      grid.removeEventListener('pointerover', preload);
      grid.removeEventListener('focusin', preload);
      dlg.removeEventListener('click', close);
      dlg.removeEventListener('cancel', onCancel);
      dlg.removeEventListener('close', cleanup);
      if (dlg.open) dlg.close();
    };
  });
}

export default function LokasiPage() {
  const ref = useRef(null);
  const gridRef = useRef(null);
  const dlgRef = useRef(null);
  useReveal(ref);
  usePhotoLightbox(gridRef, dlgRef);
  const { t } = useLang();
  useDocTitle(TAB.id, TAB.en);

  return (
    <main id="konten" ref={ref}>
      <section className="page-hero page-hero--center" aria-labelledby="lokasiTitle">
        <div className="container">
          <p className="kicker">{t(HEAD.label_kecil)}</p>
          <h1 className="page-title" id="lokasiTitle">{t(HEAD.judul)}</h1>
          <p className="page-lead">{t(HEAD.teks)}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="storesTitle">
        <div className="container">
          <h2 className="h3 stores__title" id="storesTitle">{t(STORE_PART.judul)}</h2>
          <div className="store-grid" ref={gridRef}>
            {STORES.map((s, i) => <StoreCard key={s.no} s={s} first={i === 0} />)}
          </div>
        </div>
      </section>

      <dialog className="lightbox" id="photoDialog" ref={dlgRef}>
        <img className="lightbox__img" alt="" decoding="async" />
      </dialog>
    </main>
  );
}
