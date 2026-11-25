'use client';
import { useRef } from 'react';
import { page, part } from '@/lib/data';
import { gsap, motionOK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { IconWa } from '../icons';
import { useDocTitle, useLang } from '../lang';
import { useReveal } from '../reveal';
import Investasi from './Investasi';

const TAB = page('Kemitraan').judul_tab;
const HEAD = part('Kemitraan', 'Judul halaman');
const BENEFITS = part('Kemitraan', 'Keuntungan Investasi');
const STEPS = part('Kemitraan', 'Alur Kemitraan');
const CTA = part('Kemitraan', 'Ajakan penutup');

const ICONS = {
  lencana: <><path d="M12 3l2.4 1.8 3 .1.9 2.9 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.9-3 .1L12 21l-2.4-1.8-3-.1-.9-2.9-2.4-1.8.9-2.9-.9-2.9 2.4-1.8.9-2.9 3-.1z" /><path d="m8.6 12.2 2.4 2.3 4.5-4.7" /></>,
  pendampingan: <><circle cx="8.5" cy="8" r="3" /><circle cx="16.5" cy="9" r="2.5" /><path d="M3 19.5c.6-3.3 2.7-5.2 5.5-5.2s4.9 1.9 5.5 5.2M14.2 14.4c.7-.5 1.5-.8 2.3-.8 2.2 0 3.9 1.6 4.4 4.6" /></>,
  grafik: <><path d="M4 20h16" /><path d="m5.5 16 4.5-4.5 3 3 5.5-6.5" /><path d="M14 8h4.5v4.5" /></>,
};

function MitraArt() {
  const ref = useRef(null);
  const { t } = useLang();
  const [badge1, badge2] = HEAD.lencana_gambar || [];
  useGSAP(() => {
    const q = gsap.utils.selector(ref);
    if (!motionOK()) {
      gsap.set(q('.mitra-art__mark path'), { strokeDashoffset: 0 });
      gsap.set(q('.mitra-art__badge'), { visibility: 'visible' });
      return;
    }
    gsap.to(q('.mitra-art__ring'), { rotation: 360, duration: 40, ease: 'none', repeat: -1 });
    const paths = q('.mitra-art__mark path');
    const lens = paths.map((p) => p.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0) || 1;
    const tl = gsap.timeline({ delay: 0.25 });
    paths.forEach((p, i) => {
      tl.fromTo(p, { strokeDashoffset: 1, autoRound: false },
        { strokeDashoffset: 0, autoRound: false, duration: 0.2 + 1.8 * (lens[i] / total), ease: 'power1.inOut' },
        i === 0 ? 0 : '+=0.12');
    });
    tl.fromTo(q('.mitra-art__badge'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.2 }, '-=0.15')
      .set(q('.mitra-art__badge'), { clearProps: 'transform,rotate,scale,translate,opacity' });
  }, { scope: ref });

  return (
    <div className="mitra-art" aria-hidden="true" ref={ref}>
      <div className="mitra-art__ring" />
      <div className="mitra-art__disc" />
      <svg className="mitra-art__mark" viewBox="-200.5 -195.5 990 990">
        <path pathLength="1" d="M60 160C150 92 300 58 400 104c52 28 44 96-18 110-70 18-150-2-156-44-6-40 40-58 80-52 40 7 46 42 16 52-22 7-44-2-42-15" />
        <path pathLength="1" d="M185 235c77 57 235 61 305-5 50-50 40-138-35-180" />
        <path pathLength="1" d="M112 212c0 88 8 188 28 268 20 92 342 96 365 0 15-70 20-130 25-180" />
        <path pathLength="1" d="M445 425c-5 35-20 55-40 67" />
      </svg>
      {badge1 && <span className="mitra-art__badge mitra-art__badge--1">{t(badge1)}</span>}
      {badge2 && <span className="mitra-art__badge mitra-art__badge--2">{t(badge2)}</span>}
    </div>
  );
}

function Timeline() {
  const ref = useRef(null);
  const { t } = useLang();
  useGSAP(() => {
    const tl = ref.current;
    const items = tl.querySelectorAll('li');
    if (!motionOK()) {
      tl.style.setProperty('--progress', 1);
      items.forEach((li) => li.classList.add('is-done'));
      return;
    }
    gsap.fromTo(tl, { '--progress': 0 }, {
      '--progress': 1, ease: 'none',
      scrollTrigger: { trigger: tl, start: 'top 62%', end: 'bottom 62%', scrub: 0.4 },
    });
    items.forEach((li) => {
      ScrollTrigger.create({ trigger: li, start: 'center 62%', toggleClass: 'is-done' , end: 'max' });
    });
  }, { scope: ref });

  return (
    <ol className="timeline" ref={ref}>
      {STEPS.langkah.map((s, i) => (
        <li key={s.id}>
          <span className="timeline__no" aria-hidden="true">{i + 1}</span>
          <span className="timeline__card">{t(s)}</span>
        </li>
      ))}
    </ol>
  );
}

export default function KemitraanPage() {
  const ref = useRef(null);
  const { t } = useLang();
  useReveal(ref);
  useDocTitle(TAB.id, TAB.en);

  return (
    <main id="konten" ref={ref}>
      <section className="page-hero" aria-labelledby="mitraTitle">
        <div className="container split">
          <div>
            <p className="kicker">{t(HEAD.label_kecil)}</p>
            <h1 className="page-title" id="mitraTitle">{t(HEAD.judul)}</h1>
            <p className="page-lead">{t(HEAD.teks)}</p>
          </div>
          <MitraArt />
        </div>
      </section>

      <section className="section" aria-labelledby="benefitTitle">
        <div className="container">
          <h2 className="h2 center" id="benefitTitle">{t(BENEFITS.judul)}</h2>
          <ol className="benefit-grid">
            {BENEFITS.poin.map((b, i) => (
              <li className="benefit" data-reveal key={b.id}>
                <span className="benefit__no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="benefit__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[b.ikon] || ICONS.lencana}</svg>
                </span>
                <h3>{t(b)}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Investasi />

      <section className="section steps" id="alur" aria-labelledby="stepsTitle">
        <div className="container">
          <h2 className="h2 center" id="stepsTitle">{t(STEPS.judul)}</h2>
          <Timeline />
        </div>
      </section>

      <section className="cta-band" aria-labelledby="mitraCtaTitle">
        <div className="container">
          <div className="cta-band__inner" data-reveal>
            <h2 className="h2" id="mitraCtaTitle">{t(CTA.judul)}</h2>
            <p>{t(CTA.teks)}</p>
            <a className="btn btn--wa btn--lg" href={CTA.tombol.link} target="_blank" rel="noopener">
              <IconWa />{CTA.tombol.teks}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
