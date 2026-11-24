'use client';
import { useRef, useState } from 'react';
import { MENU } from '@/lib/data';
import { gsap, motionOK } from '@/lib/gsap';
import { IconSwap, Tofu } from './icons';
import { useLang } from './lang';

const SIZES = ['Normal', 'Besar'];
const img = (file) => '/img/produk/' + file + '.webp';
const fotoOf = (p, size) => (p.foto && typeof p.foto === 'object' ? p.foto[size] : p.foto);

export default function ProductCard({ p, priceLabel, showFav }) {
  const { t, L } = useLang();
  const [size, setSize] = useState('Normal');
  const photoRef = useRef(null);
  const tofu = <Tofu label={L('Ilustrasi ' + p.nama, p.nama + ' illustration')} />;

  if (p.harga && typeof p.harga === 'object') {
    const fotoN = fotoOf(p, 'Normal');
    const fotoB = fotoOf(p, 'Besar') || fotoN;
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
          {fotoN ? (
            <>
              <img className="pcard__img pcard__img--n" src={img(fotoN)} alt={big ? '' : `${p.nama}, ${label('Normal')}`} width="640" height="640" loading="lazy" decoding="async" />
              <img className="pcard__img pcard__img--b" src={img(fotoB)} alt={big ? `${p.nama}, ${label('Besar')}` : ''} width="640" height="640" loading="lazy" decoding="async" />
            </>
          ) : tofu}
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

  const m = /^(.*?)\s*(Rp.*)$/.exec(p.harga || '');
  const label = m && m[1] ? m[1] : priceLabel || '';
  const price = m ? m[2] : p.harga;
  const foto = fotoOf(p, 'Normal');
  const alt = p.nama + (label ? ', ' + label : '');
  return (
    <article className="pcard pcard--single" data-reveal>
      <div className="pcard__photo">
        {foto
          ? <img className="pcard__img" src={img(foto)} alt={alt} width="640" height="640" loading="lazy" decoding="async" />
          : tofu}
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name">{p.nama}</h3>
        <p className="pcard__price"><span>{label}</span><b>{price}</b></p>
      </div>
    </article>
  );
}
