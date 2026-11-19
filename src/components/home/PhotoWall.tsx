import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Label } from '@/components/site/Label';
import { Img } from '@/components/ui/img';
import { PHOTOS } from '@/data/site';

const ALT: Record<string, string> = {
  'foto-001': 'Getto di calcestruzzo con autopompa',
  'foto-002': 'Tecnico sulle scale di un edificio in costruzione',
  'foto-003': 'Stretta di mano in cantiere',
  'foto-004': 'Posa dei ferri di armatura',
  'foto-005': 'Operaio al lavoro su una copertura',
  'foto-006': 'Sopralluogo in cantiere',
  'foto-007': 'Operaio con il casco in mano davanti al cantiere',
};

/**
 * Le foto del sito attuale su due file che scorrono in versi opposti allo scroll,
 * fissate al muro con il nastro come le foto di cantiere.
 */
export function PhotoWall() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-22%', '0%']);
  const ids = PHOTOS.map((p) => p.id).sort();
  const rowA = [...ids, ...ids.slice(0, 2)];
  const rowB = [...ids.slice(3), ...ids, ...ids.slice(0, 1)];

  const card = (id: string, k: number) => (
    <figure key={`${id}-${k}`} className="group relative shrink-0" style={{ rotate: `${[-2, 1.5, -1, 2, -1.5][k % 5]}deg` }}>
      <div className="relative h-56 w-80 overflow-hidden border-[6px] border-white bg-white shadow-[0_20px_40px_-20px_rgba(16,37,66,0.5)] sm:h-72 sm:w-[26rem]">
        <Img photo={id} sizes="420px" alt={ALT[id] ?? ''} className="transition-[scale,filter] duration-700 group-hover:scale-105 [filter:saturate(0.85)] group-hover:[filter:saturate(1.1)]" />
      </div>
      <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-[-3deg] bg-sky/75 shadow-sm" />
      <figcaption className="mt-3 font-display text-xs uppercase tracking-[0.16em] text-navy/70">{ALT[id]}</figcaption>
    </figure>
  );

  return (
    <section ref={ref} className="millimetrata relative overflow-hidden py-24 lg:py-32" aria-labelledby="foto-title">
      <div className="container-e3 mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Label n="05" className="mb-5">
            In cantiere
          </Label>
          <h2 id="foto-title" className="display text-5xl sm:text-6xl lg:text-8xl">
            Il lavoro,
            <br />
            <span className="text-sky-ink">da vicino.</span>
          </h2>
        </div>
      </div>
      <motion.div style={reduce ? undefined : { x: x1 }} className="flex w-max gap-8 px-8">
        {rowA.map(card)}
      </motion.div>
      <motion.div style={reduce ? undefined : { x: x2 }} className="mt-12 flex w-max gap-8 px-8">
        {rowB.map((id, k) => card(id, k + 3))}
      </motion.div>
    </section>
  );
}
