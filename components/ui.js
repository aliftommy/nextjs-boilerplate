'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { APPS, COMMON, NAV, ORDER_APPS, POP, STORES, countOn, href, onApp } from '@/lib/data';
import { gsap, motionOK } from '@/lib/gsap';
import { IconBag, IconClose, IconGlobe, IconWa } from './icons';
import { T, useLang } from './lang';

const UICtx = createContext(null);
export const useUI = () => useContext(UICtx);

function storage(k, v) {
  try {
    if (v === undefined) return localStorage.getItem(k);
    localStorage.setItem(k, v);
  } catch {}
  return null;
}
const nextFrame = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

export function UIProvider({ children }) {
  const [drawer, setDrawer] = useState({ open: false, instant: false });
  const [order, setOrder] = useState(false);
  const [storeApp, setStoreApp] = useState(null);

  const openDrawer = useCallback(() => setDrawer({ open: true, instant: false }), []);
  const closeDrawer = useCallback((instant = false) => setDrawer({ open: false, instant }), []);
  const openOrder = useCallback(() => { setDrawer({ open: false, instant: true }); setOrder(true); }, []);
  const openStores = useCallback((app) => {
    setDrawer({ open: false, instant: true });
    setOrder(false);
    setStoreApp(app);
  }, []);

  useEffect(() => {
    const want = new URLSearchParams(location.search).get('pesan');
    if (ORDER_APPS.includes(want)) openStores(want);
  }, [openStores]);

  const value = useMemo(
    () => ({ drawerOpen: drawer.open, openDrawer, closeDrawer, openOrder, openStores }),
    [drawer.open, openDrawer, closeDrawer, openOrder, openStores],
  );

  return (
    <UICtx.Provider value={value}>
      {children}
      <Drawer state={drawer} onClose={closeDrawer} />
      <OrderDialog open={order} onClose={() => setOrder(false)} />
      <StoreDialog app={storeApp} onClose={() => setStoreApp(null)} />
    </UICtx.Provider>
  );
}

