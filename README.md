# Situs Kopi Padu Rasa (Next.js + GSAP)

Situs ini dibangun dengan **Next.js 16**, dan semua animasinya memakai **GSAP 3**. Hasil akhirnya file statis (HTML, CSS, JS) yang bisa diunggah ke hosting mana saja. Alamat situs: **https://kopipadurasa.com** (diatur di `lib/meta.js`).

Foto mentah (resolusi asli) disimpan di folder induk `D:\versi 2` (`foto produk`, `foto beranda`, `foto outlet`) sebagai bahan untuk membuat ulang file `.webp` di `public/img/`.

## Yang perlu dipasang

- **Node.js 20 atau lebih baru** (https://nodejs.org).
- Pertama kali saja, buka terminal di folder `nextjs` lalu jalankan `npm install`.

## Perintah

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Mode edit. Buka http://localhost:3000. Setiap file yang disimpan langsung terlihat di browser. |
| `npm run build` | Membuat situs siap unggah di folder `out/`. |
| `npm run preview` | Mencoba isi `out/` di komputer dan di HP lewat Wi-Fi yang sama (alamat "Di HP" muncul di terminal). |

**Mengunggah ke hosting:** jalankan `npm run build`, lalu unggah **isi** folder `out/` (bukan foldernya) ke hosting. Alamat halaman jadi bersih: `/menu/`, `/lokasi/`, `/kemitraan/`, `/karir/`. Lihat juga bagian **Hosting** di bawah.

Kalau HP tidak bisa membuka alamat `npm run preview`, Windows mungkin menanyakan izin firewall untuk Node.js. Pilih **Allow access**, termasuk jaringan **Public**. HP dan komputer juga harus di Wi-Fi yang sama.

## Struktur folder

```
app/                     halaman (satu folder per alamat)
  layout.js              kerangka semua halaman: font, header, footer, skrip bahasa di <head>
  globals.css            semua gaya (warna & ukuran diatur di :root paling atas)
  page.js                Beranda
  menu/ lokasi/ kemitraan/ karir/   halaman lain (judul tab & deskripsi Google ada di page.js-nya)
  not-found.js           halaman 404 (alamat yang tidak ada)
  sitemap.js, robots.js  sitemap.xml & robots.txt untuk Google
components/
  Header.js, Footer.js   header & footer bersama
  ui.js                  menu ponsel, pop-up "Mau pesan lewat mana?", pop-up "Pilih toko"
  lang.js                dua bahasa (Indonesia / English)
  reveal.js              efek muncul saat di-scroll
  ProductCard.js         kartu produk (Beranda & Menu)
  home/ menu/ lokasi/ kemitraan/ karir/   isi tiap halaman
data/informasi-website.json   semua teks, harga, menu, daftar toko
lib/data.js              pembaca JSON + daftar foto produk (SLUG) & foto toko (STORE_PHOTO)
lib/gsap.js              GSAP + plugin yang dipakai
lib/logo.js              garis logo (dilacak dari foto Logo Profil) untuk logo yang digores
lib/meta.js              pratinjau link (og:image) & alamat situs
public/img/              semua gambar (alamatnya /img/...)
public/.htaccess, public/_headers   pengaturan keamanan & cache untuk hosting (lihat bagian Hosting)
fonts/                   Alte Haas Grotesk
scripts/                 skrip pendukung build & preview
```

## Mengubah harga, menu, atau daftar toko

Edit `data/informasi-website.json`, lalu simpan. Di mode `npm run dev`, perubahan langsung tampil. Untuk situs yang diunggah, jalankan `npm run build` lagi.

**Dine in:** toko yang bisa dine in diberi `"dine_in": true` di daftar `toko` (saat ini BTP, Pallangga, dan Limbung). Kartunya menampilkan label **Dine in** dan **Takeaway**. Toko tanpa tanda itu hanya menampilkan **Takeaway**.

## Mengubah header atau footer

Edit `components/Header.js` atau `components/Footer.js`. Hasilnya langsung berlaku di semua halaman, dan link halaman yang sedang dibuka otomatis ditandai.

Pilihan bahasa ID/EN di header sedang dimatikan. Untuk menampilkannya lagi, ubah `SHOW_LANG_IN_HEADER = false` menjadi `true` di `components/Header.js`. Pilihan bahasa tetap ada di menu ponsel dan footer.

## Dua bahasa

- **Teks di halaman** ditulis sebagai `<T id="Teks Indonesia" en="English text" />`.
- **Teks dari JSON** memakai field `id`/`en`.
- **Penyimpanan pilihan:** bahasa pilihan pengunjung disimpan di browser.
- **Link langsung:** `?lang=en` membuka versi English, misalnya `/menu/?lang=en`.

## Animasi (GSAP)

| Bagian | File | Yang terjadi |
|---|---|---|
| Hero Beranda | `components/home/Hero.js` | Beranda dibuka langsung pertama kali per sesi: tirai krem dengan logo tergores, memudar begitu font & foto siap (paling lama ±2,2 detik). Kunjungan pertama per sesi: tulisan hero naik masuk berurutan, latar zoom keluar, stiker "ditempel" satu per satu dengan efek debu, label & badge muncul, panah tergambar. Setelah itu stiker "bernapas", awan bergeser, uap kopi naik, parallax mengikuti kursor. |
| Slider promo | `components/home/PromoSlider.js` | Geser halus antar-slide (ScrollTo), ganti otomatis tiap 5 detik |
| Muncul saat di-scroll | `components/reveal.js` | Elemen bertanda `data-reveal` naik & memudar masuk, bergantian; angka 30 berjalan dari 0 |
| Menu ponsel | `components/ui.js` | Panel memudar, baris menu naik satu per satu (pop-up pesan online muncul & hilang langsung, tanpa animasi) |
| Kategori menu | `components/menu/MenuPage.js` | Kategori yang sedang dibaca ditandai (ScrollTrigger), klik kategori menggulir halus |
| Foto toko | `components/lokasi/LokasiPage.js` | Foto membesar dari kartu ke tengah layar sambil membuka bagian yang terpotong, lalu kembali ke kartu saat ditutup |
| Kemitraan | `components/kemitraan/KemitraanPage.js` | Logo digores garis demi garis seperti tangan menggambar (satu garis selesai baru garis berikutnya), cincin berputar, garis alur terisi mengikuti scroll (ScrollTrigger scrub) |
| Karir | `components/karir/KarirPage.js` | Jejak terisi sepanjang jalan berkelok, tonggak menyala satu per satu |

Pengunjung yang mematikan animasi di pengaturan HP atau komputernya langsung melihat keadaan akhir, tanpa gerakan.

## Foto produk & toko

- **Foto produk:** taruh di `public/img/produk/<slug>.webp` (beserta `-besar`, `-hangat`, `-1l` bila ada), lalu tambahkan nama produknya ke `SLUG` di `lib/data.js`.
- **Foto toko:** setiap toko perlu tiga file di `public/img/toko/`:
  - `<file>-600.webp` dan `<file>-900.webp` untuk kartu (boleh dipotong).
  - `<file>-full.webp` untuk pop-up (foto utuh).

  Daftarkan tokonya di `STORE_PHOTO` di `lib/data.js`, misalnya `Pajjaiang: { file: 'pajjaiang', rasio: [1, 1], posisi: 0.5 }`.
  - `rasio` diisi rasio file kartu.
  - `posisi` diisi letak potongan kartu di foto utuh, supaya animasi pop-up pas. Foto tegak dipotong atas-bawah (0 = atas, 0.5 = tengah, 1 = bawah); foto mendatar dipotong kiri-kanan (0 = kiri, 0.5 = tengah, 1 = kanan).
  - Toko yang belum punya foto memakai logo (`public/img/toko/logo-600.webp` & `-900.webp`, dari `foto beranda/Logo Profil`) sebagai pengganti. Logo ini tidak bisa diklik. Matikan lewat `LOGO_FOR_NO_PHOTO` di `components/lokasi/LokasiPage.js`.
  - Sementara ini toko yang punya foto ditaruh paling atas (`PHOTO_FIRST` di `lib/data.js`). Ubah ke `false` untuk kembali ke urutan JSON.

## Logo

Semua logo berasal dari `foto beranda/Logo Profil.jpg.jpeg`:

| File | Dipakai di | Isi |
|---|---|---|
| `public/img/favicon.svg` (+ cadangan `favicon-32.png`, `favicon-64.png`) | ikon tab browser | garis logo tanpa latar: cokelat, krem saat browser bertema gelap |
| `public/img/apple-touch-icon.png` | ikon saat situs disimpan ke layar iPhone | foto, persegi |
| `public/img/logo.webp`, `public/img/toko/logo-600.webp` & `-900.webp` | ujung jalan di Karir, kartu toko tanpa foto | foto utuh |
| `lib/logo.js` | logo yang digores garis demi garis (tirai Beranda, hero Kemitraan) | garis logo yang dilacak dari foto |
| `public/img/logo-mark-light.svg` (krem) | header, footer, menu ponsel; logo samar di Seliter Padu, kartu & ajakan Kemitraan | garis yang sama dengan `lib/logo.js`, tanpa latar |
| `public/img/logo-mark.svg` (cokelat) | logo samar di latar judul halaman | garis yang sama, tanpa latar |

## Hosting

Isi `out/` sudah membawa dua file pengaturan. Hosting hanya membaca yang sesuai jenisnya, jadi keduanya boleh ikut diunggah:

| Hosting | File yang dipakai |
|---|---|
| cPanel, Hostinger, Niagahoster (Apache) | `.htaccess`. Ini **file tersembunyi**: aktifkan "Show hidden files" di File Manager / FTP supaya ikut terunggah. |
| Netlify, Cloudflare Pages | `_headers` |

Keduanya mengatur: header keamanan (CSP, anti-clickjacking, nosniff), cache (file `/_next/static/` disimpan browser 1 tahun karena namanya berubah tiap build; gambar 1 hari; halaman selalu dicek ulang), dan halaman 404. `.htaccess` juga menyalakan kompresi gzip. Sumbernya ada di `public/.htaccess` dan `public/_headers`.

Di panel hosting, nyalakan juga **SSL/HTTPS** dan **Force HTTPS** (paksa `http://` ke `https://`).

Hasil build juga berisi `sitemap.xml` dan `robots.txt` (dibuat dari `app/sitemap.js` dan `app/robots.js`). Setelah tayang, daftarkan `https://kopipadurasa.com/sitemap.xml` di Google Search Console.

## Sebelum tayang

- **Alamat situs:** `SITE_URL` di `lib/meta.js` berisi `https://kopipadurasa.com`. Dipakai untuk gambar pratinjau link WhatsApp/Facebook (`public/img/og-image.jpg`), `sitemap.xml`, dan `robots.txt`. Bila domain berubah, ganti di sana lalu `npm run build` lagi.
- **Toko Takalar:** link petunjuk arahnya masih pencarian Google Maps, belum link lokasi toko (di `data/informasi-website.json`).
- **Peta Google Maps** di halaman Lokasi belum dipasang (di JSON juga masih kosong).
- **Deskripsi Google** untuk Beranda, Menu, dan Lokasi masih draf. Ubah di `page.js` masing-masing.

## Catatan teknis

- **Build di Windows:** `npm run build` otomatis menjalankan `scripts/perbaiki-export.mjs`. Skrip itu membetulkan nama file data prefetch yang salah ditulis Next.js 16 di Windows (tanpa skrip ini, perpindahan halaman memunculkan error 404 di konsol). Di Linux/macOS skrip ini tidak mengubah apa pun.
- **Folder hasil:** folder `.next/` dan `out/` adalah hasil build, boleh dihapus kapan saja (matikan `npm run dev` dulu sebelum menghapus `.next/`).
- **Font:** dua file Alte Haas Grotesk di `fonts/` masih format TTF (±141 KB per file). Mengubahnya ke WOFF2 (lalu mengganti nama file di `app/layout.js`) bisa menghemat ±170 KB pada kunjungan pertama.
