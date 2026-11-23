/* Semua teks, harga, menu, dan daftar toko dibaca dari data/informasi-website.json.
   Edit JSON-nya saja, lalu jalankan ulang `npm run dev` / `npm run build`. */
import D from '@/data/informasi-website.json';

export const DATA = D;

export function part(pageName, partName) {
  const p = D.halaman.find((h) => h.nama === pageName);
  return p ? p.bagian.find((b) => b.nama === partName) : null;
}

export const COMMON = D.bagian_di_semua_halaman;
export const POP = COMMON.pop_up_pilih_toko;
export const APPS = D.situs.pesan_online;
export const STORE_PART = part('Lokasi', 'Daftar toko');
export const STORES = STORE_PART.toko;
/* produk yang sementara disembunyikan dari situs (datanya di JSON tetap ada); kategori yang jadi kosong
   ikut tersembunyi beserta tombol kategorinya. Hapus nama dari daftar ini untuk menampilkannya lagi. */
export const HIDDEN_PRODUCTS = ['Tahu So']; // foto produk belum ada
const MENU_ALL = part('Menu', 'Daftar menu');
export const MENU = {
  ...MENU_ALL,
  kategori: MENU_ALL.kategori
    .map((c) => ({ ...c, produk: c.produk.filter((p) => !HIDDEN_PRODUCTS.includes(p.nama)) }))
    .filter((c) => c.produk.length > 0),
};
export const ADDONS = part('Menu', 'Padu+++');
export const FAVS = part('Beranda', 'Menu favorit');
export const ORDER_APPS = ['GoFood', 'GrabFood', 'ShopeeFood'];

/* aplikasi yang tampil di kartu halaman Lokasi (kosong = tidak ada), mis. ['GoFood', 'GrabFood', 'ShopeeFood'] */
export const CARD_APPS = [];

/* nama produk -> nama file foto di public/img/produk/<slug>.webp (+ -besar, -hangat, -1l) */
export const SLUG = {
  'Kopi Padu Krimi': 'kpk', 'Kopi Padu Aren': 'kpa', 'Kopi Padu Pandan': 'pandan',
  'Padu Karamel': 'karamel', 'Padu Kano': 'kano', Berikano: 'berikano',
  'Padu Coklat': 'coklat', 'Padu Matcha': 'matcha',
};

/* foto toko di kartu halaman Lokasi: nama toko -> public/img/toko/<file>-600.webp, -900.webp, -full.webp.
   rasio  = [lebar, tinggi] file -600/-900 (mis. [9, 16] foto tegak HP, [4, 3] foto mendatar); kartu ikut panjang fotonya.
   posisi = letak potongan kartu di foto utuh: 0 = paling atas, .5 = tengah, 1 = paling bawah
            (supaya animasi pop-up mulai tepat dari potongan yang tampil di kartu).
   Toko yang belum ada di sini tampil tanpa foto. */
export const STORE_PHOTO = { Pajjaiang: { file: 'pajjaiang', rasio: [9, 10], posisi: 0.55 } };

export const NOTE_EN = {
  'Minuman panas, satu ukuran.': 'Hot drinks, one size.',
  'Kemasan botol 1 liter.': 'In a 1-liter bottle.',
};

export function onApp(store, app) {
  return store.ada_di.includes(app) && /^https?:/.test(store.link[app] || '');
}
export function countOn(app) {
  return STORES.filter((s) => onApp(s, app)).length;
}

/* link di JSON ("/menu#pesan-online") -> alamat situs ("/menu/#pesan-online") */
export function href(link) {
  if (/^(https?:|mailto:|tel:)/.test(link)) return link;
  const m = /^\/([^#]*)(#.*)?$/.exec(link);
  if (!m) return link;
  return '/' + (m[1] ? m[1].replace(/\/?$/, '/') : '') + (m[2] || '');
}

export const WA_ORDER = D.situs.pesan_pembuka_whatsapp.pemesanan.link;
export const WA_MITRA = D.situs.pesan_pembuka_whatsapp.kemitraan.link;
export const WA_KARIR = D.situs.pesan_pembuka_whatsapp.karir.link;