function Modal({ open, onClose, className = '', labelledBy, onOpen, children }) {
  const ref = useRef(null);
  const onCloseRef = useRef(onClose);
  const openRef = useRef(open);
  onCloseRef.current = onClose;
  openRef.current = open;

  useEffect(() => {
    const dlg = ref.current;
    const onCancel = (e) => { e.preventDefault(); onCloseRef.current(); };
    const onClick = (e) => { if (e.target === dlg) onCloseRef.current(); };
    const onNativeClose = () => { if (openRef.current) onCloseRef.current(); };
    dlg.addEventListener('cancel', onCancel);
    dlg.addEventListener('click', onClick);
    dlg.addEventListener('close', onNativeClose);
    return () => {
      dlg.removeEventListener('cancel', onCancel);
      dlg.removeEventListener('click', onClick);
      dlg.removeEventListener('close', onNativeClose);
    };
  }, []);

  useEffect(() => {
    const dlg = ref.current;
    const card = dlg.querySelector('.modal__card');
    gsap.killTweensOf(card);
    if (open) {
      if (!dlg.open) dlg.showModal();
      onOpen?.(dlg);
      nextFrame(() => dlg.classList.add('is-shown'));
      if (motionOK()) {
        gsap.fromTo(card, { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' });
      }
    } else if (dlg.open) {
      dlg.classList.remove('is-shown');
      if (!motionOK()) { dlg.close(); return; }
      gsap.to(card, {
        opacity: 0, y: 18, scale: 0.98, duration: 0.24, ease: 'power2.in',
        onComplete: () => { dlg.close(); gsap.set(card, { clearProps: 'opacity,transform' }); },
      });
    }
  }, [open]);

  return (
    <dialog ref={ref} className={'modal ' + className} aria-labelledby={labelledBy}>
      <div className="modal__card">{children}</div>
    </dialog>
  );
}

export function AppGrid() {
  const { t, L } = useLang();
  const { openStores } = useUI();
  return (
    <div className="app-grid">
      {APPS.map((a) => {
        const isWa = a.aplikasi === 'WhatsApp';
        const inner = (
          <>
            <span className="app-btn__icon">{isWa ? <IconWa /> : <IconBag />}</span>
            <span className="app-btn__name">
              {a.aplikasi}
              {!isWa && <span className="app-btn__meta">{countOn(a.aplikasi)} {L('toko', 'stores')}</span>}
            </span>
            <span className="app-btn__sub">{t(a.cara)}{isWa ? '' : ' →'}</span>
          </>
        );
        return isWa ? (
          <a key={a.aplikasi} className="app-btn" data-c="wa" href={a.link} target="_blank" rel="noopener">{inner}</a>
        ) : (
          <button key={a.aplikasi} type="button" className="app-btn" data-c={a.aplikasi.toLowerCase()} onClick={() => openStores(a.aplikasi)}>
            {inner}
          </button>
        );
      })}
    </div>
  );
}

function CloseBtn() {
  const { L } = useLang();
  return (
    <button type="button" className="icon-btn modal__close" data-close aria-label={L('Tutup', 'Close')}
      onClick={(e) => e.currentTarget.closest('dialog').dispatchEvent(new Event('cancel', { cancelable: true }))}>
      <IconClose />
    </button>
  );
}

function OrderDialog({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="orderTitle">
      <CloseBtn />
      <p className="kicker"><T id="Pesan online" en="Order online" /></p>
      <h2 className="modal__title" id="orderTitle"><T id="Mau pesan lewat mana?" en="How would you like to order?" /></h2>
      <AppGrid />
    </Modal>
  );
}

function StoreDialog({ app, onClose }) {
  const { t, L } = useLang();
  const [shownApp, setShownApp] = useState(null);
  const [last, setLast] = useState(null);
  const listRef = useRef(null);
  if (app && app !== shownApp) setShownApp(app);

  const list = useMemo(() => {
    if (!shownApp) return [];
    const l = STORES.slice();
    const i = l.findIndex((s) => s.nama === last && onApp(s, shownApp));
    if (i > 0) l.unshift(l.splice(i, 1)[0]);
    return l;
  }, [shownApp, last]);

  const n = shownApp ? countOn(shownApp) : 0;
  return (
    <Modal open={!!app} onClose={onClose} className="modal--tall" labelledBy="storeTitle"
      onOpen={() => { setLast(storage('kpr-last-store')); if (listRef.current) listRef.current.scrollTop = 0; }}>
      <CloseBtn />
      <p className="kicker">{shownApp}</p>
      <h2 className="modal__title" id="storeTitle">{t(POP.judul)}</h2>
      <p className="modal__info">
        {L(`${n} dari ${STORES.length} toko sudah ada di ${shownApp}.`, `${n} of ${STORES.length} stores are on ${shownApp}.`)}
      </p>
      <ul className="store-pick" ref={listRef}>
        {list.map((s) => {
          const ok = onApp(s, shownApp);
          const isLast = ok && s.nama === last;
          return (
            <li key={s.no} className={'store-pick__item' + (ok ? '' : ' is-off')}>
              <span className="store-pick__no">{s.no}</span>
              <span className="store-pick__name">
                {s.nama}
                {isLast && <span className="store-pick__tag">{L('Terakhir', 'Last used')}</span>}
              </span>
              {ok ? (
                <a className="store-pick__go" href={s.link[shownApp]} target="_blank" rel="noopener" onClick={() => storage('kpr-last-store', s.nama)}>
                  {t(POP.label_toko_tersedia)}
                  <span className="sr-only"> {s.nama} {L('di', 'on')} {shownApp}</span>
                </a>
              ) : (
                <span className="store-pick__soon">{t(POP.label_toko_belum_tersedia)}</span>
              )}
            </li>
          );
        })}
      </ul>
      <button type="button" className="btn btn--ghost btn--block" onClick={onClose}>{t(POP.tombol_tutup)}</button>
    </Modal>
  );
}

function Drawer({ state, onClose }) {
  const ref = useRef(null);
  const pathname = usePathname();
  const { t, L, lang, setLang } = useLang();
  const { openOrder } = useUI();
  const m = COMMON.menu_burger_hp_tablet;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dlg = ref.current;
    const onCancel = (e) => { e.preventDefault(); onCloseRef.current(); };
    const onNativeClose = () => { document.documentElement.classList.remove('drawer-open'); onCloseRef.current(true); };
    dlg.addEventListener('cancel', onCancel);
    dlg.addEventListener('close', onNativeClose);
    const desk = window.matchMedia('(min-width: 1024px)');
    const onDesk = () => { if (desk.matches) onCloseRef.current(true); };
    desk.addEventListener('change', onDesk);
    return () => {
      dlg.removeEventListener('cancel', onCancel);
      dlg.removeEventListener('close', onNativeClose);
      desk.removeEventListener('change', onDesk);
    };
  }, []);

  useEffect(() => { onCloseRef.current(true); }, [pathname]);

  useEffect(() => {
    const dlg = ref.current;
    const root = document.documentElement;
    const items = dlg.querySelectorAll('.drawer__nav > li, .drawer__extra');
    gsap.killTweensOf([dlg, ...items]);
    if (state.open) {
      if (!dlg.open) dlg.showModal();
      root.classList.add('drawer-open');
      if (!motionOK()) { gsap.set(dlg, { opacity: 1 }); return; }
      gsap.timeline()
        .fromTo(dlg, { opacity: 0 }, { opacity: 1, duration: 0.38, ease: 'power2.out' })
        .fromTo(items, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.42, ease: 'power3.out', stagger: 0.05 }, 0.06);
    } else if (dlg.open) {
      root.classList.remove('drawer-open');
      if (state.instant || !motionOK()) { dlg.close(); return; }
      gsap.to(dlg, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => dlg.close() });
    }
  }, [state]);

  return (
    <dialog ref={ref} className="drawer" id="drawer" aria-label="Menu">
      <div className="container drawer__bar">
        <Link className="brand brand--wide" href={href(m.logo_link)}>
          <img className="brand__mark" src="/img/logo-mark-light.svg" alt="" width="42" height="42" />
          <span className="brand__word">Kopi Padu Rasa</span>
        </Link>
        <button type="button" className="burger" autoFocus aria-label={t(m.tombol_tutup)} onClick={() => onClose()}>
          <span /><span /><span />
        </button>
      </div>
      <div className="drawer__body">
        <nav aria-label={L('Navigasi utama', 'Main navigation')}>
          <ul className="drawer__nav">
            {NAV.map((n) => {
              const to = href(n.link);
              return (
                <li key={n.link}>
                  <Link className="drawer__link" href={to} aria-current={to === pathname ? 'page' : undefined}>{t(n)}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="container drawer__extra">
          <button type="button" className="btn btn--primary btn--lg btn--block" onClick={openOrder}><IconBag />{t(m.tombol_utama)}</button>
          <a className="drawer__ig" href={m.tautan_kecil.link} target="_blank" rel="noopener">{t(m.tautan_kecil)}</a>
          <div className="drawer__bottom">
            <LangSwitch lang={lang} setLang={setLang} label={L('Bahasa', 'Language')} />
            <Link className="region" href={href(m.wilayah.link)}><IconGlobe />{m.wilayah.teks}</Link>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export function LangSwitch({ lang, setLang, label }) {
  return (
    <div className="lang-text" role="group" aria-label={label}>
      <button type="button" aria-pressed={lang === 'id'} onClick={() => setLang('id')}>Bahasa Indonesia</button>
      <span aria-hidden="true">·</span>
      <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
    </div>
  );
}
