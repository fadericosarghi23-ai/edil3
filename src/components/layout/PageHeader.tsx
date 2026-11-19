import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Img } from '@/components/ui/img';
import { EASE_EXPO } from '@/lib/motion';
import { SplitWords } from '@/components/motion/Reveal';
import { Label } from '@/components/site/Label';

type Crumb = { to: string; label: string };

/** Intestazione delle pagine interne: titolo enorme, foto che scorre in parallasse dietro una lastra. */
export function PageHeader({ eyebrow, title, intro, photo, crumbs, index, children, aside }: { eyebrow: string; title: string; intro?: string; photo?: string; crumbs: Crumb[]; index?: string; children?: ReactNode; aside?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const clip = useTransform(scrollYProgress, [0, 1], ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 30%)']);
  return (
    <section ref={ref} className={`relative overflow-hidden bg-white pb-16 pt-[112px] lg:pt-[148px] ${photo ? "lg:pb-32" : "lg:pb-24"}`}>
      <div className="millimetrata pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(180deg,#000,transparent_85%)]" aria-hidden />
      <div className="container-e3 relative z-10">
        <nav aria-label="Percorso" className="mb-8 text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((c, i) => (
              <li key={c.to} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {i < crumbs.length - 1 ? (
                  <Link to={c.to} className="hover:text-navy">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-ink">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <motion.div className="mb-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.5 }}>
          <Label n={index}>{eyebrow}</Label>
        </motion.div>
        <SplitWords as="h1" text={title} delay={0.45} className={`display hyphens-auto text-balance text-[3.1rem] sm:text-7xl lg:text-[6.6rem] ${photo ? "lg:max-w-[58%]" : "max-w-[14ch]"}`} />
        {intro && (
          <motion.p className="mt-8 max-w-2xl text-pretty text-lg text-text lg:max-w-[52%]" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.8 }}>
            {intro}
          </motion.p>
        )}
        {children}
      </div>
      {photo && (
        <motion.div style={{ clipPath: clip }} className="relative mt-14 h-[44vh] min-h-[260px] overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-auto lg:w-[38%]">
          <motion.div style={{ y }} className="absolute inset-[-10%_0]">
            <Img photo={photo} sizes="(min-width:1024px) 40vw, 100vw" priority />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/0 to-transparent max-lg:hidden" />
        </motion.div>
      )}
      {aside && (
        <motion.div className="relative z-20 mx-[clamp(1rem,4vw,3rem)] -mt-24 w-[min(20rem,calc(100%-2rem))] lg:absolute lg:bottom-8 lg:right-[clamp(1rem,4vw,3rem)] lg:mx-0 lg:mt-0 lg:w-[17rem] xl:w-[19rem]" initial={{ opacity: 0, y: 40, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: -2 }} transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.9 }}>
          {aside}
        </motion.div>
      )}
    </section>
  );
}
