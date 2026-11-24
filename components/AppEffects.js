'use client';
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
