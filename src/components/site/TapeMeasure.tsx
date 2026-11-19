import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * Metro da cantiere che si srotola allo scroll: le tacche sono le lavorazioni
 * del testo originale ("dalle fondamenta al tetto, dall'imbiancatura alla posa dei pavimenti...").
 */
export function TapeMeasure({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 40%'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });
  const width = useTransform(p, [0, 1], ['6%', '100%']);
  const spin = useTransform(p, [0, 1], [0, 720]);

  return (
    <div ref={ref} className="relative pl-16 sm:pl-24" aria-label="Le lavorazioni, dalle fondamenta al tetto">
      {/* cassa del metro */}
      <div className="absolute left-0 top-8 z-10 grid size-20 -translate-y-1/2 place-items-center rounded-2xl bg-navy shadow-xl sm:top-10 sm:size-28" aria-hidden>
        <motion.div style={reduce ? undefined : { rotate: spin }} className="grid size-12 place-items-center rounded-full border-4 border-sky/60 sm:size-16">
          <span className="size-3 rounded-full bg-sky" />
        </motion.div>
        <span className="absolute -right-1 top-1/2 h-8 w-2 -translate-y-1/2 rounded-sm bg-navy-deep" />
      </div>
      {/* nastro */}
      <div className="relative h-16 sm:h-20">
        <motion.div style={{ width: reduce ? '100%' : width }} className="absolute inset-y-0 left-0 overflow-hidden rounded-r-sm bg-sky shadow-[inset_0_-3px_0_rgba(16,37,66,0.25)]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg,#102542 0 2px,transparent 2px 100px),repeating-linear-gradient(90deg,#102542 0 1.5px,transparent 1.5px 50px),repeating-linear-gradient(90deg,rgba(16,37,66,.7) 0 1px,transparent 1px 10px)',
              backgroundSize: '100% 60%, 100% 40%, 100% 22%',
              backgroundRepeat: 'no-repeat',
              width: '100vw',
            }}
          />
          <div className="absolute inset-x-0 bottom-1.5 flex w-[100vw]">
            {Array.from({ length: 40 }, (_, i) => (
              <span key={i} className="w-[100px] shrink-0 pl-1 font-display text-xs text-navy">
                {i * 10}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
      {/* tacche con le lavorazioni */}
      <ol className="mt-10 grid gap-x-6 gap-y-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => {
          const at = (i + 1) / (steps.length + 0.4);
          return <Step key={s} label={s} n={i + 1} at={at} p={p} />;
        })}
      </ol>
    </div>
  );
}

function Step({ label, n, at, p }: { label: string; n: number; at: number; p: ReturnType<typeof useSpring> }) {
  const o = useTransform(p, [at - 0.12, at], [0.25, 1]);
  const y = useTransform(p, [at - 0.12, at], [16, 0]);
  return (
    <motion.li style={{ opacity: o, y }} className="border-t-2 border-navy pt-3">
      <span className="font-display text-sm text-sky-ink">{String(n).padStart(2, '0')}</span>
      <p className="display mt-1 text-2xl text-ink lg:text-3xl">{label}</p>
    </motion.li>
  );
}
