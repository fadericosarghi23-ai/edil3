import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SITE } from '@/data/site';
import { cn } from '@/lib/utils';

/**
 * Il cartello di cantiere: il formato che chiunque riconosce davanti a un lavoro edile,
 * usato per presentare l'impresa. Tutti i dati vengono dal sito attuale.
 * Appeso a due tasselli, oscilla e si raddrizza mentre entra nella vista.
 */
const ROWS: [string, string][] = [
  ['Impresa esecutrice', SITE.name],
  ['Sede', `${SITE.street}, ${SITE.cap} ${SITE.city} (${SITE.province})`],
  ['Lavori', 'Bonifica amianto, coperture, costruzioni e ristrutturazioni chiavi in mano'],
  ['Settore', 'Edilizia civile e industriale'],
  ['Sopralluogo e preventivo', 'Gratuiti'],
  ['Orari', `${SITE.hours[0].days} ${SITE.hours[0].time}`],
  ['Telefono', SITE.phone],
  ['Partita IVA', SITE.vat],
];

export function SiteBoard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const rot = useSpring(useTransform(scrollYProgress, [0, 1], [-7, 0]), { stiffness: 60, damping: 8, mass: 0.8 });

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* cavi */}
      <svg viewBox="0 0 400 60" className="absolute -top-12 left-0 h-14 w-full" aria-hidden preserveAspectRatio="none">
        <path d="M60 60 L120 0 M340 60 L280 0" stroke="#102542" strokeWidth="2" fill="none" />
      </svg>
      <motion.div style={reduce ? undefined : { rotate: rot, transformOrigin: '50% 0%' }} className="relative rounded-[3px] bg-white p-2 shadow-[0_30px_60px_-25px_rgba(16,37,66,0.55)] ring-1 ring-line">
        {[
          'left-3 top-3',
          'right-3 top-3',
          'left-3 bottom-3',
          'right-3 bottom-3',
        ].map((p) => (
          <span key={p} className={cn('absolute size-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff,#9aa3ad_60%,#56606b)] shadow-inner', p)} aria-hidden />
        ))}
        <div className="border-[3px] border-navy">
          <div className="flex items-center justify-between gap-4 bg-navy px-5 py-4 text-white">
            <img src="/brand/logo-light.svg" alt="EDIL3 dei F.lli Jaupi" width={1060} height={94} className="h-4 w-auto sm:h-5" loading="lazy" />
            <span className="font-display text-xs uppercase tracking-[0.2em] text-sky">Cartello di cantiere</span>
          </div>
          <dl className="divide-y-2 divide-navy/80">
            {ROWS.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8.5rem_1fr] sm:grid-cols-[11rem_1fr]">
                <dt className="border-r-2 border-navy/80 bg-mist px-3 py-2.5 font-display text-[0.72rem] uppercase leading-tight tracking-[0.12em] text-navy">{k}</dt>
                <dd className={cn('px-4 py-2.5 text-sm leading-snug text-ink', k === 'Sopralluogo e preventivo' && 'font-display text-lg uppercase tracking-wide text-navy')}>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="h-3" style={{ backgroundImage: 'repeating-linear-gradient(-45deg,#102542 0 10px,#74b9fc 10px 20px)' }} aria-hidden />
        </div>
      </motion.div>
    </div>
  );
}
