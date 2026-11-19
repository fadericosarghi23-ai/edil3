import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';
import { useRef } from 'react';
import { Hero } from '@/components/hero/Hero';
import { PhotoWall } from '@/components/home/PhotoWall';
import { ServicesRail } from '@/components/home/ServicesRail';
import { ButtonA, ButtonLink } from '@/components/layout/ButtonLink';
import { CtaBand } from '@/components/layout/CtaBand';
import { Seo } from '@/components/layout/Seo';
import { Parallax, Reveal, SplitWords } from '@/components/motion/Reveal';
import { Label } from '@/components/site/Label';
import { SiteBoard } from '@/components/site/SiteBoard';
import { Stamp } from '@/components/site/Stamp';
import { TapeCross } from '@/components/site/Tape';
import { TapeMeasure } from '@/components/site/TapeMeasure';
import { Img } from '@/components/ui/img';
import { SITE, T } from '@/data/site';

/** lavorazioni citate nel testo originale "Costruzioni chiavi in mano" */
const FROM_TO = ['Fondamenta', 'Tetto', 'Imbiancatura', 'Pavimenti', 'Giardino', 'Recinzioni', 'Rivestimenti', 'Finiture di pregio'];

export default function Home() {
  const exc = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: exc, offset: ['start end', 'end start'] });
  const bigX = useTransform(scrollYProgress, [0, 1], ['6%', '-28%']);
  const photoY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <>
      <Seo
        title="Bonifica amianto e coperture a Broni (PV) | Edil 3"
        description="Edil 3 dei fratelli Jaupi, impresa edile a Broni (PV): bonifica e smaltimento amianto, rifacimento coperture, costruzioni e ristrutturazioni chiavi in mano. Sopralluogo e preventivo gratuiti."
        path="/"
      />
      <Hero />

      <TapeCross />

      {/* 01 · l'impresa: testo originale + cartello di cantiere */}
      <section className="relative overflow-hidden bg-white pb-24 pt-20 lg:pb-36 lg:pt-28">
        <div className="millimetrata pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] opacity-60 [mask-image:linear-gradient(90deg,transparent,#000_30%)] lg:block" aria-hidden />
        <div className="container-e3 relative grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Label n="01" className="mb-6">
              L’impresa
            </Label>
            <SplitWords as="h2" text={T.homeH1} className="display text-balance text-5xl sm:text-6xl lg:text-[5.2rem]" />
            <Reveal delay={0.15} className="mt-10">
              <p className="text-pretty text-lg leading-relaxed text-text first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-navy">{T.homeIntro}</p>
            </Reveal>
            <Reveal delay={0.25} className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/servizi">
                Servizi <ArrowRight />
              </ButtonLink>
              <ButtonA href={SITE.phoneHref} variant="outline">
                <Phone /> Chiama
              </ButtonA>
            </Reveal>
          </div>
          <div className="relative pt-14 lg:col-span-5 lg:col-start-8">
            <div className="absolute -right-6 top-24 hidden w-[70%] rotate-[4deg] overflow-hidden rounded-[3px] border-[6px] border-white shadow-xl lg:block" aria-hidden>
              <Img photo="foto-002" sizes="30vw" className="aspect-[4/3]" />
              <span className="absolute -left-4 top-3 h-6 w-20 -rotate-[30deg] bg-sky/80" />
            </div>
            <SiteBoard className="relative z-10 lg:mr-14 lg:mt-28" />
          </div>
        </div>
      </section>

      <ServicesRail />

      {/* 03 · costruzioni chiavi in mano: testo originale + metro da cantiere */}
      <section className="relative overflow-hidden bg-white py-24 lg:py-36">
        <div className="container-e3">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Label n="03" className="mb-6">
                Il punto di forza
              </Label>
              <SplitWords as="h2" text={T.homeKeyH2} className="display text-5xl sm:text-6xl lg:text-[6rem]" />
            </div>
            <div className="space-y-6 lg:col-span-6 lg:col-start-7 lg:pt-16">
              {T.homeKey.map((t) => (
                <Reveal key={t.slice(0, 20)}>
                  <p className="text-pretty text-lg leading-relaxed text-text">{t}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="mt-20 lg:mt-28">
            <TapeMeasure steps={FROM_TO} />
          </div>
        </div>
        <div className="container-e3 mt-24">
          <div className="relative h-[52vh] min-h-[320px] overflow-hidden rounded-[3px]">
            <Parallax speed={0.14} className="h-full">
              <Img photo="foto-001" sizes="100vw" alt="Getto di calcestruzzo in cantiere" />
            </Parallax>
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
            <p className="display absolute bottom-6 left-6 max-w-3xl text-4xl text-white sm:text-6xl lg:bottom-10 lg:left-10 lg:text-7xl">
              Dalle fondamenta <span className="text-sky">al tetto.</span>
            </p>
          </div>
        </div>
      </section>

      {/* 04 · l'eccellenza (testo originale) su tavola in negativo, con timbro */}
      <section ref={exc} className="millimetrata-dark relative overflow-hidden py-24 text-white lg:py-36">
        <motion.p aria-hidden style={{ x: bigX, ['--outline' as string]: 'rgba(116,185,252,0.4)' }} className="display text-outline pointer-events-none absolute top-6 whitespace-nowrap text-[9rem] lg:text-[17rem]">
          Eccellenza · Eccellenza
        </motion.p>
        <div className="container-e3 relative grid gap-14 pt-28 lg:grid-cols-12 lg:pt-56">
          <div className="lg:col-span-5">
            <Label n="04" dark className="mb-6">
              La missione
            </Label>
            <SplitWords as="h2" text={T.homeExcH2} className="display text-balance text-5xl text-white sm:text-6xl lg:text-7xl" />
            <div className="relative mt-12 hidden aspect-[4/5] max-w-sm overflow-hidden rounded-[3px] border-[6px] border-white/90 lg:block">
              <motion.div style={{ y: photoY }} className="absolute inset-[-10%_0]">
                <Img photo="foto-007" sizes="30vw" alt="Operaio con il casco in cantiere" />
              </motion.div>
            </div>
          </div>
          <div className="relative space-y-8 lg:col-span-6 lg:col-start-7 lg:pt-10">
            <Stamp className="absolute -top-28 right-0 size-40 sm:size-48 lg:-top-24 lg:right-4 lg:size-56" />
            {T.homeExc.map((t, i) => (
              <Reveal key={t.slice(0, 20)} delay={i * 0.12}>
                <p className={i === 0 ? 'text-pretty font-display text-2xl leading-snug text-white lg:text-[2rem]' : 'text-pretty text-lg leading-relaxed text-white/75'}>{t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PhotoWall />

      <CtaBand text={T.homeCta} />
    </>
  );
}
