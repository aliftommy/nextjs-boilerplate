'use client';
/* SLIDER PROMO (3 slide, selebar layar)
   - bisa digeser jari (scroll-snap CSS), panah, titik, dan tombol panah keyboard
   - pindah slide: GSAP ScrollToPlugin menggulir ke slide tujuan dengan halus
   - berganti otomatis tiap 5 detik (gsap.delayedCall), berhenti saat kursor/fokus di slider
     atau tab tidak terlihat; tidak berganti otomatis bila pengunjung mematikan animasi */
import Link from 'next/link';
import { useRef, useState } from 'react';
import { MENU, WA_ORDER } from '@/lib/data';
import { gsap, motionOK, useGSAP } from '@/lib/gsap';
import { IconChevron } from '../icons';
import { T, useLang } from '../lang';

const AUTOPLAY_SECONDS = 5;

function slideSrc(name) {
  const b = `/img/beranda/slide-${name}-`;
  return {
    src: b + '1600.webp',
    srcSet: `${b}800.webp 800w, ${b}1200.webp 1200w, ${b}1600.webp 1600w, ${b}2400.webp 2400w`,
  };
}

const BOTTLES = [
  { img: 'coklat-1l', l: '0%', b: '4%', r: '-10deg' },
  { img: 'kpa-1l', l: '20%', b: '22%', r: '-3deg' },
  { img: 'kpk-1l', l: '41%', b: '10%', r: '5deg' },
  { img: 'matcha-1l', l: '61%', b: '26%', r: '11deg' },
];

