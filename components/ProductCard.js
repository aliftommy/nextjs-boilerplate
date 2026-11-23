'use client';
/* KARTU PRODUK (Beranda & Menu)
   - kind "size": dua harga (Normal/Besar). Kartu atau tombol ukuran ditekan -> foto berganti ukuran
     (transisi CSS) dan "membal" sedikit (GSAP).
   - kind "hot" / "liter" / "plain": satu harga. */
import { useRef, useState } from 'react';
import { MENU, SLUG } from '@/lib/data';
import { gsap, motionOK } from '@/lib/gsap';
import { IconSwap, Tofu } from './icons';
import { useLang } from './lang';

const SIZES = ['Normal', 'Besar'];

export default function ProductCard({ p, kind, showFav }) {
  const { t, L } = useLang();
  const slug = SLUG[p.nama];
  const base = '/img/produk/' + slug;
  const [size, setSize] = useState('Normal');
  const photoRef = useRef(null);

  if (kind === 'size') {
    const big = size === 'Besar';
    const label = (k) => t(MENU.label_ukuran[k]);
    const choose = (k) => {
      setSize(k);
      if (motionOK()) {
        gsap.fromTo(photoRef.current, { scale: 0.96 }, { scale: 1, duration: 0.55, ease: 'back.out(3)', overwrite: true });
      }
    };
    return (
      <article className="pcard pcard--size" data-size={size} data-reveal
        onClick={(e) => { if (!e.target.closest('.size-toggle button')) choose(big ? 'Normal' : 'Besar'); }}>
        <button type="button" className="pcard__photo" ref={photoRef} aria-label={L('Ganti ukuran ' + p.nama, 'Switch size of ' + p.nama)}>
          <img className="pcard__img pcard__img--n" src={base + '.webp'} alt={big ? '' : `${p.nama}, ${label('Normal')}`} width="640" height="640" loading="lazy" decoding="async" />
          <img className="pcard__img pcard__img--b" src={base + '-besar.webp'} alt={big ? `${p.nama}, ${label('Besar')}` : ''} width="640" height="640" loading="lazy" decoding="async" />
          {showFav && p.favorit && <span className="pcard__fav">{t(MENU.label_favorit)}</span>}
          <span className="pcard__swap" aria-hidden="true"><IconSwap /></span>
        </button>
        <div className="pcard__body">
          <h3 className="pcard__name">{p.nama}</h3>
          <div className="size-toggle" role="group" aria-label={L('Pilih ukuran', 'Choose size')}>
            {SIZES.map((k) => (
              <button key={k} type="button" aria-pressed={size === k} onClick={() => choose(k)}>
                <span>{label(k)}</span><b>{p.harga[k]}</b>
              </button>
            ))}
            <span className="size-toggle__thumb" aria-hidden="true" />
          </div>
        </div>
      </article>
    );
  }

  const m = /^(.*?)\s*(Rp.*)$/.exec(p.harga);
  const label = m && m[1] ? m[1] : kind === 'hot' ? L('Panas', 'Hot') : '';
  const price = m ? m[2] : p.harga;
  const suffix = kind === 'hot' ? '-hangat' : kind === 'liter' ? '-1l' : '';
  const alt = p.nama + (kind === 'hot' ? L(' hangat', ' (hot)') : kind === 'liter' ? ' 1 liter' : '');
  return (
    <article className="pcard pcard--single" data-reveal>
      <div className="pcard__photo">
        {slug
          ? <img className="pcard__img" src={base + suffix + '.webp'} alt={alt} width="640" height="640" loading="lazy" decoding="async" />
          : <Tofu label={L('Ilustrasi ' + p.nama, p.nama + ' illustration')} />}
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name">{p.nama}</h3>
        <p className="pcard__price"><span>{label}</span><b>{price}</b></p>
      </div>
    </article>
  );
}
