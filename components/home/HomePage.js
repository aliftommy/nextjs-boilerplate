'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { FAVS, STORE_COUNT, href, page, part } from '@/lib/data';
import ProductCard from '../ProductCard';
import { useDocTitle, useLang } from '../lang';
import { useReveal } from '../reveal';
import Hero, { HeroVeil } from './Hero';
import PromoSlider from './PromoSlider';

const PIN = 'M0 22S-14 9-14 0a14 14 0 0 1 28 0c0 9-14 22-14 22z';
const PINS = ['translate(130 92)', 'translate(222 52) scale(.8)', 'translate(66 150) scale(.75)', 'translate(250 160) scale(.7)'];
const TAB = page('Beranda').judul_tab;
const FAV = part('Beranda', 'Menu favorit');
const LOKASI = part('Beranda', 'Kartu ajakan Lokasi');
const MITRA = part('Beranda', 'Kartu ajakan Kemitraan');

function WithCount({ text }) {
  const n = String(STORE_COUNT);
  const i = text.indexOf(n);
  if (i < 0) return text;
  return <>{text.slice(0, i)}<span data-count={n}>{n}</span>{text.slice(i + n.length)}</>;
}

export default function HomePage() {
  const ref = useRef(null);
  const { t } = useLang();
  useReveal(ref);
  useDocTitle(TAB.id, TAB.en);

  return (
    <>
      <HeroVeil />
      <main id="konten" ref={ref}>
        <Hero />
        <PromoSlider />

        <section className="section favs" aria-labelledby="favTitle">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="kicker">{t(FAV.label_kecil)}</p>
                <h2 className="h2" id="favTitle">{t(FAV.judul)}</h2>
              </div>
              <Link className="link-arrow" href={href(FAV.tombol.link)}>{t(FAV.tombol)}</Link>
            </div>
            <div className="pgrid pgrid--4">
              {FAVS.map((p) => <ProductCard key={p.nama} p={p} />)}
            </div>
          </div>
        </section>

        <section className="section ctas">
          <div className="container ctas__grid">
            <article className="cta-card cta-card--lokasi" data-reveal>
              <svg className="cta-card__map" viewBox="0 0 300 220" aria-hidden="true">
                <path className="road" d="M10 190C70 150 90 170 140 120S230 80 290 30M20 60c60 20 90 70 160 60s70 60 110 90M60 10c10 60 50 90 40 210" />
                {PINS.map((tr) => (
                  <g key={tr} className="pin" transform={tr}><path d={PIN} /><circle r="5" /></g>
                ))}
              </svg>
              <p className="kicker">{t(LOKASI.label_kecil)}</p>
              <h2 className="h2"><WithCount text={t(LOKASI.judul)} /></h2>
              <p>{t(LOKASI.teks)}</p>
              <Link className="btn btn--primary" href={href(LOKASI.tombol.link)}><span>{t(LOKASI.tombol)}</span><span className="arr" aria-hidden="true">→</span></Link>
            </article>
            <article className="cta-card cta-card--mitra" data-reveal>
              <img className="cta-card__mark" src="/img/logo-mark-light.svg" alt="" aria-hidden="true" />
              <p className="kicker kicker--light">{t(MITRA.label_kecil)}</p>
              <h2 className="h2">{t(MITRA.judul)}</h2>
              <p>{t(MITRA.teks)}</p>
              <Link className="btn btn--cream" href={href(MITRA.tombol.link)}><span>{t(MITRA.tombol)}</span><span className="arr" aria-hidden="true">→</span></Link>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
