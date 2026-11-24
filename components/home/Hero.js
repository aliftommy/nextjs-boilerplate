'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { STORE_COUNT } from '@/lib/data';
import { gsap, motionOK, useGSAP } from '@/lib/gsap';
import { T, useLang } from '../lang';

const ARROW = 'M8 3C4 14 10 24 21 30m0 0-9-1m9 1-2-9';

function Note({ i, nx, nr, flip, id, en }) {
  return (
    <span className={'note' + (flip ? ' note--flip' : '')} style={{ '--i': i, '--nx': nx, '--nr': nr }} aria-hidden="true">
      <span className="note__txt"><span className="note__ink"><T id={id} en={en} /></span></span>
      <svg className="note__arrow" viewBox="0 0 30 34">
        <path className="halo" pathLength="1" d={ARROW} />
        <path className="ink" pathLength="1" d={ARROW} />
      </svg>
    </span>
  );
}

const STICKERS = [
  { n: 1, href: '/menu/#menu-hangat', img: 'kpk-hangat', rot: '-8deg', y: '8px', ft: 5.2, fd: 1.1,
    label: ['Padu Hangat: Kopi Padu Krimi panas, lihat menu', 'Padu Hangat: hot Kopi Padu Krimi, see the menu'],
    steam: true, note: { i: 0, nx: '-22%', nr: '-5deg', flip: true, id: 'ada yang hangat!', en: 'hot ones too!' } },
  { n: 2, href: '/menu/#menu-kopi', img: 'kpk', rot: '5deg', y: '-14px', ft: 6.1, fd: 2.3,
    label: ['Kopi Padu Krimi, menu favorit', 'Kopi Padu Krimi, a customer favorite'],
    badge: { side: 'l', id: '★ Favorit', en: '★ Favorite' } },
  { n: 3, href: '/menu/#menu-kopi', img: 'kpa', rot: '-3deg', y: '-22px', ft: 5.6, fd: 0.4, big: true,
    label: ['Kopi Padu Aren, mulai Rp 13.000', 'Kopi Padu Aren, from Rp 13.000'],
    note: { i: 1, nx: '-50%', nr: '3deg', id: 'mulai 13K!', en: 'from 13K!' } },
  { n: 4, href: '/menu/#menu-nonkopi', img: 'matcha', rot: '6deg', y: '-8px', ft: 4.9, fd: 3.2,
    label: ['Padu Matcha, menu non-kopi', 'Padu Matcha, non-coffee menu'],
    badge: { side: 'r', leaf: true, id: 'Non-kopi', en: 'Non-coffee' } },
  { n: 5, href: '/menu/#menu-seliter', img: 'kpa-1l', rot: '-6deg', y: '12px', ft: 5.9, fd: 1.7,
    label: ['Seliter Padu: Kopi Padu Aren 1 liter, Rp 60.000', 'Seliter Padu: 1-liter Kopi Padu Aren, Rp 60.000'],
    note: { i: 2, nx: '-78%', nr: '4deg', id: 'seliter 60K', en: 'a whole liter, 60K' } },
];
const CLOUD_SECONDS = [70, 95, 120];

export const LOGO_VIEWBOX = '-200.5 -195.5 990 990';
const MARK_PATHS = [
  'M60 160C150 92 300 58 400 104c52 28 44 96-18 110-70 18-150-2-156-44-6-40 40-58 80-52 40 7 46 42 16 52-22 7-44-2-42-15',
  'M185 235c77 57 235 61 305-5 50-50 40-138-35-180',
  'M112 212c0 88 8 188 28 268 20 92 342 96 365 0 15-70 20-130 25-180',
  'M445 425c-5 35-20 55-40 67',
];
const VEIL_MAX_MS = 2200;
let stopTimer = 0;

export function HeroVeil() {
  return (
    <div className="veil" aria-hidden="true">
      <svg className="veil__mark" viewBox={LOGO_VIEWBOX}>
        {MARK_PATHS.map((d) => <path key={d} pathLength="1" d={d} />)}
      </svg>
    </div>
  );
}

function whenReady(img, veil) {
  const settle = (p) => Promise.resolve(p).catch(() => {});
  const jobs = [settle(document.fonts?.ready), settle(img?.decode?.())];
  try { veil.getAnimations({ subtree: true }).forEach((a) => jobs.push(settle(a.finished))); } catch {}
  const cap = new Promise((r) => setTimeout(r, Math.max(250, VEIL_MAX_MS - performance.now())));
  return Promise.race([Promise.all(jobs), cap]);
}

