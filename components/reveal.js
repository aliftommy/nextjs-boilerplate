'use client';
import { gsap, ScrollTrigger, useGSAP, motionOK, EASE_OUT } from '@/lib/gsap';

function countUp(el) {
  const to = +el.getAttribute('data-count');
  if (!to) return;
  const o = { v: 0 };
  gsap.to(o, { v: to, duration: 1.3, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); } });
}

export function useReveal(scope) {
  useGSAP(() => {
    const els = scope.current ? [...scope.current.querySelectorAll('[data-reveal]')] : [];
    if (!els.length) return;
    if (!motionOK()) { gsap.set(els, { opacity: 1 }); return; }
    ScrollTrigger.batch(els, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => {
        gsap.fromTo(batch, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.85, ease: EASE_OUT, stagger: 0.09, overwrite: true });
        batch.forEach((el) => el.querySelectorAll('[data-count]').forEach(countUp));
      },
    });
  }, { scope });
}
