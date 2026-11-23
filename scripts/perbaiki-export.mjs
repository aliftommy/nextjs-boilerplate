/* Dijalankan otomatis setelah `next build` (lihat package.json).

   Next.js 16 di Windows salah menamai file data prefetch saat ekspor statis: yang seharusnya
   out/menu/__next.menu.__PAGE__.txt malah ditulis sebagai folder out/menu/__next.menu/__PAGE__.txt
   (garis miring Windows ikut terbawa). Akibatnya browser mendapat 404 saat memprefetch halaman lain.
   Skrip ini meratakan folder-folder itu kembali menjadi satu nama file bertitik.
   Di Linux/macOS (mis. saat build di Vercel) folder seperti itu tidak ada, jadi skrip ini tidak mengubah apa pun. */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'out');
let fixed = 0;

async function flatten(dir, prefix, destDir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await flatten(p, prefix + '.' + e.name, destDir);
    else {
      await fs.rename(p, path.join(destDir, prefix + '.' + e.name));
      fixed++;
    }
  }
}

async function walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const p = path.join(dir, e.name);
    if (e.name.startsWith('__next.')) {
      await flatten(p, e.name, dir);
      await fs.rm(p, { recursive: true, force: true });
    } else if (e.name !== '_next') {
      await walk(p);
    }
  }
}

try {
  await walk(OUT);
  console.log(fixed ? `perbaiki-export: ${fixed} file data prefetch dirapikan.` : 'perbaiki-export: tidak ada yang perlu dirapikan.');
} catch (err) {
  if (err.code === 'ENOENT') console.log('perbaiki-export: folder out/ belum ada, lewati.');
  else throw err;
}
