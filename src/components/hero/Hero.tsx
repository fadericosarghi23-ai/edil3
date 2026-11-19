import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/layout/ButtonLink';
import { Label } from '@/components/site/Label';
import { T } from '@/data/site';
import { EASE_EXPO } from '@/lib/motion';
import { HeroPhoto, doneAt } from './HeroPhoto';

const INTRO = 0.12;

/**
 * Hero della home. La sezione è alta 220vh: mentre la si scorre, il fronte azzurro attraversa
 * il tetto della casa in foto e scopre la copertura nuova al posto delle lastre in fibrocemento.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const intro = useMotionValue(reduce ? 0.5 : 0);
  const progress = useMotionValue(reduce ? 0.5 : 0);

  useEffect(() => {
    if (reduce) return;
    const c = animate(intro, INTRO, { duration: 2.2, ease: [0.65, 0, 0.35, 1], delay: 1 });
    return () => c.stop();
  }, [intro, reduce]);

  const sync = () => {
    if (reduce) return;
    const s = scrollYProgress.get();
    const fromScroll = s > 0.001 ? INTRO + (1 - INTRO) * Math.min(1, s / 0.9) : 0;
    progress.set(Math.max(intro.get(), fromScroll));
  };
  useMotionValueEvent(scrollYProgress, 'change', sync);
  useMotionValueEvent(intro, 'change', sync);

  // quota di copertura già bonificata, per il contatore
  const [done, setDone] = useState(reduce ? Math.round(doneAt(0.5) * 100) : 0);
  useMotionValueEvent(progress, 'change', (p) => setDone(Math.round(doneAt(p) * 100)));

  // titolo: "Via l'amianto," si svuota, "tetto nuovo." si riempie
  const oldFill = useTransform(progress, [0.3, 0.62], ['#111111', 'rgba(17,17,17,0)']);
  const newFill = useTransform(progress, [0.45, 0.8], ['rgba(16,37,66,0)', '#102542']);
  const strike = useTransform(progress, [0.3, 0.62], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.85, 1], ['0%', '-12%']);

  return (
    <section ref={ref} className="relative h-[220vh] bg-white" aria-labelledby="hero-title">
      <div className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden">
        {/* foto prima/dopo con il fronte di bonifica */}
        <HeroPhoto progress={progress} scroll={scrollYProgress} />
        {/* velatura chiara dalla parte del titolo, per la leggibilità */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(244,247,250,0.92)_0%,rgba(244,247,250,0.8)_40%,rgba(244,247,250,0.1)_62%)] lg:bg-[linear-gradient(90deg,rgba(244,247,250,0.94)_0%,rgba(244,247,250,0.82)_30%,rgba(244,247,250,0.25)_48%,rgba(244,247,250,0)_58%)]" />

        {/* testo */}
        <motion.div style={{ y: textY }} className="container-e3 relative z-10 flex h-full flex-col pb-8 pt-[96px] lg:justify-center lg:pb-16 lg:pt-[84px]">
          <motion.div className="mb-6" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: EASE_EXPO, delay: 0.6 }}>
            <Label n="PV">Broni · Provincia di Pavia</Label>
          </motion.div>
          <h1 id="hero-title" className="display text-[3.4rem] sm:text-[5.5rem] lg:text-[8.2rem] xl:text-[9.4rem]">
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span className="relative inline-block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE_EXPO, delay: 0.5 }}>
                <motion.span style={{ color: oldFill, WebkitTextStroke: '2px #111111' }}>Via l’amianto,</motion.span>
                <motion.span aria-hidden className="absolute left-0 top-[52%] h-[0.07em] w-full origin-left bg-sky" style={{ scaleX: strike }} />
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span className="inline-block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: EASE_EXPO, delay: 0.62 }}>
                <motion.span style={{ color: newFill, WebkitTextStroke: '2px #102542' }}>tetto nuovo.</motion.span>
              </motion.span>
            </span>
          </h1>
          <motion.div className="mt-6 max-w-xl space-y-6 lg:mt-8" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE_EXPO, delay: 0.95 }}>
            <p className="text-pretty text-base text-text sm:text-lg">
              Bonifica amianto, coperture e costruzioni chiavi in mano a Broni, in provincia di Pavia. <span className="font-semibold text-navy">{T.homeClaim}.</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to="/contatti">
                Richiedi un sopralluogo <ArrowRight />
              </ButtonLink>
              <ButtonLink to="/servizi" variant="outline" className="bg-white">
                I servizi
              </ButtonLink>
            </div>
          </motion.div>

          {/* contatore e indicazione scroll */}
          <motion.div className="mt-auto flex items-end justify-between gap-6 pt-6 lg:absolute lg:inset-x-0 lg:bottom-8 lg:mx-auto lg:max-w-[88rem] lg:px-[clamp(1rem,4vw,3rem)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }}>
            <div className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.2em] text-navy">
              <ArrowDown className="size-4 animate-bounce text-sky-ink" />
              Scorri per bonificare
            </div>
            <div className="rounded-[3px] bg-white/85 px-4 py-2 text-right font-display uppercase text-navy shadow-sm backdrop-blur" aria-hidden>
              <div className="text-[0.7rem] tracking-[0.22em] text-muted-foreground">Copertura bonificata</div>
              <div className="text-3xl tabular-nums lg:text-4xl">
                {done}
                <span className="text-muted-foreground">%</span>
              </div>
              <div className="text-[0.6rem] normal-case tracking-normal text-muted-foreground">Immagine illustrativa</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
