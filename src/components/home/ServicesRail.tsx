import { ArrowUpRight } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DRAWINGS } from '@/components/site/Drawings';
import { Label } from '@/components/site/Label';
import { Img } from '@/components/ui/img';
import { SERVICES } from '@/data/services';
import { gsap, prefersReducedMotion } from '@/lib/motion';

/**
 * I 5 servizi come tavole di progetto su carta millimetrata: su desktop la sezione si blocca
 * e le tavole scorrono di lato; all'hover la tavola passa "in negativo" (navy e azzurro).
 */
export function ServicesRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: () => `+=${distance()}`, scrub: 0.8, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      gsap.utils.toArray<HTMLElement>('[data-rail-card]').forEach((card, i) => {
        gsap.fromTo(card, { rotate: i % 2 ? 2.5 : -2.5, y: 40 }, { rotate: 0, y: 0, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden bg-mist py-20 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pb-0 lg:pt-20">
      <div className="container-e3 mb-10 flex flex-wrap items-end justify-between gap-6 lg:mb-10">
        <div>
          <Label n="02" className="mb-5">
            Servizi
          </Label>
          <h2 className="display text-5xl sm:text-6xl lg:text-8xl">
            Cinque mestieri,
            <br />
            <span className="text-sky-ink">un’impresa sola.</span>
          </h2>
        </div>
        <Link to="/servizi" className="group inline-flex items-center gap-2 border-b-2 border-navy pb-1 font-display uppercase tracking-[0.14em] text-navy">
          Tutti i servizi <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div ref={track} className="flex flex-col gap-6 px-[clamp(1rem,4vw,3rem)] lg:w-max lg:flex-row lg:gap-8 lg:pl-[max(clamp(1rem,4vw,3rem),calc((100vw-88rem)/2+clamp(1rem,4vw,3rem)))] lg:pr-[12vw]">
        {SERVICES.map((s, i) => {
          const D = DRAWINGS[s.slug];
          return (
            <Link
              key={s.slug}
              to={`/servizi/${s.slug}`}
              data-rail-card
              className="group relative flex flex-col overflow-hidden rounded-[3px] border-2 border-navy bg-white text-navy shadow-[0_24px_50px_-28px_rgba(16,37,66,0.6)] lg:h-[64vh] lg:w-[min(31rem,36vw)]"
            >
              <div className="millimetrata absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" />
              <div className="millimetrata-dark absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* intestazione della tavola */}
              <div className="relative flex items-center justify-between border-b-2 border-navy bg-white/80 px-5 py-3 transition-colors duration-500 group-hover:border-sky/40 group-hover:bg-navy">
                <span className="font-display text-sm uppercase tracking-[0.18em] transition-colors group-hover:text-sky">Tav. 0{i + 1}</span>
                <span className="font-display text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors group-hover:text-white/60">{s.kicker}</span>
              </div>
              {/* foto del sito; all'hover sopra compare la tavola disegnata */}
              <div className="relative min-h-[15rem] flex-1 overflow-hidden">
                <Img photo={s.photo} sizes="(min-width:1024px) 36vw, 100vw" alt={s.title} className="transition-[scale] duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
                <div className="absolute inset-0 bg-navy/0 transition-colors duration-500 group-hover:bg-navy/80" />
                <div className="millimetrata-dark absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center px-6 py-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <D className="w-full max-w-[22rem] text-sky" />
                </div>              </div>
              {/* cartiglio */}
              <div className="relative grid grid-cols-[1fr_auto] border-t-2 border-navy bg-white transition-colors duration-500 group-hover:border-sky/40 group-hover:bg-navy">
                <div className="border-r-2 border-navy px-5 py-4 transition-colors group-hover:border-sky/40">
                  <h3 className="display hyphens-auto break-words text-3xl text-ink transition-colors group-hover:text-white lg:text-[2.3rem]">{s.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-text transition-colors group-hover:text-white/70">{s.lead}</p>
                </div>
                <span className="grid w-20 place-items-center bg-navy text-sky transition-colors duration-500 group-hover:bg-sky group-hover:text-navy">
                  <ArrowUpRight className="size-7 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
