import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const root = path.join(process.cwd(), 'out');
const port = Number(process.argv[2]) || 8080;

const TIPE = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2',
};

if (!fs.existsSync(root)) {
  console.error('Folder out/ belum ada. Jalankan dulu: npm run build');
  process.exit(1);
}

function send(res, file, status = 200) {
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) {
      if (status === 200) return send(res, path.join(root, '404.html'), 404);
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Tidak ditemukan');
    }
    res.writeHead(status, {
      'Content-Type': TIPE[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  let rel;
  try { rel = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end('Alamat tidak valid'); }
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(root, path.normalize(rel));
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Dilarang'); }
  send(res, file);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') console.error(`Port ${port} sedang dipakai. Coba port lain: npm run preview -- ${port + 1}`);
  else console.error(e.message);
  process.exit(1);
});

server.listen(port, '0.0.0.0', () => {
  console.log('Server berjalan. Hentikan dengan Ctrl+C.\n');
  console.log(`  Di komputer ini : http://localhost:${port}/`);
  Object.values(os.networkInterfaces()).flat()
    .filter((a) => a && a.family === 'IPv4' && !a.internal && !a.address.startsWith('169.254.'))
    .forEach((a) => console.log(`  Di HP           : http://${a.address}:${port}/`));
  console.log('\nKalau HP tidak bisa membuka: izinkan Node.js di Windows Firewall (lihat README).');
});
