/**
 * Bonifica amianto. Sezioni interattive: quiz "Il mio tetto può contenere amianto?" e percorso a tappe.
 * TESTI SCRITTI DA ALTALOGIK (quiz e tappe): da far confermare al cliente, in particolare
 * quali passaggi (piano di lavoro, trasporto, smaltimento) gestisce direttamente l'impresa.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/layout/ButtonLink';
import { Counter, Reveal } from '@/components/motion/Reveal';
import { InteractiveHead, ServiceLayout } from '@/components/service/ServiceLayout';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Q = { id: string; q: string; opts: { v: string; l: string }[] };
const QUIZ: Q[] = [
  {
    id: 'anno',
    q: 'Quando è stata posata la copertura?',
    opts: [
      { v: 'prima', l: 'Prima del 1992' },
      { v: 'dopo', l: 'Dopo il 1992' },
      { v: 'nonso', l: 'Non lo so' },
    ],
  },
  {
    id: 'tipo',
    q: 'Com’è fatto il tetto?',
    opts: [
      { v: 'ondulate', l: 'Lastre ondulate grigie' },
      { v: 'tegole', l: 'Tegole o coppi' },
      { v: 'metallo', l: 'Pannelli metallici' },
      { v: 'nonso', l: 'Non lo so' },
    ],
  },
  {
    id: 'stato',
    q: 'In che condizioni sono le lastre?',
    opts: [
      { v: 'integre', l: 'Integre' },
      { v: 'rovinate', l: 'Crepe, muschio o bordi sfaldati' },
      { v: 'nonso', l: 'Non lo so' },
    ],
  },
];

function verdict(a: Record<string, string>) {
  const old = a.anno !== 'dopo';
  const cement = a.tipo === 'ondulate' || a.tipo === 'nonso';
  if (old && cement && a.stato === 'rovinate')
    return { level: 3, title: 'Meglio non aspettare', text: 'Una copertura posata prima del 1992 con lastre rovinate va fatta vedere al più presto. Richiedete un sopralluogo gratuito: valuteremo insieme come intervenire.' };
  if (old && cement)
    return { level: 2, title: 'Vale la pena verificare', text: 'Le lastre ondulate posate prima del 1992 possono contenere amianto. Solo un’analisi su un campione lo conferma: con un sopralluogo gratuito capiamo da dove partire.' };
  return { level: 1, title: 'Probabilmente no, ma togliamo il dubbio', text: 'Dalle risposte l’amianto è poco probabile. Se avete dubbi o il tetto ha bisogno di lavori, un sopralluogo gratuito vi dà una risposta certa.' };
}

function Quiz() {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState<Record<string, string>>({});
  const done = step >= QUIZ.length;
  const v = done ? verdict(ans) : null;

  return (
    <div className="grid overflow-hidden rounded-[var(--radius)] bg-white text-ink shadow-2xl shadow-black/30 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="relative flex flex-col justify-between gap-10 bg-sky p-8 text-navy lg:p-12">
        <div>
          <p className="eyebrow">{done ? 'Esito' : 'Domanda'}</p>
          <p className="display mt-2 text-[7rem] leading-none lg:text-[9rem]">
            {done ? '✓' : `0${step + 1}`}
            <span className="text-4xl text-navy/50">/0{QUIZ.length}</span>
          </p>
        </div>
        <div className="flex gap-2">
          {QUIZ.map((q, i) => (
            <span key={q.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy/15">
              <motion.span className="block h-full bg-navy" initial={false} animate={{ width: i < step ? '100%' : '0%' }} transition={{ duration: 0.6, ease: EASE_EXPO }} />
            </span>
          ))}
        </div>
      </div>
      <div className="relative min-h-[26rem] p-8 lg:p-12">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.fieldset key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.45, ease: EASE_EXPO }}>
              <legend className="display mb-8 text-3xl lg:text-5xl">{QUIZ[step].q}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {QUIZ[step].opts.map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => {
                      setAns((a) => ({ ...a, [QUIZ[step].id]: o.v }));
                      setStep((s) => s + 1);
                    }}
                    className="group flex items-center justify-between gap-4 rounded-[var(--radius)] border-2 border-line px-5 py-4 text-left font-display text-lg uppercase tracking-wide transition-colors duration-300 hover:border-navy hover:bg-navy hover:text-white"
                  >
                    {o.l}
                    <ArrowRight className="size-5 shrink-0 text-sky-ink transition-transform group-hover:translate-x-1 group-hover:text-sky" />
                  </button>
                ))}
              </div>
            </motion.fieldset>
          ) : (
            <motion.div key="res" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_EXPO }} aria-live="polite">
              <div className="mb-6 flex gap-1.5" aria-label={`Livello di attenzione ${v!.level} su 3`}>
                {[1, 2, 3].map((n) => (
                  <span key={n} className={cn('h-3 w-12 rounded-full', n <= v!.level ? 'bg-navy' : 'bg-line')} />
                ))}
              </div>
              <h3 className="display text-4xl lg:text-6xl">{v!.title}</h3>
              <p className="mt-5 max-w-lg text-lg text-text">{v!.text}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink to="/contatti?servizio=Bonifica%20amianto">
                  Richiedi un sopralluogo <ArrowRight />
                </ButtonLink>
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setAns({});
                  }}
                  className="inline-flex items-center gap-2 px-3 font-display text-sm uppercase tracking-[0.14em] text-navy hover:text-sky-ink"
                >
                  <RotateCcw className="size-4" /> Rifai il test
                </button>
              </div>
              <p className="mt-8 text-xs text-muted-foreground">Il test è solo orientativo e non sostituisce un’analisi su campione.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const STEPS = [
  { t: 'Sopralluogo', d: 'Un incaricato viene a vedere la copertura, ne valuta lo stato e vi spiega come si può intervenire. Il sopralluogo è gratuito.' },
  { t: 'Piano di lavoro', d: 'Prima della rimozione si prepara il piano di lavoro previsto dalla normativa, da presentare all’ASL competente.' },
  { t: 'Messa in sicurezza', d: 'L’area viene delimitata, le lastre trattate per evitare la dispersione delle fibre e smontate senza romperle.' },
  { t: 'Smaltimento', d: 'Le lastre vengono imballate in teli sigillati ed etichettate, poi conferite in un impianto autorizzato.' },
  { t: 'Tetto nuovo', d: 'Sulla struttura liberata si posa la nuova copertura, impermeabilizzata e, se serve, coibentata.' },
];

/** Disegno della lastra che cambia stato a ogni tappa */
function SheetState({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 400 300" className="w-full" aria-hidden>
      <defs>
        <pattern id="b-corr" width="24" height="10" patternUnits="userSpaceOnUse">
          <rect width="24" height="10" fill="#b1aea5" />
          <rect width="7" height="10" fill="#c9c6bd" />
          <rect x="12" width="5" height="10" fill="#8f8c84" />
        </pattern>
        <pattern id="b-rib" width="40" height="10" patternUnits="userSpaceOnUse">
          <rect width="40" height="10" fill="#102542" />
          <rect x="4" width="7" height="10" fill="#1d3a63" />
        </pattern>
      </defs>
      {/* struttura */}
      {[60, 140, 220, 300].map((x) => (
        <rect key={x} x={x} y="60" width="14" height="200" fill="#d7d2c8" />
      ))}
      <motion.g animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : -20 }} transition={{ duration: 0.8, ease: EASE_EXPO }}>
        <rect x="40" y="80" width="320" height="160" fill="url(#b-rib)" />
        <rect x="40" y="80" width="320" height="4" fill="#74b9fc" />
      </motion.g>
      <motion.g
        animate={{ y: step >= 3 ? -260 : step === 2 ? -6 : 0, opacity: step >= 3 ? 0 : 1, rotate: step >= 3 ? -8 : 0 }}
        transition={{ duration: 0.9, ease: EASE_EXPO }}
        style={{ transformOrigin: '200px 160px' }}
      >
        <rect x="40" y="80" width="320" height="160" fill="url(#b-corr)" />
        <motion.rect x="40" y="80" width="320" height="160" fill="#e9f1fa" animate={{ opacity: step >= 2 ? 0.85 : 0 }} transition={{ duration: 0.6 }} />
        {/* lenti del sopralluogo */}
        <motion.g animate={{ opacity: step === 0 ? 1 : 0, scale: step === 0 ? 1 : 0.6 }} style={{ transformOrigin: '250px 150px' }}>
          <circle cx="250" cy="150" r="40" fill="none" stroke="#102542" strokeWidth="8" />
          <rect x="276" y="178" width="14" height="50" rx="4" fill="#102542" transform="rotate(-45 283 203)" />
        </motion.g>
        {/* documento del piano di lavoro */}
        <motion.g animate={{ opacity: step === 1 ? 1 : 0, y: step === 1 ? 0 : 20 }}>
          <rect x="150" y="100" width="100" height="125" rx="6" fill="#fff" stroke="#102542" strokeWidth="5" />
          {[125, 145, 165, 185].map((y) => (
            <rect key={y} x="168" y={y} width={y === 185 ? 40 : 64} height="7" rx="3" fill="#74b9fc" />
          ))}
        </motion.g>
      </motion.g>
      {/* nastro di delimitazione */}
      <motion.path d="M10 270 L390 270" stroke="#74b9fc" strokeWidth="10" strokeDasharray="22 14" initial={false} animate={{ pathLength: step >= 2 && step < 4 ? 1 : 0 }} transition={{ duration: 0.8 }} />
    </svg>
  );
}

