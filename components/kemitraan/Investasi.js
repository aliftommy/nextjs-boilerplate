'use client';
import { part } from '@/lib/data';
import { useLang } from '../lang';

const INV = part('Kemitraan', 'Peluang Investasi');

const ICONS = {
  produk: <><path d="M12 3.5 19.5 7.5v9L12 20.5 4.5 16.5v-9z" /><path d="M4.5 7.5 12 11.5l7.5-4M12 11.5v9" /></>,
  promosi: <><path d="M4 10.2v3.6c0 .6.4 1 1 1h2.2l5.3 4V5.2l-5.3 4H5c-.6 0-1 .4-1 1z" /><path d="M16 9.2a3.5 3.5 0 0 1 0 5.6M18.6 6.6a7.2 7.2 0 0 1 0 10.8" /></>,
  event: <><rect x="4" y="5.5" width="16" height="14.5" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /><path d="m9.2 14.6 1.9 1.8 3.7-3.8" /></>,
  lainnya: <><circle cx="12" cy="12" r="8.5" /><path d="M12 8.3v7.4M8.3 12h7.4" /></>,
};

const anchor = (kode) => 'skema-' + kode.toLowerCase();

function SubHead({ no, id, title, lead }) {
  return (
    <div className="inv-sub" data-reveal>
      <span className="inv-sub__no" aria-hidden="true">{no}</span>
      <div>
        <h3 className="h3" id={id}>{title}</h3>
        {lead && <p>{lead}</p>}
      </div>
    </div>
  );
}

function Plans() {
  const { t } = useLang();
  const S = INV.skema;
  return (
    <div className="inv-part" role="group" aria-labelledby="invPlans">
      <SubHead no={1} id="invPlans" title={t(S.judul)} />
      <ul className="plan-grid">
        {S.pilihan.map((p, i) => {
          const sub = t(p.nama_lain);
          return (
            <li className={'plan' + (i === 0 ? ' plan--dark' : '')} data-reveal key={p.kode}>
              <span className="plan__code" aria-hidden="true">{p.kode}</span>
              <h4 className="plan__name">{t(p.nama)}{sub && <small>{sub}</small>}</h4>
              <p className="plan__value"><b>{p.angka}</b> <span>{t(p.satuan)}</span></p>
              <p className="plan__text">{t(p.teks)}</p>
              <a className="plan__link" href={'#' + anchor(p.kode)}>{t(S.tombol_rincian)}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Scheme({ s, L }) {
  const { t } = useLang();
  const sub = t(s.nama_lain);
  const id = anchor(s.kode);
  return (
    <article className="scheme" id={id} aria-labelledby={id + '-judul'} data-reveal>
      <header className="scheme__head">
        <span className="scheme__code" aria-hidden="true">{s.kode}</span>
        <h4 id={id + '-judul'}>{t(s.nama)}{sub && <small>{sub}</small>}</h4>
      </header>
      <p className="scheme__text">{t(s.teks)}</p>
      <div>
        <h5 className="scheme__label">{t(L.peran)}</h5>
        <div className="roles">
          <div className="role">
            <p className="role__who">{t(L.investor)}</p>
            <ul>{s.peran_investor.map((r) => <li key={r.id}>{t(r)}</li>)}</ul>
          </div>
          <div className="role role--mgr">
            <p className="role__who">{t(L.pengelola)}</p>
            <ul>{s.peran_pengelola.map((r) => <li key={r.id}>{t(r)}</li>)}</ul>
          </div>
        </div>
      </div>
      <div>
        <h5 className="scheme__label">{t(L.bagi_hasil)}</h5>
        <table className="share">
          <thead>
            <tr>
              <th scope="col">{t(L.keterangan)}</th>
              <th scope="col"><span className="share__key">{t(L.investor)}</span></th>
              <th scope="col"><span className="share__key share__key--mgr">{t(L.pengelola)}</span></th>
            </tr>
          </thead>
          <tbody>
            {s.bagi_hasil.map((r) => (
              <tr key={r.keterangan.id}>
                <th scope="row">{t(r.keterangan)}</th>
                <td>{r.investor}</td>
                <td>{r.pengelola}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="share-notes">
          {s.penjelasan_bagi_hasil.map((n) => <li key={n.id}><b>{t(n.judul)}:</b> {t(n)}</li>)}
        </ul>
      </div>
      <div className="scheme__notes">
        <h5 className="scheme__label">{t(L.catatan)}</h5>
        <ol className="notes">
          {s.catatan.map((n, i) => (
            <li key={n.id}>
              <span className="notes__no" aria-hidden="true">{i + 1}</span>
              <p><b>{t(n.judul)}:</b> {t(n)}</p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

function Compare() {
  const { t } = useLang();
  const C = INV.perbandingan;
  return (
    <div className="inv-part" role="group" aria-labelledby="invCompare">
      <SubHead no={2} id="invCompare" title={t(C.judul)} />
      <div className="scheme-grid">
        {C.skema.map((s) => <Scheme s={s} L={C.label} key={s.kode} />)}
      </div>
    </div>
  );
}

function Collab() {
  const { t } = useLang();
  const K = INV.kolaborasi;
  return (
    <div className="inv-part" role="group" aria-labelledby="invCollab">
      <SubHead no={3} id="invCollab" title={t(K.judul)} lead={t(K.teks)} />
      <ul className="collab-grid">
        {K.poin.map((p) => (
          <li className="collab" data-reveal key={p.judul.id}>
            <span className="benefit__icon collab__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[p.ikon] || ICONS.lainnya}</svg>
            </span>
            <h4>{t(p.judul)}</h4>
            <p>{t(p)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Investasi() {
  const { t } = useLang();
  return (
    <section className="section invest" id="investasi" aria-labelledby="investTitle">
      <div className="container">
        <div className="invest__intro center" data-reveal>
          <p className="kicker">{t(INV.label_kecil)}</p>
          <h2 className="h2" id="investTitle">{t(INV.judul)}</h2>
          <p className="page-lead">{t(INV.teks)}</p>
        </div>
        <Plans />
        <Compare />
        <Collab />
      </div>
    </section>
  );
}
