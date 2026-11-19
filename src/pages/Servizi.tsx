import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CtaBand } from '@/components/layout/CtaBand';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { Reveal, SplitWords } from '@/components/motion/Reveal';
import { WaveLine } from '@/components/motion/WaveLine';
import { Img } from '@/components/ui/img';
import { SERVICES } from '@/data/services';
import { T } from '@/data/site';

export default function Servizi() {
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 26 });
  const y = useSpring(my, { stiffness: 220, damping: 26 });

  return (
    <>
      <Seo title="Servizi di edilizia civile e industriale a Broni (PV) | Edil 3" description="Bonifica amianto, coperture, costruzioni chiavi in mano, ristrutturazioni, impianti e manutenzione stabili a Broni e in provincia di Pavia. Sopralluoghi e preventivi gratuiti." path="/servizi" />
      <PageHeader eyebrow="Servizi" title={T.servH1} intro={T.servIntro} photo="foto-006" crumbs={[{ to: '/', label: 'Home' }, { to: '/servizi', label: 'Servizi' }]} />

      {/* indice servizi con anteprima che segue il cursore */}
      <section
        className="relative bg-white pb-24 lg:pb-36"
        onMouseMove={(e) => {
          mx.set(e.clientX);
          my.set(e.clientY);
        }}
      >
        <div className="container-e3">
          <WaveLine className="mb-4 text-sky" />
          <ul>
            {SERVICES.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={i * 0.06}>
                <Link
                  to={`/servizi/${s.slug}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-line py-7 transition-colors sm:gap-10 lg:py-10"
                >
                  <span className="font-display text-lg text-sky-ink">0{i + 1}</span>
                  <span>
                    <span className="display block text-[2.1rem] text-ink transition-[color,translate,scale] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-navy sm:text-6xl lg:text-7xl">{s.title}</span>
                    <span className="mt-2 block max-w-2xl text-sm text-muted-foreground sm:text-base">{s.lead}</span>
                  </span>
                  <span className="grid size-12 place-items-center rounded-full border border-navy text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-sky sm:size-16">
                    <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:rotate-45" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              key="prev"
              aria-hidden
              className="pointer-events-none fixed left-0 top-0 z-30 hidden w-80 overflow-hidden rounded-[3px] border-2 border-navy bg-white shadow-2xl lg:block"
              style={{ x, y, translateX: '-50%', translateY: '-110%' }}
              initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.35 }}
            >
              <PreviewTavola i={hover} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* testi originali della pagina Servizi */}
      <section className="bg-mist py-24 lg:py-36">
        <div className="container-e3 grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <SplitWords as="h2" text={T.servCivH2} className="display text-5xl sm:text-6xl" />
            {T.servCiv.map((t) => (
              <Reveal key={t.slice(0, 20)} className="mt-8">
                <p className="text-pretty text-lg text-text">{t}</p>
              </Reveal>
            ))}
          </div>
          <div className="lg:pt-40">
            <SplitWords as="h2" text={T.servFreeH2} className="display text-5xl text-navy sm:text-6xl" />
            {T.servFree.map((t) => (
              <Reveal key={t.slice(0, 20)} className="mt-8">
                <p className="text-pretty text-lg text-text">{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand text={T.servCta} />
    </>
  );
}

function PreviewTavola({ i }: { i: number }) {
  const s = SERVICES[i];
  return (
    <>
      <div className="flex justify-between border-b-2 border-navy px-3 py-1.5 font-display text-[0.7rem] uppercase tracking-[0.18em] text-navy">
        <span>Tav. 0{i + 1}</span>
        <span className="text-muted-foreground">{s.kicker}</span>
      </div>
      <div className="h-52 overflow-hidden">
        <Img photo={s.photo} sizes="320px" />
      </div>
    </>
  );
}
