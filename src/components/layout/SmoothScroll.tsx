import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, lenisStore, prefersReducedMotion } from '@/lib/motion';

/** Lenis collegato al ticker di GSAP, così ScrollTrigger e lo scroll morbido restano allineati. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, touchMultiplier: 1.2 });
    lenisStore.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisStore.current = null;
    };
  }, []);
  return null;
}
