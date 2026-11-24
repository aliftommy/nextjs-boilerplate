import { SITE_URL } from '@/lib/meta';

export const dynamic = 'force-static';

const PAGES = [
  { path: '/', priority: 1 },
  { path: '/menu/', priority: 0.9 },
  { path: '/lokasi/', priority: 0.9 },
  { path: '/kemitraan/', priority: 0.7 },
  { path: '/karir/', priority: 0.6 },
];

export default function sitemap() {
  const now = new Date();
  return PAGES.map((p) => ({ url: SITE_URL + p.path, lastModified: now, changeFrequency: 'monthly', priority: p.priority }));
}
