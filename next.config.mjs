/** @type {import('next').NextConfig} */
const nextConfig = {
  // hasil build berupa file statis di folder out/, bisa diunggah ke hosting mana saja
  output: 'export',
  // /menu -> /menu/index.html, supaya alamat bersih jalan di semua hosting
  trailingSlash: true,
  // foto sudah dikompres sendiri (WebP), tidak perlu diolah Next.js
  images: { unoptimized: true },
  // hanya untuk `npm run dev`: izinkan membuka server dev dari perangkat lain di Wi-Fi yang sama
  // (mis. HP lewat http://192.168.110.127:3000). Tambahkan alamat lain di sini bila IP komputer berubah.
  allowedDevOrigins: ['192.168.110.127'],
};

export default nextConfig;
