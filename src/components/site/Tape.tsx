import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

const WORDS = ['Bonifica amianto', 'Coperture', 'Impermeabilizzazioni', 'Costruzioni chiavi in mano', 'Ristrutturazioni', 'Coibentazioni', 'Impianti', 'Manutenzione stabili'];

/**
 * Nastro da cantiere nei colori del marchio: strisce oblique e scritte che scorrono.
 * La velocità segue quella dello scroll (e cambia verso se si torna su).
 */
export function Tape({ className, reverse, tone = 'navy', speed = 40 }: { className?: string; reverse?: boolean; tone?: 'navy' | 'sky'; speed?: number }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-2000, 0, 2000], [-4, 1, 4], { clamp: false });
  const dir = useRef(reverse ? -1 : 1);
  const x = useTransform(base, (v) => `${((v % 50) + 50) % 50 - 50}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) dir.current = reverse ? 1 : -1;
    else if (f > 0) dir.current = reverse ? -1 : 1;
    base.set(base.get() + dir.current * speed * 0.0004 * (delta / 16) * (1 + Math.abs(f)));
  });

  const stripe =
    tone === 'navy'
      ? 'repeating-linear-gradient(-45deg,#102542 0 18px,#74b9fc 18px 36px)'
      : 'repeating-linear-gradient(-45deg,#74b9fc 0 18px,#ffffff 18px 36px)';
  const row = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center">
          <span className="display whitespace-nowrap px-6 text-[1.6rem] sm:text-4xl">{w}</span>
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 sm:size-6" aria-hidden>
            <path d="M3 3l18 18M21 3L3 21" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn('relative w-[110%] -translate-x-[5%] overflow-hidden shadow-[0_10px_30px_-12px_rgba(16,37,66,0.45)]', className)} aria-hidden>
      <div className="h-3" style={{ backgroundImage: stripe }} />
      <div className={tone === 'navy' ? 'bg-navy py-3 text-white' : 'bg-sky py-3 text-navy'}>
        <motion.div className="flex w-max" style={{ x }}>
          {row}
          {row}
          {row}
          {row}
        </motion.div>
      </div>
      <div className="h-3" style={{ backgroundImage: stripe }} />
    </div>
  );
}

/** Due nastri incrociati, come all'ingresso di un cantiere */
export function TapeCross() {
  return (
    <section className="relative z-10 -my-12 overflow-hidden py-20" aria-label="Lavorazioni">
      <Tape className="-rotate-[3.5deg]" tone="sky" speed={36} />
      <Tape className="-mt-[72px] rotate-[3deg] sm:-mt-[84px]" reverse speed={44} />
      <span className="sr-only">Bonifica amianto, coperture, impermeabilizzazioni, costruzioni chiavi in mano, ristrutturazioni, coibentazioni, impianti, manutenzione stabili.</span>
    </section>
  );
}
