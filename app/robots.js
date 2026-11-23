/* robots.txt (hasil build: out/robots.txt): semua halaman boleh diindeks mesin pencari. */
import { SITE_URL } from '@/lib/meta';

export const dynamic = 'force-static'; // wajib untuk output: 'export'

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
