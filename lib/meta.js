import { page } from './data';

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

export function metaOf(name) {
  const p = page(name);
  return pageMeta(p.judul_tab.id, p.deskripsi_google);
}
