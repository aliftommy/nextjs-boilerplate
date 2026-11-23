'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { FAVS } from '@/lib/data';
import ProductCard from '../ProductCard';
import { T, useDocTitle } from '../lang';
import { useReveal } from '../reveal';
import Hero, { HeroVeil } from './Hero';
import PromoSlider from './PromoSlider';

const PIN = 'M0 22S-14 9-14 0a14 14 0 0 1 28 0c0 9-14 22-14 22z';
const PINS = ['translate(130 92)', 'translate(222 52) scale(.8)', 'translate(66 150) scale(.75)', 'translate(250 160) scale(.7)'];

export default function HomePage() {
  const ref = useRef(null);
  useReveal(ref);
  useDocTitle('Kopi Padu Rasa · Kopi to Go di 30 Toko', 'Kopi Padu Rasa · Coffee to Go at 30 Stores');

  return (
    <>
      {/* tirai pembuka, di luar <main> supaya menutupi header juga */}
      <HeroVeil />
      <main id="konten" ref={ref}>
        <Hero />
        <PromoSlider />

        {/* menu favorit */}
        <section className="section favs" aria-labelledby="favTitle">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="kicker">Menu</p>
                <h2 className="h2" id="favTitle"><T id="Menu favorit" en="Customer favorites" /></h2>
              </div>
              <Link className="link-arrow" href="/menu/"><T id="Lihat semua menu →" en="See the full menu →" /></Link>
            </div>
            <div className="pgrid pgrid--4">
              {FAVS.produk.map((p) => <ProductCard key={p.nama} p={p} kind="size" />)}
            </div>
          </div>
        </section>

        {/* ajakan: lokasi & kemitraan */}
        <section className="section ctas">
          <div className="container ctas__grid">
            <article className="cta-card cta-card--lokasi" data-reveal>
              <svg className="cta-card__map" viewBox="0 0 300 220" aria-hidden="true">
                <path className="road" d="M10 190C70 150 90 170 140 120S230 80 290 30M20 60c60 20 90 70 160 60s70 60 110 90M60 10c10 60 50 90 40 210" />
                {PINS.map((tr) => (
                  <g key={tr} className="pin" transform={tr}><path d={PIN} /><circle r="5" /></g>
                ))}
              </svg>
              <p className="kicker"><T id="Lokasi" en="Locations" /></p>
              <h2 className="h2"><span data-count="30">30</span> <T id="Toko, Cari yang Terdekat!" en="Stores, Find the Nearest!" /></h2>
              <p><T id="Temukan Kopi Padu Rasa terdekat dan nikmati kopi favoritmu kapan saja." en="Find the nearest Kopi Padu Rasa and enjoy your favorite coffee anytime." /></p>
              <Link className="btn btn--primary" href="/lokasi/"><span><T id="Lihat lokasi" en="See locations" /></span><span className="arr" aria-hidden="true">→</span></Link>
            </article>
            <article className="cta-card cta-card--mitra" data-reveal>
              <img className="cta-card__mark" src="/img/logo-mark-light.svg" alt="" aria-hidden="true" />
              <p className="kicker kicker--light"><T id="Kemitraan" en="Partnership" /></p>
              <h2 className="h2"><T id="Buka Toko Kopi Padu Rasa di lokasimu" en="Open a Kopi Padu Rasa store in your area" /></h2>
              <p><T id="Jadi bagian dari perjalanan kami." en="Be part of our journey." /></p>
              <Link className="btn btn--cream" href="/kemitraan/"><span><T id="Pelajari kemitraan" en="Learn about the partnership" /></span><span className="arr" aria-hidden="true">→</span></Link>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
