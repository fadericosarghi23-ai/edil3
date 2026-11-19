/**
 * Impianti, coibentazioni e manutenzione stabili. Sezione interattiva: sezione di un edificio
 * con punti cliccabili; per ogni punto, i segnali da tenere d'occhio, che si possono spuntare
 * per preparare la lista da mostrare al sopralluogo.
 * TESTI DEI SEGNALI SCRITTI DA ALTALOGIK: indicazioni generiche, da far confermare al cliente.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useState } from 'react';
import { ButtonLink } from '@/components/layout/ButtonLink';
import { InteractiveHead, ServiceLayout } from '@/components/service/ServiceLayout';
import { EASE_EXPO } from '@/lib/motion';
import { sentence } from '@/data/site';
import { cn } from '@/lib/utils';

const SPOTS = [
  { id: 'tetto', x: 300, y: 70, t: 'Coibentazione del tetto', signs: ['Sottotetto molto caldo d’estate', 'Condensa o muffa sul soffitto dell’ultimo piano', 'Riscaldamento sempre al massimo'] },
  { id: 'pareti', x: 112, y: 250, t: 'Coibentazione delle pareti', signs: ['Muri freddi al tatto d’inverno', 'Macchie di muffa negli angoli', 'Stanze che non si scaldano'] },
  { id: 'elettrico', x: 400, y: 236, t: 'Impianto elettrico', signs: ['Il salvavita scatta spesso', 'Prese che si scaldano', 'Impianto mai rifatto da decenni'] },
  { id: 'idraulico', x: 236, y: 382, t: 'Impianto idraulico', signs: ['Poca pressione ai rubinetti', 'Macchie d’acqua su muri o soffitti', 'Scarichi lenti o rumorosi'] },
  { id: 'facciata', x: 520, y: 330, t: 'Manutenzione dello stabile', signs: ['Intonaco che si stacca', 'Gronde e pluviali che traboccano', 'Crepe in facciata'] },
];

function Building({ sel, onSel }: { sel: number; onSel: (i: number) => void }) {
  return (
    <svg viewBox="0 0 620 480" className="w-full" role="group" aria-label="Sezione di un edificio con i punti di intervento">
      <defs>
        <pattern id="i-brick" width="24" height="12" patternUnits="userSpaceOnUse">
          <rect width="24" height="12" fill="#f3f3f3" />
          <path d="M0 12H24M12 0V6M0 6H24M0 0V6" stroke="#e1e1e1" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="440" width="620" height="40" fill="#e9e6df" />
      {/* tetto */}
      <path d="M60 170 L300 40 L560 170 Z" fill="#102542" />
      <path d="M90 170 L300 62 L530 170 Z" fill="#74b9fc" opacity={sel === 0 ? 0.9 : 0.35} className="transition-opacity duration-500" />
      {/* muri */}
      <rect x="90" y="170" width="440" height="270" fill="url(#i-brick)" stroke="#102542" strokeWidth="4" />
      <rect x="90" y="170" width="26" height="270" fill="#74b9fc" opacity={sel === 1 ? 0.9 : 0.25} className="transition-opacity duration-500" />
      {/* solaio */}
      <rect x="116" y="300" width="414" height="10" fill="#102542" />
      {/* stanza alta: quadro elettrico e cavi */}
      <g opacity={sel === 2 ? 1 : 0.45} className="transition-opacity duration-500">
        <rect x="382" y="214" width="36" height="46" rx="3" fill="#102542" />
        <path d="M400 214 V190 H180 V250 M400 260 V290 H480 V240" fill="none" stroke="#102542" strokeWidth="3" strokeDasharray="6 5" />
      </g>
      {/* bagno: tubi */}
      <g opacity={sel === 3 ? 1 : 0.45} className="transition-opacity duration-500">
        <rect x="190" y="380" width="60" height="44" rx="6" fill="#fff" stroke="#102542" strokeWidth="3" />
        <path d="M250 400 H330 V440 M220 380 V330 H300 V300" fill="none" stroke="#74b9fc" strokeWidth="6" strokeLinecap="round" />
      </g>
      {/* finestre */}
      {[
        [150, 200],
        [460, 330],
        [150, 330],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="60" height="54" fill="#dcecfd" stroke="#102542" strokeWidth="3" />
      ))}
      {/* facciata e gronda */}
      <g opacity={sel === 4 ? 1 : 0.45} className="transition-opacity duration-500">
        <path d="M530 170 H572 V440" fill="none" stroke="#102542" strokeWidth="6" />
        <path d="M500 380 l18 -26 l-8 22 l16 -18" fill="none" stroke="#102542" strokeWidth="2.5" />
      </g>
      {SPOTS.map((s, i) => (
        <g key={s.id} transform={`translate(${s.x} ${s.y})`} className="cursor-pointer" role="button" tabIndex={0} aria-label={s.t} aria-pressed={sel === i} onClick={() => onSel(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSel(i)}>
          <circle r="26" fill="#74b9fc" opacity="0.35">
            <animate attributeName="r" values="18;30;18" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </circle>
          <circle r="16" fill={sel === i ? '#74b9fc' : '#102542'} stroke="#fff" strokeWidth="3" />
          <text textAnchor="middle" dy="5" fontFamily="Oswald" fontSize="15" fill={sel === i ? '#102542' : '#fff'}>
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

function HouseCheck() {
  const [sel, setSel] = useState(0);
  const [ticks, setTicks] = useState<string[]>([]);
  const s = SPOTS[sel];
  const toggle = (k: string) => setTicks((t) => (t.includes(k) ? t.filter((x) => x !== k) : [...t, k]));
  const msg = ticks.length ? `Vorrei un sopralluogo. Ho notato: ${ticks.map((k) => k.split('|')[1].toLowerCase()).join('; ')}.` : '';

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <div className="rounded-[var(--radius)] bg-white p-4 shadow-xl shadow-navy/5 sm:p-8">
        <Building sel={sel} onSel={setSel} />
        <div className="mt-4 flex flex-wrap gap-2">
          {SPOTS.map((sp, i) => (
            <button key={sp.id} type="button" onClick={() => setSel(i)} aria-pressed={sel === i} className={cn('rounded-full px-4 py-2 font-display text-sm uppercase tracking-wide transition-colors', sel === i ? 'bg-navy text-white' : 'bg-mist text-navy hover:bg-sky-soft')}>
              {i + 1}. {sp.t.replace('Coibentazione d', 'Isolamento d').replace('Manutenzione dello stabile', 'Facciata')}
            </button>
          ))}
        </div>
      </div>
      <div>
        <AnimatePresence mode="wait">
          <motion.div key={s.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.45, ease: EASE_EXPO }}>
            <p className="font-display text-sky-ink">0{sel + 1}</p>
            <h3 className="display mt-2 text-4xl lg:text-5xl">{s.t}</h3>
            <p className="eyebrow mt-8 text-muted-foreground">Segnali da tenere d’occhio</p>
            <ul className="mt-4 space-y-2">
              {s.signs.map((g) => {
                const k = `${s.id}|${g}`;
                const on = ticks.includes(k);
                return (
                  <li key={k}>
                    <button type="button" onClick={() => toggle(k)} aria-pressed={on} className={cn('flex w-full items-center gap-4 rounded-[var(--radius)] border-2 px-4 py-3.5 text-left transition-colors', on ? 'border-navy bg-navy text-white' : 'border-line bg-white hover:border-navy')}>
                      <span className={cn('grid size-6 shrink-0 place-items-center rounded-sm border-2', on ? 'border-sky bg-sky text-navy' : 'border-line')}>{on && <Check className="size-4" />}</span>
                      {g}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius)] bg-mist p-5">
          <p className="font-display uppercase tracking-wide text-navy">
            <span className="display text-4xl tabular-nums">{ticks.length}</span> segnali da mostrare al sopralluogo
          </p>
          <ButtonLink to={ticks.length ? `/contatti?servizio=${encodeURIComponent('Impianti e manutenzione')}&messaggio=${encodeURIComponent(msg)}` : '/contatti?servizio=Impianti%20e%20manutenzione'} size="sm">
            Richiedi un sopralluogo <ArrowRight />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export default function ImpiantiManutenzione() {
  return (
    <ServiceLayout
      slug="impianti-manutenzione"
      seoTitle="Impianti elettrici e idraulici, coibentazioni e manutenzione stabili | Edil 3 Broni"
      seoDescription="Impiantistica elettrica e idraulica, coibentazioni e manutenzione di stabili civili e industriali a Broni e in provincia di Pavia."
      quote={[sentence('/servizi', 'Fra le altre realizzazioni'), sentence('/', 'Si occupa di costruzioni edili')]}
    >
      <section className="bg-mist py-24 lg:py-36">
        <div className="container-e3">
          <InteractiveHead eyebrow="Controllo casa" title="Dove intervenire?" text="Toccate un punto dell’edificio e spuntate i segnali che riconoscete: la lista arriva già pronta nel modulo contatti." />
          <HouseCheck />
        </div>
      </section>
    </ServiceLayout>
  );
}