function Percorso() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-white py-24 lg:py-36">
      <div className="container-e3">
        <InteractiveHead eyebrow="Il percorso" title="Dal sopralluogo al tetto nuovo, in cinque tappe." text="Così si svolge, in generale, una bonifica di copertura in fibrocemento. Scorrete per seguire la lastra." />
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius)] bg-mist p-6 lg:p-10">
              <SheetState step={active} />
              <div className="mt-6 flex items-baseline justify-between font-display uppercase">
                <span className="text-sm tracking-[0.2em] text-muted-foreground">Tappa</span>
                <span className="display text-5xl text-navy">
                  0{active + 1}
                  <span className="text-2xl text-muted-foreground">/05</span>
                </span>
              </div>
            </div>
          </div>
          <ol className="relative space-y-6 lg:space-y-[28vh] lg:py-[10vh]">
            <span aria-hidden className="absolute bottom-0 left-[1.15rem] top-0 w-px bg-line" />
            {STEPS.map((s, i) => (
              <li
                key={s.t}
                data-i={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="relative pl-14"
              >
                <span className={cn('absolute left-0 top-1 grid size-[2.3rem] place-items-center rounded-full border-2 font-display transition-colors duration-500', i <= active ? 'border-navy bg-navy text-sky' : 'border-line bg-white text-muted-foreground')}>{i + 1}</span>
                <h3 className={cn('display text-4xl transition-colors duration-500 lg:text-5xl', i === active ? 'text-navy' : 'text-ink/35')}>{s.t}</h3>
                <p className={cn('mt-4 max-w-md text-lg transition-opacity duration-500', i === active ? 'text-text opacity-100' : 'opacity-50')}>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export default function BonificaAmianto() {
  return (
    <ServiceLayout slug="bonifica-amianto" seoTitle="Bonifica e smaltimento amianto a Broni (PV) | Edil 3" seoDescription="Rimozione e smaltimento di coperture in amianto (eternit) a Broni e in provincia di Pavia, con rifacimento del tetto. Sopralluogo gratuito.">
      <section className="relative overflow-hidden bg-navy py-24 text-white lg:py-36">
        <div className="corrugate pointer-events-none absolute inset-0 text-sky opacity-20" aria-hidden />
        <div className="container-e3 relative">
          <div className="mb-14 grid items-end gap-10 lg:grid-cols-[1.3fr_1fr]">
            <InteractiveHead dark eyebrow="Test rapido" title="Il mio tetto può contenere amianto?" text="Tre domande per capire se conviene far verificare la copertura." />
            <Reveal className="mb-12 lg:mb-16 lg:text-right">
              <div className="display text-8xl text-sky lg:text-[10rem]">
                <Counter from={1950} to={1992} duration={2.2} />
              </div>
              <p className="mt-2 text-sm text-white/70 lg:ml-auto lg:max-w-xs">In Italia l’amianto è vietato dal 1992 (legge 257/1992): le coperture più vecchie possono contenerlo.</p>
            </Reveal>
          </div>
          <Quiz />
        </div>
      </section>
      <Percorso />
    </ServiceLayout>
  );
}
