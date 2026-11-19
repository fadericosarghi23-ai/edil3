import { ArrowRight, Phone } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SITE } from '@/data/site';
import { SplitWords } from '@/components/motion/Reveal';
import { ButtonA, ButtonLink } from './ButtonLink';

const STRIPES = 'repeating-linear-gradient(-45deg,#102542 0 18px,#74b9fc 18px 36px)';

/** Fascia azzurra del sito attuale ("Per i tuoi lavori di edilizia, chiama e richiedi un preventivo gratuito!") */
export function CtaBand({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['8%', '-30%']);
  return (
    <section ref={ref} className="relative overflow-hidden bg-sky py-24 text-navy lg:py-32">
      <div aria-hidden className="absolute inset-x-0 top-0 h-4" style={{ backgroundImage: STRIPES }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-4" style={{ backgroundImage: STRIPES }} />
      <motion.p aria-hidden style={{ x }} className="display pointer-events-none absolute -top-4 left-0 whitespace-nowrap text-[9rem] leading-none text-navy/[0.07] lg:text-[15rem]">
        Sopralluogo gratuito · Preventivo gratuito · Sopralluogo gratuito
      </motion.p>
      <div className="container-e3 relative grid items-end gap-10 lg:grid-cols-[1.5fr_1fr]">
        <SplitWords as="h2" text={text} className="display text-balance text-[2.6rem] text-navy sm:text-6xl lg:text-7xl" />
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
          <ButtonLink to="/contatti" size="lg">
            Chiedi un preventivo <ArrowRight />
          </ButtonLink>
          <ButtonA href={SITE.phoneHref} variant="outline" size="lg">
            <Phone /> {SITE.phone}
          </ButtonA>
        </div>
      </div>
    </section>
  );
}
