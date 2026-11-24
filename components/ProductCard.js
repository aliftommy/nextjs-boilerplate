'use client';
import { MENU } from '@/lib/data';
import { Tofu } from './icons';
import { useLang } from './lang';

const img = (file) => '/img/produk/' + file + '.webp';
// Produk dua harga ({ Normal, Besar }) hanya menampilkan ukuran Normal di kartu.
const normalOf = (v) => (v && typeof v === 'object' ? v.Normal : v);

export default function ProductCard({ p, priceLabel, showFav }) {
  const { t, L } = useLang();
  const sized = p.harga && typeof p.harga === 'object';
  const m = /^(.*?)\s*(Rp.*)$/.exec(normalOf(p.harga) || '');
  const label = m && m[1] ? m[1] : sized ? t(MENU.label_ukuran.Normal) : priceLabel || '';
  const price = m ? m[2] : normalOf(p.harga);
  const rp = /^Rp\s*(.*)$/.exec(price || '');
  const foto = normalOf(p.foto);
  const alt = p.nama + (label ? ', ' + label : '');
  return (
    <article className="pcard" data-reveal>
      <div className="pcard__photo">
        {foto
          ? <img className="pcard__img" src={img(foto)} alt={alt} width="640" height="640" loading="lazy" decoding="async" />
          : <Tofu label={L('Ilustrasi ' + p.nama, p.nama + ' illustration')} />}
        {showFav && p.favorit && <span className="pcard__fav">{t(MENU.label_favorit)}</span>}
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name">{p.nama}</h3>
        <p className="pcard__price">{rp ? <><small>Rp</small>{rp[1]}</> : price}</p>
      </div>
    </article>
  );
}
