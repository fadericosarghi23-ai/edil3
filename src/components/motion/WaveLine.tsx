import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Il profilo di una lastra ondulata, disegnato come linea che si traccia allo scroll.
 * È il segno grafico ricorrente del sito (divisori, transizioni, hero).
 */
export function WaveLine({ className, waves = 24, amp = 7 }: { className?: string; waves?: number; amp?: number }) {
  const reduce = useReducedMotion();
  const W = 1200;
  const step = W / waves;
  let d = '';
  for (let x = 0; x <= W; x += 4) d += `${x ? 'L' : 'M'}${x} ${(amp + amp * Math.sin((x / step) * Math.PI * 2)).toFixed(2)} `;
  return (
    <svg viewBox={`0 -2 ${W} ${amp * 2 + 4}`} preserveAspectRatio="none" className={cn('block h-4 w-full', className)} aria-hidden>
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}
