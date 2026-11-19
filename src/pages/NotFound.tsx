import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ButtonLink } from '@/components/layout/ButtonLink';
import { Seo } from '@/components/layout/Seo';
import { EASE_EXPO } from '@/lib/motion';

export default function NotFound() {
  return (
    <>
      <Seo title="Pagina non trovata | Edil 3" description="La pagina cercata non esiste." path="/404" />
      <section className="relative flex min-h-[90svh] items-center overflow-hidden bg-white pt-24">
        <div className="corrugate pointer-events-none absolute inset-0 text-navy opacity-[0.06]" aria-hidden />
        <div className="container-e3 relative">
          <motion.p className="display text-[9rem] leading-none text-navy sm:text-[14rem]" initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: EASE_EXPO, delay: 0.4 }}>
            4<span className="text-sky">0</span>4
          </motion.p>
          <h1 className="display mt-4 text-4xl sm:text-6xl">Qui manca una lastra.</h1>
          <p className="mt-6 max-w-lg text-lg text-text">La pagina che cercate non esiste o è stata spostata.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink to="/">
              Torna alla home <ArrowRight />
            </ButtonLink>
            <ButtonLink to="/servizi" variant="outline">
              Servizi
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
