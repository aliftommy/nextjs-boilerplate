import RAW from '@/data/informasi-website.json';

const rawPart = (pageName, partName) =>
  RAW.halaman.find((h) => h.nama === pageName).bagian.find((b) => b.nama === partName);

export const STORE_COUNT = rawPart('Lokasi', 'Daftar toko').toko.length;

function fill(v) {
  if (typeof v === 'string') return v.replaceAll('{jumlah_toko}', String(STORE_COUNT));
  if (Array.isArray(v)) return v.map(fill);
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x)]));
  return v;
}

const D = fill(RAW);

export const SITE = D.situs;
export const NAV = SITE.navigasi;
export const COMMON = D.bagian_di_semua_halaman;
export const POP = COMMON.pop_up_pilih_toko;
export const APPS = SITE.pesan_online;
export const ORDER_APPS = APPS.map((a) => a.aplikasi).filter((a) => a !== 'WhatsApp');

export function page(name) {
  return D.halaman.find((h) => h.nama === name);
}

export function part(pageName, partName) {
  const p = page(pageName);
  return p ? p.bagian.find((b) => b.nama === partName) : null;
}

const visible = (p) => p.tampil !== false;
const MENU_ALL = part('Menu', 'Daftar menu');
export const MENU = {
  ...MENU_ALL,
  kategori: MENU_ALL.kategori
    .map((c) => ({ ...c, produk: c.produk.filter(visible) }))
    .filter((c) => c.produk.length > 0),
};
export const ADDONS = part('Menu', 'Padu+++');

const favSeen = new Set();
export const FAVS = MENU.kategori
  .flatMap((c) => c.produk)
  .filter((p) => p.favorit && !favSeen.has(p.nama) && favSeen.add(p.nama));

export const CARD_APPS = [];

const PHOTO_FIRST = true;
export const STORE_PART = part('Lokasi', 'Daftar toko');
const STORES_JSON = STORE_PART.toko;
export const STORES = (PHOTO_FIRST
  ? [...STORES_JSON.filter((s) => s.foto), ...STORES_JSON.filter((s) => !s.foto)]
  : STORES_JSON
).map((s, i) => ({ ...s, no: String(i + 1).padStart(2, '0') }));

export const JOB_PART = part('Karir', 'Lowongan');
export const JOB = JOB_PART.lowongan;
export const JOB_OPEN = JOB.tampil !== false;
export const JOB_HREF = '/karir/barista-pinrang-sidrap/';

export function onApp(store, app) {
  return /^https?:/.test(store.link?.[app] || '');
}
export function countOn(app) {
  return STORES.filter((s) => onApp(s, app)).length;
}

export function href(link) {
  if (/^(https?:|mailto:|tel:)/.test(link)) return link;
  const m = /^\/([^#]*)(#.*)?$/.exec(link);
  if (!m) return link;
  return '/' + (m[1] ? m[1].replace(/\/?$/, '/') : '') + (m[2] || '');
}

export const WA_ORDER = SITE.pesan_pembuka_whatsapp.pemesanan.link;
