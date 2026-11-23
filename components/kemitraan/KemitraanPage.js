'use client';
/* KEMITRAAN (GSAP)
   - gambar logo di hero: digores garis demi garis seperti tangan menggambar, cincin putus-putus berputar pelan, badge muncul
   - alur 9 langkah: garis tengah terisi mengikuti scroll (ScrollTrigger scrub), langkah yang sudah
     dilewati garis ditandai (.is-done) */
import { useRef } from 'react';
import { WA_MITRA } from '@/lib/data';
import { gsap, motionOK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { IconWa } from '../icons';
import { T, useDocTitle } from '../lang';
import { useReveal } from '../reveal';

const BENEFITS = [
  {
    id: 'Brand & Sistem Bisnis yang Sudah Teruji', en: 'A Proven Brand & Business System',
    icon: <><path d="M12 3l2.4 1.8 3 .1.9 2.9 2.4 1.8-.9 2.9.9 2.9-2.4 1.8-.9 2.9-3 .1L12 21l-2.4-1.8-3-.1-.9-2.9-2.4-1.8.9-2.9-.9-2.9 2.4-1.8.9-2.9 3-.1z" /><path d="m8.6 12.2 2.4 2.3 4.5-4.7" /></>,
  },
  {
    id: 'Pendampingan dari Awal hingga Operasional', en: 'Support from Day One to Daily Operations',
    icon: <><circle cx="8.5" cy="8" r="3" /><circle cx="16.5" cy="9" r="2.5" /><path d="M3 19.5c.6-3.3 2.7-5.2 5.5-5.2s4.9 1.9 5.5 5.2M14.2 14.4c.7-.5 1.5-.8 2.3-.8 2.2 0 3.9 1.6 4.4 4.6" /></>,
  },
  {
    id: 'Peluang Bisnis yang Terukur & Berkelanjutan', en: 'A Measurable & Sustainable Business Opportunity',
    icon: <><path d="M4 20h16" /><path d="m5.5 16 4.5-4.5 3 3 5.5-6.5" /><path d="M14 8h4.5v4.5" /></>,
  },
];

const STEPS = [
  ['Konsultasi Kemitraan', 'Partnership Consultation'],
  ['Pengajuan Kuota Investasi', 'Investment Quota Application'],
  ['Pembayaran Uang Muka', 'Down Payment'],
  ['Survei Lokasi', 'Site Survey'],
  ['Penandatanganan Akad', 'Contract Signing'],
  ['Pembayaran Tahap 1 – Pembangunan Toko', 'Payment Stage 1 – Store Construction'],
  ['Pembayaran Tahap 2 – Progres 50%', 'Payment Stage 2 – 50% Completion'],
  ['Pembayaran Tahap 3 – Pelunasan', 'Payment Stage 3 – Final Payment'],
  ['Toko Siap Beroperasi', 'Store Ready to Operate'],
];

function MitraArt() {
  const ref = useRef(null);
  useGSAP(() => {
    const q = gsap.utils.selector(ref);
    if (!motionOK()) {
      gsap.set(q('.mitra-art__mark path'), { strokeDashoffset: 0 });
      gsap.set(q('.mitra-art__badge'), { visibility: 'visible' });
      return;
    }
    gsap.to(q('.mitra-art__ring'), { rotation: 360, duration: 40, ease: 'none', repeat: -1 });
    /* logo digores seperti tangan menggambar: satu garis selesai, pena diangkat sebentar, lalu garis berikutnya.
       Lama tiap goresan sebanding panjang garisnya. autoRound: false wajib: tanpa itu GSAP membulatkan
       stroke-dashoffset (0..1) ke 0 atau 1, sehingga garis muncul utuh sekaligus, tidak tergambar. */
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
      /* badge punya rotate dari CSS; setelah muncul, gaya sementara GSAP dibersihkan */
      .set(q('.mitra-art__badge'), { clearProps: 'transform,rotate,scale,translate,opacity' });
  }, { scope: ref });

  return (
    <div className="mitra-art" aria-hidden="true" ref={ref}>
      <div className="mitra-art__ring" />
      <div className="mitra-art__disc" />
      <svg className="mitra-art__mark" viewBox="20 20 560 580">
        <path pathLength="1" d="M60 160C150 92 300 58 400 104c52 28 44 96-18 110-70 18-150-2-156-44-6-40 40-58 80-52 40 7 46 42 16 52-22 7-44-2-42-15" />
        <path pathLength="1" d="M185 235c77 57 235 61 305-5 50-50 40-138-35-180" />
        <path pathLength="1" d="M112 212c0 88 8 188 28 268 20 92 342 96 365 0 15-70 20-130 25-180" />
        <path pathLength="1" d="M445 425c-5 35-20 55-40 67" />
      </svg>
      <span className="mitra-art__badge mitra-art__badge--1"><T id="30 toko" en="30 stores" /></span>
      <span className="mitra-art__badge mitra-art__badge--2"><T id="Buka 24 jam" en="Open 24 hours" /></span>
    </div>
  );
}

function Timeline() {
  const ref = useRef(null);
  useGSAP(() => {
    const tl = ref.current;
    const items = tl.querySelectorAll('li');
    if (!motionOK()) {
      tl.style.setProperty('--progress', 1);
      items.forEach((li) => li.classList.add('is-done'));
      return;
    }
    /* garis terisi sejauh garis bantu di 62% tinggi layar sudah melewati daftar */
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
      {STEPS.map(([id, en], i) => (
        <li key={id}>
          <span className="timeline__no" aria-hidden="true">{i + 1}</span>
          <span className="timeline__card"><T id={id} en={en} /></span>
        </li>
      ))}
    </ol>
  );
}

export default function KemitraanPage() {
  const ref = useRef(null);
  useReveal(ref);
  useDocTitle('Kemitraan · Kopi Padu Rasa', 'Partnership · Kopi Padu Rasa');

  return (
    <main id="konten" ref={ref}>
      <section className="page-hero" aria-labelledby="mitraTitle">
        <div className="container split">
          <div>
            <p className="kicker"><T id="Kemitraan" en="Partnership" /></p>
            <h1 className="page-title" id="mitraTitle"><T id="Buka toko Kopi Padu Rasa di lokasimu" en="Open a Kopi Padu Rasa store in your area" /></h1>
            <p className="page-lead"><T id="Jadi bagian dari perjalanan kami: 30 toko di Sulawesi Selatan, semuanya buka 24 jam." en="Be part of our journey: 30 stores across South Sulawesi, all open 24 hours." /></p>
          </div>
          <MitraArt />
        </div>
      </section>

      <section className="section" aria-labelledby="benefitTitle">
        <div className="container">
          <h2 className="h2 center" id="benefitTitle"><T id="Keuntungan Investasi" en="Investment Benefits" /></h2>
          <ol className="benefit-grid">
            {BENEFITS.map((b, i) => (
              <li className="benefit" data-reveal key={b.id}>
                <span className="benefit__no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="benefit__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{b.icon}</svg>
                </span>
                <h3><T id={b.id} en={b.en} /></h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section steps" id="alur" aria-labelledby="stepsTitle">
        <div className="container">
          <h2 className="h2 center" id="stepsTitle"><T id="Alur Kemitraan" en="Partnership Steps" /></h2>
          <Timeline />
        </div>
      </section>

      <section className="cta-band" aria-labelledby="mitraCtaTitle">
        <div className="container">
          <div className="cta-band__inner" data-reveal>
            <h2 className="h2" id="mitraCtaTitle"><T id="Jadi bagian dari perjalanan kami." en="Be part of our journey." /></h2>
            <p><T id="Mulai dari konsultasi kemitraan. Ngobrol dengan tim kami lewat WhatsApp." en="Start with a partnership consultation. Chat with our team on WhatsApp." /></p>
            <a className="btn btn--wa btn--lg" href={WA_MITRA} target="_blank" rel="noopener">
              <IconWa />WhatsApp 0851 7704 9460
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