export default function Hero() {
  const ref = useRef(null);
  const { L } = useLang();

  useGSAP((ctx, contextSafe) => {
    const hero = ref.current;
    const root = document.documentElement;
    const q = gsap.utils.selector(hero);
    clearTimeout(stopTimer);
    const veil = document.querySelector('.veil');
    const endVeil = () => {
      root.classList.remove('intro-veil');
      if (veil) gsap.set([veil, veil.firstChild], { clearProps: 'all' });
    };
    if (!motionOK()) { root.classList.remove('intro'); endVeil(); return; }
    let alive = true;

    let intro = root.classList.contains('intro');
    if (!intro) {
      try {
        if (!sessionStorage.getItem('kpr-intro')) { intro = true; sessionStorage.setItem('kpr-intro', '1'); root.classList.add('intro'); }
      } catch {}
    }
    const withVeil = intro && !!veil && root.classList.contains('intro-veil');
    if (!withVeil) endVeil();

    const fx = q('.hero__fx')[0];

    const burst = contextSafe((card) => {
      const r = card.getBoundingClientRect();
      const h = hero.getBoundingClientRect();
      const cx = r.left - h.left + r.width / 2;
      const cy = r.bottom - h.top - 8;
      const k = Math.min(1, r.width / 200);
      for (let i = 0; i < 12; i++) {
        const p = document.createElement('span');
        const ang = Math.PI + Math.random() * Math.PI;
        const dist = (30 + Math.random() * 70) * k;
        const size = (4 + Math.random() * 6) * Math.max(k, 0.5);
        p.className = 'puff';
        Object.assign(p.style, { left: cx + (Math.random() - 0.5) * r.width * 0.8 + 'px', top: cy + 'px', width: size + 'px', height: size + 'px' });
        fx.appendChild(p);
        gsap.to(p, {
          x: Math.cos(ang) * dist, y: Math.sin(ang) * dist * 0.6, scale: 0,
          duration: 0.75, ease: 'power2.out', onComplete: () => p.remove(),
        });
      }
      gsap.fromTo(hero, { x: 0, y: 0 }, {
        keyframes: [{ x: 1.5, y: 1, duration: 0.07 }, { x: -1.5, y: -1, duration: 0.07 }, { x: 0, y: 0, duration: 0.1 }],
        ease: 'none', overwrite: 'auto', clearProps: 'transform',
      });
    });

    const float = () => {
      q('.stk__card').forEach((card, i) => {
        const s = STICKERS[i];
        gsap.to(card, { y: -7, rotation: 0.8, duration: s.ft, ease: 'sine.inOut', yoyo: true, repeat: -1 }).totalTime(s.fd);
      });
    };

    q('.cloud').forEach((c, i) => gsap.to(c, { x: '16vw', duration: CLOUD_SECONDS[i], ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    gsap.fromTo(q('.steam path'), { strokeDashoffset: 0.45, autoRound: false }, { strokeDashoffset: -1, autoRound: false, duration: 3.2, ease: 'sine.inOut', stagger: { each: 1.05, repeat: -1 } });

    if (!intro) {
      float();
    } else {
      const copy = q('.hero__kicker, .hero__line, .hero__lead, .hero__cta');
      const shell = withVeil ? document.querySelector('.site-header .nav-shell') : null;
      const done = () => {
        root.classList.remove('intro');
        gsap.set(copy, { clearProps: 'transform,opacity,visibility' });
        if (shell) gsap.set(shell, { clearProps: 'transform,opacity,visibility' });
        gsap.set(q('.note, .stk__badge'), { clearProps: 'transform,translate,rotate,scale,opacity,visibility' });
        gsap.set(q('.stk__card'), { clearProps: 'opacity,visibility' });
        gsap.set(q('.squiggle, .note__ink'), { clearProps: 'clipPath,visibility' });
        gsap.set(q('.note__arrow path'), { clearProps: 'strokeDasharray,strokeDashoffset' });
        float();
      };
      const o = withVeil ? 0.35 : 0;
      const tl = gsap.timeline({ paused: withVeil, onComplete: done });
      if (withVeil) {
        tl.set(veil, { pointerEvents: 'none' }, 0);
        tl.to(veil.firstChild, { scale: 1.08, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 0);
        tl.to(veil, { autoAlpha: 0, duration: 0.75, ease: 'power2.inOut' }, 0.15);
        tl.call(endVeil, null, 0.9);
        if (shell) tl.fromTo(shell, { autoAlpha: 0, y: -18 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, o + 0.15);
      }
      tl.fromTo(q('.hero__bg img'), { scale: 1.14 }, { scale: 1, duration: 1.9, ease: 'power3.out' }, withVeil ? 0.1 : 0);
      tl.fromTo(copy, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.09 }, o);
      tl.set(q('.squiggle'), { visibility: 'visible' }, o + 1);
      tl.fromTo(q('.squiggle'), { clipPath: 'inset(-30% 100% -30% 0%)' }, { clipPath: 'inset(-30% -6% -30% 0%)', duration: 0.7, ease: 'power2.out' }, o + 1);
      q('.stk').forEach((stk, i) => {
        const card = stk.querySelector('.stk__card');
        tl.fromTo(card,
          { autoAlpha: 0, y: -46, scale: 1.55, rotation: 9 },
          { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.62, ease: 'back.out(1.9)', onComplete: () => burst(card) },
          o + 0.6 + i * 0.13);
        const badge = stk.querySelector('.stk__badge');
        if (badge) tl.fromTo(badge, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, o + 1.15 + i * 0.13);
      });
      q('.note').forEach((note, i) => {
        tl.fromTo(note, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' }, o + 1.35 + i * 0.1);
        tl.fromTo(note.querySelector('.note__ink'), { clipPath: 'inset(-30% 100% -30% 0%)' }, { clipPath: 'inset(-30% -6% -30% 0%)', duration: 0.75, ease: 'power2.out' }, o + 1.45 + i * 0.1);
        tl.fromTo(note.querySelectorAll('.note__arrow path'), { strokeDasharray: 1, strokeDashoffset: 1, autoRound: false }, { strokeDashoffset: 0, autoRound: false, duration: 0.5, ease: 'power1.inOut' }, o + 1.7 + i * 0.1);
      });
      if (withVeil) {
        veil.style.animation = 'none';
        whenReady(q('.hero__bg img')[0], veil).then(() => { if (alive) tl.play(); });
      }
    }

    const stop = () => {
      alive = false;
      stopTimer = setTimeout(() => root.classList.remove('intro', 'intro-veil'), 0);
    };
    if (!window.matchMedia('(pointer: fine)').matches) return stop;
    const layers = [['.hero__bg', -12, -7], ['.hero__shelf', 14, 8], ['.hero__copy', 6, 4]].map(([sel, ax, ay]) => {
      const el = q(sel)[0];
      return { ax, ay, x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }) };
    });
    const move = (e) => {
      const r = hero.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      layers.forEach((l) => { l.x(nx * l.ax); l.y(ny * l.ay); });
    };
    const leave = () => layers.forEach((l) => { l.x(0); l.y(0); });
    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerleave', leave);
    return () => {
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', leave);
      stop();
    };
  }, { scope: ref });

  return (
    <section className="hero" aria-labelledby="heroTitle" ref={ref}>
      <div className="hero__bg" aria-hidden="true">
        <img src="/img/beranda/hero-kota-2000.webp"
          srcSet="/img/beranda/hero-kota-1200.webp 1200w, /img/beranda/hero-kota-2000.webp 2000w"
          sizes="(max-width: 700px) 1100px, 100vw" alt="" width="2000" height="1008" fetchPriority="high" />
        <span className="cloud cloud--1" />
        <span className="cloud cloud--2" />
        <span className="cloud cloud--3" />
      </div>
      <div className="hero__fx" aria-hidden="true" />

      <div className="container hero__copy">
        <p className="kicker hero__kicker"><T id="Bersatu padu" en="Coffee to go · Open 24 hours" /></p>
        <h1 className="hero__title" id="heroTitle">
          <span className="sr-only">Kopi Padu Rasa: </span>
          <span className="hero__line hero__line--1"><T id="Kopi to go," en="Coffee to go," /></span>
          <span className="hero__line hero__line--2">
            <span className="hero__line--hl">
              <span><T id="buka 24 jam." en="open 24/7." /></span>
              <svg className="squiggle" viewBox="0 0 220 24" preserveAspectRatio="none" aria-hidden="true">
                <path pathLength="1" d="M4 14C40 4 70 22 110 12s70-6 106 2" />
              </svg>
            </span>
          </span>
        </h1>
        <p className="hero__lead">
          <T id={`${STORE_COUNT} toko Kopi Padu Rasa di Sulawesi Selatan. Mampir langsung, pesan lewat aplikasi, atau chat minPadu di WhatsApp.`}
            en={`${STORE_COUNT} Kopi Padu Rasa stores across South Sulawesi. Drop by, order through the apps, or chat with minPadu on WhatsApp.`} />
        </p>
        <div className="hero__cta">
          <Link className="btn btn--ghost btn--lg" href="/lokasi/"><span><T id="Lihat lokasi" en="See locations" /></span><span className="arr" aria-hidden="true">→</span></Link>
        </div>
      </div>

      <div className="hero__shelf">
        {STICKERS.map((s, i) => (
          <Link key={s.n} className={`stk stk--${s.n}${s.big ? ' stk--big' : ''}`} href={s.href}
            style={{ '--i': i, '--rot': s.rot, '--y': s.y }} aria-label={L(s.label[0], s.label[1])}>
            {s.steam && (
              <svg className="steam" viewBox="0 0 60 60" aria-hidden="true">
                <path pathLength="1" d="M18 58c-8-10 8-16 0-26s6-18 0-28" />
                <path pathLength="1" d="M31 58c-8-10 8-16 0-26s6-18 0-28" />
                <path pathLength="1" d="M44 58c-8-10 8-16 0-26s6-18 0-28" />
              </svg>
            )}
            {s.badge && (
              <span className={`stk__badge stk__badge--${s.badge.side}${s.badge.leaf ? ' stk__badge--leaf' : ''}`} aria-hidden="true">
                <T id={s.badge.id} en={s.badge.en} />
              </span>
            )}
            <span className="stk__card"><img src={`/img/produk/${s.img}.webp`} alt="" width="640" height="640" /></span>
            {s.note && <Note {...s.note} />}
          </Link>
        ))}
      </div>
    </section>
  );
}
