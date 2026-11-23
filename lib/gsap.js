'use client';
/* Satu tempat untuk GSAP + plugin yang dipakai situs. Komponen mengimpor dari sini,
   jadi plugin pasti sudah terdaftar sebelum dipakai. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';

/* Garis SVG yang "tergambar" (panah label, logo Kemitraan, jalan Karir, uap kopi) memakai atribut
   pathLength="1", jadi cukup dianimasikan lewat strokeDashoffset 1 -> 0 tanpa plugin tambahan.
   PENTING: beri autoRound: false pada tween-nya. Bawaan GSAP membulatkan nilai CSS berpiksel ke bilangan
   bulat, sehingga 0..1 hanya jadi 0 atau 1 (garis muncul sekaligus, tidak tergambar). */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);
}

/* gerak yang dipakai bersama, setara dengan --ease-out / --ease-back di CSS */
export const EASE_OUT = 'power3.out';
export const EASE_BACK = 'back.out(1.7)';

/* pengunjung yang mematikan animasi di pengaturan perangkat: semua langsung ke keadaan akhir */
export function motionOK() {
  return typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger, useGSAP };