export default function PromoSlider() {
  const { L } = useLang();
  const boxRef = useRef(null);
  const vpRef = useRef(null);
  const api = useRef({ go() {}, tick() {} });
  const [idx, setIdx] = useState(0);
  const N = 3;

  const seliter = MENU.kategori.find((c) => /seliter/.test(c.alamat_bagian));

  useGSAP((ctx, contextSafe) => {
    const vp = vpRef.current;
    const box = boxRef.current;
    const motion = motionOK();
    let i = 0;
    let tween = null;
    let timer = null;
    let hold = false;

    const go = contextSafe((k, smooth = true) => {
      i = (k + N) % N;
      setIdx(i);
      if (tween) tween.kill();
      const x = i * vp.clientWidth;
      if (!smooth || !motion) { vp.scrollLeft = x; tween = null; return; }
      vp.style.scrollSnapType = 'none'; // snap dimatikan sebentar supaya tidak melawan gulir GSAP
      tween = gsap.to(vp, {
        scrollTo: { x, autoKill: false },
        duration: 0.85,
        ease: 'power3.inOut',
        onComplete: () => { vp.style.scrollSnapType = ''; tween = null; },
        onInterrupt: () => { vp.style.scrollSnapType = ''; tween = null; },
      });
    });
    const tick = contextSafe(() => {
      if (timer) timer.kill();
      if (!motion || hold || document.hidden) return;
      timer = gsap.delayedCall(AUTOPLAY_SECONDS, () => { go(i + 1); tick(); });
    });
    api.current = { go: (k) => { go(k); tick(); }, tick };

    let raf = 0;
    const onScroll = () => {
      if (tween) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const k = Math.round(vp.scrollLeft / vp.clientWidth);
        if (k !== i && k >= 0 && k < N) { i = k; setIdx(k); }
      });
    };
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); tick(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); tick(); }
    };
    const pause = () => { hold = true; tick(); };
    const resume = () => { hold = false; tick(); };
    const onResize = () => go(i, false);

    vp.addEventListener('scroll', onScroll, { passive: true });
    vp.addEventListener('keydown', onKey);
    vp.addEventListener('touchstart', tick, { passive: true });
    box.addEventListener('mouseenter', pause);
    box.addEventListener('mouseleave', resume);
    box.addEventListener('focusin', pause);
    box.addEventListener('focusout', resume);
    document.addEventListener('visibilitychange', tick);
    window.addEventListener('resize', onResize);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      vp.removeEventListener('scroll', onScroll);
      vp.removeEventListener('keydown', onKey);
      vp.removeEventListener('touchstart', tick);
      box.removeEventListener('mouseenter', pause);
      box.removeEventListener('mouseleave', resume);
      box.removeEventListener('focusin', pause);
      box.removeEventListener('focusout', resume);
      document.removeEventListener('visibilitychange', tick);
      window.removeEventListener('resize', onResize);
    };
  }, { scope: boxRef });

  const s1 = slideSrc('big-service');
  const s2 = slideSrc('pesan-cepat');

  return (
    <section className="section promo" aria-labelledby="promoTitle">
      <h2 className="sr-only" id="promoTitle"><T id="Promo dan layanan" en="Promos and services" /></h2>
      <div className="slider" ref={boxRef} role="region" aria-roledescription="carousel" aria-label={L('Promo Kopi Padu Rasa', 'Kopi Padu Rasa promos')}>
        <div className="slider__viewport" ref={vpRef} tabIndex={0} aria-label={L('Geser untuk melihat promo lain', 'Swipe to see more promos')}>
          <div className="slide" role="group" aria-roledescription="slide" aria-label={L('1 dari 3', '1 of 3')}>
            <div className="slide__media">
              <img {...s1} sizes="100vw" width="1600" height="933" loading="lazy" decoding="async"
                alt={L(
                  'Big Service KPR. Apa pun acaranya, siapa pun tamunya, Kopi Padu Rasa jadi bagian hangat ceritanya. Paket Padu-Go: minimum order 50 cup, styrofoam, pengiriman (excluded). Padu-Big: minimum order 250 cup, pengiriman, booth, 2 barista (excluded). Padu-Prime: minimum order 250 cup, pengiriman (+2 barista), booth, custom greetings.',
                  'Big Service KPR. Whatever the occasion, whoever the guests, Kopi Padu Rasa becomes a warm part of the story. Padu-Go package: minimum order 50 cups, styrofoam, delivery (excluded). Padu-Big: minimum order 250 cups, delivery, booth, 2 baristas (excluded). Padu-Prime: minimum order 250 cups, delivery (+2 baristas), booth, custom greetings.',
                )} />
            </div>
          </div>

          <div className="slide" role="group" aria-roledescription="slide" aria-label={L('2 dari 3', '2 of 3')}>
            <a className="slide__media" href={WA_ORDER} target="_blank" rel="noopener">
              <img {...s2} sizes="100vw" width="1600" height="933" loading="lazy" decoding="async"
                alt={L(
                  'Pesan cepat? WhatsApp Kopi Padu Rasa 0821 8717 165. Klik untuk chat: Min, saya mau order.',
                  "Need it fast? WhatsApp Kopi Padu Rasa at 0821 8717 165. Click to chat: Hi, I'd like to order.",
                )} />
            </a>
          </div>

          <div className="slide slide--seliter" role="group" aria-roledescription="slide" aria-label={L('3 dari 3', '3 of 3')}>
            <div className="slide__media seliter">
              <div className="seliter__text">
                <p className="kicker kicker--light">Seliter Padu</p>
                <h3 className="seliter__title">
                  <T id={<>Seliter<br /><em>lebih puas.</em></>} en={<>A whole liter,<br /><em>extra satisfying.</em></>} />
                </h3>
                <ul className="seliter__prices">
                  {seliter?.produk.map((p) => {
                    const m = /(Rp.*)$/.exec(p.harga);
                    return <li key={p.nama}><span>{p.nama}</span><b>{m ? m[1] : p.harga}</b></li>;
                  })}
                </ul>
                <Link className="btn btn--cream" href="/menu/#menu-seliter">
                  <span><T id="Lihat Seliter Padu" en="See Seliter Padu" /></span><span className="arr" aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="seliter__bottles" aria-hidden="true">
                {BOTTLES.map((b) => (
                  <span key={b.img} className="bottle" style={{ '--l': b.l, '--b': b.b, '--r': b.r }}>
                    <img src={`/img/produk/${b.img}.webp`} alt="" width="640" height="640" loading="lazy" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="slider__arrow slider__arrow--prev" aria-label={L('Slide sebelumnya', 'Previous slide')} onClick={() => api.current.go(idx - 1)}>
          <IconChevron dir="left" />
        </button>
        <button type="button" className="slider__arrow slider__arrow--next" aria-label={L('Slide berikutnya', 'Next slide')} onClick={() => api.current.go(idx + 1)}>
          <IconChevron />
        </button>
        <div className="slider__bar">
          <div className="slider__dots">
            {Array.from({ length: N }, (_, k) => (
              <button key={k} type="button" className="slider__dot" aria-current={k === idx} aria-label={L('Ke slide ', 'Go to slide ') + (k + 1)}
                onClick={() => api.current.go(k)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
