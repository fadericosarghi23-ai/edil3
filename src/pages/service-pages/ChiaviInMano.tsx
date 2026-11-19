/**
 * Costruzioni chiavi in mano. Sezione interattiva "Cosa resta a voi?": il visitatore affida
 * le lavorazioni a Edil 3 una alla volta; quando le affida tutte compare la frase originale
 * "A voi non resterà altro che il piacere di abitare...".
 * Le lavorazioni sono quelle elencate nel testo originale del sito.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, KeyRound, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { ButtonLink } from '@/components/layout/ButtonLink';
import { Img } from '@/components/ui/img';
import { Parallax, Reveal } from '@/components/motion/Reveal';
import { InteractiveHead, ServiceLayout } from '@/components/service/ServiceLayout';
import { T } from '@/data/site';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

const JOBS = ['Fondamenta', 'Struttura e murature', 'Tetto', 'Impianti', 'Infissi', 'Imbiancatura', 'Pavimenti', 'Rivestimenti', 'Finiture di pregio', 'Giardino e recinzioni'];

const FINAL = T.homeKey.join(' ').match(/A voi non resterà[^.]*\./)?.[0] ?? '';
const KEY_TEXT = T.homeKey.join(' ').replace(FINAL, '').trim();

function Board() {
  const [mine, setMine] = useState<Set<number>>(new Set());
  const all = mine.size === JOBS.length;
  const toggle = (i: number) =>
    setMine((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {JOBS.map((j, i) => {
          const on = mine.has(i);
          return (
            <motion.button
              key={j}
              type="button"
              onClick={() => toggle(i)}
              aria-pressed={on}
              layout
              whileTap={{ scale: 0.95 }}
              className={cn('group relative flex aspect-square flex-col justify-between overflow-hidden rounded-[var(--radius)] border-2 p-4 text-left transition-colors duration-300', on ? 'border-navy bg-navy text-white' : 'border-line bg-white hover:border-navy')}
            >
              <span className={cn('font-display text-sm', on ? 'text-sky' : 'text-muted-foreground')}>{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-lg uppercase leading-tight tracking-wide">{j}</span>
              <span className={cn('absolute right-3 top-3 grid size-7 place-items-center rounded-full transition-all duration-300', on ? 'scale-100 bg-sky text-navy' : 'scale-75 border border-line text-transparent')}>
                <Check className="size-4" />
              </span>
              <span className={cn('absolute inset-x-0 bottom-0 h-1 origin-left bg-sky transition-transform duration-500', on ? 'scale-x-100' : 'scale-x-0')} />
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-col justify-between rounded-[var(--radius)] bg-mist p-8 lg:p-10">
        <div>
          <p className="eyebrow text-muted-foreground">Affidato a Edil 3</p>
          <p className="display mt-2 text-8xl text-navy tabular-nums">
            {String(mine.size).padStart(2, '0')}
            <span className="text-4xl text-muted-foreground">/{JOBS.length}</span>
          </p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-line">
            <motion.div className="h-full bg-navy" animate={{ width: `${(mine.size / JOBS.length) * 100}%` }} transition={{ duration: 0.6, ease: EASE_EXPO }} />
          </div>
        </div>
        <AnimatePresence mode="wait">
          {all ? (
            <motion.div key="all" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-10" aria-live="polite">
              <motion.span className="mb-5 grid size-16 place-items-center rounded-full bg-sky text-navy" initial={{ rotate: -90 }} animate={{ rotate: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 12 }}>
                <KeyRound className="size-8" />
              </motion.span>
              <p className="font-display text-2xl leading-snug text-navy">{FINAL}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink to="/contatti?servizio=Costruzione%20chiavi%20in%20mano">
                  Parliamone <ArrowRight />
                </ButtonLink>
                <button type="button" onClick={() => setMine(new Set())} className="inline-flex items-center gap-2 px-2 font-display text-sm uppercase tracking-[0.14em] text-navy">
                  <RotateCcw className="size-4" /> Ricomincia
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="todo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-10">
              <p className="eyebrow text-muted-foreground">A voi resta</p>
              <p className="mt-3 text-lg text-text">{JOBS.filter((_, i) => !mine.has(i)).join(', ')}.</p>
              <button type="button" onClick={() => setMine(new Set(JOBS.map((_, i) => i)))} className="mt-6 inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.14em] text-navy underline decoration-sky decoration-2 underline-offset-8">
                Affida tutto
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ChiaviInMano() {
  return (
    <ServiceLayout
      slug="costruzioni-chiavi-in-mano"
      seoTitle="Costruzioni chiavi in mano a Broni (PV) | Edil 3"
      seoDescription="Case, villette, capannoni e fabbricati civili e industriali chiavi in mano: dalle fondamenta al tetto, dalle finiture al giardino. Broni, provincia di Pavia."
      quote={[KEY_TEXT]}
    >
      <section className="bg-white pb-24 lg:pb-36">
        <div className="container-e3">
          <InteractiveHead eyebrow="Chiavi in mano" title="Cosa resta a voi?" text="Toccate le lavorazioni che volete affidare all’impresa. Provate ad affidarle tutte." />
          <Board />
        </div>
      </section>
      <section className="relative h-[70vh] min-h-[420px] overflow-hidden">
        <Parallax speed={0.2} className="h-full">
          <Img photo="foto-004" sizes="100vw" alt="Posa dei ferri di armatura in cantiere" />
        </Parallax>
        <div className="absolute inset-0 bg-navy/45" />
        <div className="container-e3 absolute inset-x-0 bottom-12">
          <Reveal>
            <p className="display max-w-4xl text-5xl text-white sm:text-6xl lg:text-8xl">
              Dalle fondamenta
              <br />
              <span className="text-sky">al tetto.</span>
            </p>
          </Reveal>
        </div>
      </section>
    </ServiceLayout>
  );
}
