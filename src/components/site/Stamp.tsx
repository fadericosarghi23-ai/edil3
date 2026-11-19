import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Timbro a inchiostro che "batte" sulla pagina quando entra nella vista. */
export function Stamp({ className, top = 'EDIL3 · F.LLI JAUPI · BRONI (PV) ·', center = 'Edilizia', sub = 'pavese' }: { className?: string; top?: string; center?: string; sub?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn('pointer-events-none select-none', className)}
      initial={reduce ? false : { scale: 1.8, opacity: 0, rotate: -24 }}
      whileInView={{ scale: 1, opacity: 1, rotate: -11 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 16, mass: 0.9 }}
      aria-hidden
    >
      <svg viewBox="0 0 200 200" className="h-full w-full text-sky">
        <defs>
          <path id="stamp-c" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1 -148 0" />
          <filter id="stamp-ink">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.35" />
            <feComposite in="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter="url(#stamp-ink)" fill="currentColor" stroke="currentColor">
          <circle cx="100" cy="100" r="94" fill="none" strokeWidth="5" />
          <circle cx="100" cy="100" r="56" fill="none" strokeWidth="2.5" />
          <text fontFamily="Oswald" fontWeight="600" fontSize="17" letterSpacing="4.2" stroke="none">
            <textPath href="#stamp-c">{top} {top}</textPath>
          </text>
          <text x="100" y="98" textAnchor="middle" fontFamily="Oswald" fontWeight="700" fontSize="26" letterSpacing="1" stroke="none" style={{ textTransform: 'uppercase' }}>
            {center.toUpperCase()}
          </text>
          <text x="100" y="124" textAnchor="middle" fontFamily="Oswald" fontWeight="500" fontSize="16" letterSpacing="5" stroke="none">
            {sub.toUpperCase()}
          </text>
        </g>
      </svg>
    </motion.div>
  );
}
