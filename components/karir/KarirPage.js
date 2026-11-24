'use client';
import { useRef } from 'react';
import { page, part } from '@/lib/data';
import { gsap, motionOK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { IconWa } from '../icons';
import { useDocTitle, useLang } from '../lang';
import { useReveal } from '../reveal';

const TAB = page('Karir').judul_tab;
const HEAD = part('Karir', 'Judul halaman');
const GROW = part('Karir', 'Bertumbuh Bersama');
const VALUES = part('Karir', 'Belajar · Bersama · Berdampak');
const CLOSING = part('Karir', 'Penutup');

const ROAD = 'M48 470C180 470 226 404 176 352 124 300 172 236 282 254c110 18 190-16 150-88-36-62 0-104 68-108';
const [START_LABEL, ...STOP_LABELS] = HEAD.gambar_jalan.label;
const MILESTONES = [
  { at: 0.3, x: 32, y: 9, anchor: 'start' },
  { at: 0.56, x: -8, y: 52, anchor: 'middle' },
  { at: 0.8, x: -32, y: 9, anchor: 'end' },
]
  .slice(0, STOP_LABELS.length)
  .map((m, i) => ({ ...m, n: i + 1, label: STOP_LABELS[i] }));

function Road() {
  const ref = useRef(null);
  const { t, L } = useLang();
  const stops = MILESTONES.map((m) => t(m.label).toLowerCase()).join(', ');

  useGSAP(() => {
    const fig = ref.current;
    const path = fig.querySelector('.road__path');
    const trail = fig.querySelector('.road__trail');
    const traveler = fig.querySelector('.road__traveler');
    const ms = [...fig.querySelectorAll('.ms')];
    const len = path.getTotalLength();
    ms.forEach((g) => {
      const pt = path.getPointAtLength(len * +g.dataset.at);
      g.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      g.classList.add('is-placed');
    });
    const set = (p) => {
      trail.style.strokeDashoffset = String(1 - p);
      const pt = path.getPointAtLength(len * p);
      traveler.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      ms.forEach((g) => g.classList.toggle('is-on', p >= +g.dataset.at - 0.005));
      fig.classList.toggle('is-done', p >= 1);
    };
    if (!motionOK()) { set(1); return; }
    set(0);
    const state = { p: 0 };
    ScrollTrigger.create({
      trigger: fig,
      start: 'top 65%',
      once: true,
      onEnter: () => gsap.to(state, { p: 1, duration: 3.4, ease: 'power1.inOut', onUpdate: () => set(state.p) }),
    });
  }, { scope: ref });

  return (
    <figure className="road" ref={ref}
      aria-label={L('Gambar jalan berkelok dari titik awal ke logo Kopi Padu Rasa: ', 'A winding road from the starting point to the Kopi Padu Rasa logo: ') + stops + '.'}>
      <svg viewBox="0 0 560 520" aria-hidden="true">
        <path className="road__base road__path" d={ROAD} />
        <path className="road__line" d={ROAD} />
        <path className="road__trail" pathLength="1" d={ROAD} />
        <g className="road__start" transform="translate(48 470)">
          <circle r="13" />
          <text className="road__label" x="-6" y="44">{t(START_LABEL)}</text>
        </g>
        {MILESTONES.map((m) => (
          <g className="ms" data-at={m.at} key={m.n}>
            <g className="ms__pop"><circle className="ms__dot" r="20" /><text className="ms__num" y="6.5" textAnchor="middle">{m.n}</text></g>
            <text className="road__label" x={m.x} y={m.y} textAnchor={m.anchor}>{t(m.label)}</text>
          </g>
        ))}
        <g className="road__end" transform="translate(500 58)">
          <circle r="46" />
          <clipPath id="roadEndClip"><circle r="44" /></clipPath>
          <image href="/img/logo.webp" x="-44" y="-44" width="88" height="88" clipPath="url(#roadEndClip)" />
        </g>
        <g className="road__traveler" transform="translate(48 470)"><circle r="11" /></g>
      </svg>
    </figure>
  );
}

export default function KarirPage() {
  const ref = useRef(null);
  const { t } = useLang();
  useReveal(ref);
  useDocTitle(TAB.id, TAB.en);

  return (
    <main id="konten" ref={ref}>
      <section className="page-hero page-hero--karir" aria-labelledby="karirTitle">
        <div className="container split">
          <div>
            <p className="kicker">{t(HEAD.label_kecil)}</p>
            <h1 className="page-title" id="karirTitle">{t(HEAD.judul)}</h1>
            {HEAD.teks.map((p) => <p className="page-lead" key={p.id}>{t(p)}</p>)}
          </div>
          <Road />
        </div>
      </section>

      <section className="section" aria-labelledby="growTitle">
        <div className="container grow__inner">
          <div className="grow__text" data-reveal>
            <h2 className="h2" id="growTitle">{t(GROW.judul)}</h2>
            {GROW.teks.map((p) => <p key={p.id}>{t(p)}</p>)}
          </div>
          <blockquote className="quote" data-reveal>
            <p>{t(GROW.kutipan)}</p>
          </blockquote>
        </div>
      </section>

      <section className="section values" aria-labelledby="valuesTitle">
        <div className="container">
          <h2 className="sr-only" id="valuesTitle">{t(VALUES.judul_tersembunyi_untuk_google)}</h2>
          <div className="value-grid">
            {VALUES.kartu.map((v, i) => (
              <article className="value" data-reveal key={v.label.id}>
                <p className="value__label"><span className="value__no">{i + 1}</span><span>{t(v.label)}</span></p>
                <h3>{t(v.judul)}</h3>
                {v.teks.map((p) => <p key={p.id}>{t(p)}</p>)}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="closingTitle">
        <div className="container closing__inner" data-reveal>
          <h2 className="h2" id="closingTitle">{t(CLOSING.judul)}</h2>
          {CLOSING.teks.map((p) => <p key={p.id}>{t(p)}</p>)}
          <p className="closing__last">{t(CLOSING.kalimat_akhir)}</p>
          <a className="btn btn--wa btn--lg" href={CLOSING.tombol.link} target="_blank" rel="noopener">
            <IconWa />{CLOSING.tombol.teks}
          </a>
        </div>
      </section>
    </main>
  );
}
