'use client';
/* Penanda di <html> + penyegar ScrollTrigger.
   - js / motion-ok: dipasang skrip <head> sebelum halaman tampil; dipasang ulang di sini untuk jaga-jaga
     (React bisa mengatur ulang atribut <html> saat pengembangan).
   - app-ready: tanda JavaScript situs sudah jalan. Bila tidak muncul dalam 5 detik, skrip <head> mencabut
     motion-ok supaya konten yang menunggu animasi tetap tampil.
   - Tinggi halaman berubah (foto selesai dimuat, pindah halaman, ganti bahasa): posisi pemicu scroll dihitung ulang. */
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import { ScrollTrigger, motionOK } from '@/lib/gsap';

export default function AppEffects() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const c = document.documentElement.classList;
    c.add('js');
    if (motionOK()) c.add('motion-ok');
    c.add('app-ready');
  }, []);

  useEffect(() => {
    let t = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
