/* Judul tab, deskripsi Google, dan pratinjau link (WhatsApp/Facebook) per halaman.
   SITE_URL = alamat lengkap situs, tanpa garis miring di akhir. Dipakai untuk gambar pratinjau link
   (og:image), sitemap.xml, dan robots.txt. Bila domain berubah, ganti di sini
   (atau isi SITE_URL=https://... di file .env.production). */
export const SITE_URL = (process.env.SITE_URL || 'https://kopipadurasa.com').replace(/\/+$/, '');

const OG_BASE = {
  type: 'website',
  siteName: 'Kopi Padu Rasa',
  locale: 'id_ID',
  alternateLocale: ['en_US'],
  ...(SITE_URL ? { images: ['/img/og-image.jpg'] } : {}),
};

export function pageMeta(title, description) {
  return { title, description, openGraph: { ...OG_BASE, title, description } };
}
