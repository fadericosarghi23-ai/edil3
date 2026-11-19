/**
 * Ristrutturazioni, restauri e finiture. Sezione interattiva: configuratore della richiesta.
 * Il visitatore sceglie immobile, zona e lavori; il riepilogo precompila il modulo contatti.
 * Le voci vengono dai testi originali (casa, ufficio, capannone; restauro, finitura, murature,
 * pavimenti, infissi, rivestimenti). Non ci sono prezzi.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Building2, Factory, Home as HomeIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { InteractiveHead, ServiceLayout } from '@/components/service/ServiceLayout';
import { T } from '@/data/site';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

const TYPES = [
  { v: 'Casa', icon: HomeIcon },
  { v: 'Ufficio', icon: Building2 },
  { v: 'Capannone', icon: Factory },
];
const AREAS = ['Interni', 'Esterni', 'Interni ed esterni'];
const WORKS = ['Ristrutturazione completa', 'Opere di muratura', 'Restauro', 'Finiture', 'Pavimenti', 'Infissi', 'Rivestimenti', 'Imbiancatura'];

function Configurator() {
  const nav = useNavigate();
  const [type, setType] = useState<string | null>(null);
  const [area, setArea] = useState<string | null>(null);
  const [works, setWorks] = useState<string[]>([]);
  const steps = [type, area, works.length ? 'ok' : null];
  const done = steps.filter(Boolean).length;

  const summary = useMemo(() => {
    if (!type) return '';
    let s = `Vorrei un preventivo per ${type === 'Casa' ? 'una casa' : type === 'Ufficio' ? 'un ufficio' : 'un capannone'}`;
    if (area) s += `, lavori ${area === 'Interni ed esterni' ? 'interni ed esterni' : area === 'Interni' ? 'interni' : 'esterni'}`;
    if (works.length) s += `: ${works.join(', ').toLowerCase()}`;
    return s + '.';
  }, [type, area, works]);

  const chip = (on: boolean) => cn('rounded-full border-2 px-5 py-2.5 font-display text-base uppercase tracking-wide transition-colors duration-300', on ? 'border-navy bg-navy text-white' : 'border-line bg-white hover:border-navy');

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
      <div className="space-y-12">
        <fieldset>
          <legend className="mb-5 flex items-baseline gap-4">
            <span className="font-display text-sky-ink">01</span>
            <span className="display text-3xl lg:text-4xl">Che immobile è?</span>
          </legend>
          <div className="grid grid-cols-3 gap-3">
            {TYPES.map(({ v, icon: Icon }) => (
              <button key={v} type="button" aria-pressed={type === v} onClick={() => setType(v)} className={cn('flex flex-col items-center gap-3 rounded-[var(--radius)] border-2 px-3 py-6 transition-colors duration-300', type === v ? 'border-navy bg-navy text-white' : 'border-line bg-white hover:border-navy')}>
                <Icon className={cn('size-9 transition-transform duration-500', type === v ? 'scale-110 text-sky' : 'text-navy')} strokeWidth={1.5} />
                <span className="font-display text-base uppercase tracking-wide sm:text-lg">{v}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset disabled={!type} className="transition-opacity disabled:opacity-40">
          <legend className="mb-5 flex items-baseline gap-4">
            <span className="font-display text-sky-ink">02</span>
            <span className="display text-3xl lg:text-4xl">Dove si lavora?</span>
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {AREAS.map((a) => (
              <button key={a} type="button" aria-pressed={area === a} onClick={() => setArea(a)} className={chip(area === a)}>
                {a}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset disabled={!area} className="transition-opacity disabled:opacity-40">
          <legend className="mb-5 flex items-baseline gap-4">
            <span className="font-display text-sky-ink">03</span>
            <span className="display text-3xl lg:text-4xl">Quali lavori?</span>
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {WORKS.map((w) => {
              const on = works.includes(w);
              return (
                <button key={w} type="button" aria-pressed={on} onClick={() => setWorks((ws) => (on ? ws.filter((x) => x !== w) : [...ws, w]))} className={chip(on)}>
                  {w}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative overflow-hidden rounded-[var(--radius)] bg-navy p-8 text-white lg:p-10">
          <div className="corrugate pointer-events-none absolute inset-0 text-sky opacity-15" aria-hidden />
          <div className="relative">
            <p className="eyebrow text-sky">La vostra richiesta</p>
            <div className="mt-5 flex gap-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                  <motion.span className="block h-full bg-sky" initial={false} animate={{ width: steps[i] ? '100%' : '0%' }} transition={{ duration: 0.5, ease: EASE_EXPO }} />
                </span>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={summary || 'vuoto'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-8 min-h-[8rem] font-display text-2xl leading-snug lg:text-3xl" aria-live="polite">
                {summary || 'Scegliete l’immobile per iniziare.'}
              </motion.p>
            </AnimatePresence>
            <Button
              variant="sky"
              size="lg"
              className="mt-8 w-full"
              disabled={done < 3}
              onClick={() => nav(`/contatti?servizio=${encodeURIComponent('Ristrutturazione')}&messaggio=${encodeURIComponent(summary)}`)}
            >
              Continua nel modulo <ArrowRight />
            </Button>
            <p className="mt-4 text-xs text-white/60">Il testo viene copiato nel modulo contatti, dove potete completarlo. Il sopralluogo e il preventivo sono gratuiti.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Ristrutturazioni() {
  return (
    <ServiceLayout
      slug="ristrutturazioni-finiture"
      seoTitle="Ristrutturazioni, restauri e finiture a Broni (PV) | Edil 3"
      seoDescription="Ristrutturazioni interne ed esterne di case, uffici e capannoni: murature, restauri, pavimenti, infissi e finiture. Broni e provincia di Pavia, preventivo gratuito."
      quote={T.servCiv}
    >
      <section className="bg-mist py-24 lg:py-36">
        <div className="container-e3">
          <InteractiveHead eyebrow="Configuratore" title="Componete la vostra richiesta." text="Tre scelte e la richiesta è pronta: la trovate già scritta nel modulo contatti." />
          <Configurator />
        </div>
      </section>
    </ServiceLayout>
  );
}
