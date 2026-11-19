/**
 * Coperture e impermeabilizzazioni. Sezioni interattive: la copertura "esplosa" strato per strato
 * (cursore + clic sugli strati) e il confronto prima/dopo.
 * TESTI DEGLI STRATI SCRITTI DA ALTALOGIK: descrizione generica di un tetto, da far confermare al cliente.
 */
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MoveHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { InteractiveHead, ServiceLayout } from '@/components/service/ServiceLayout';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

const LAYERS = [
  { id: 'manto', t: 'Manto di copertura', d: 'Lo strato che si vede: pannelli, tegole o lastre. Protegge da pioggia, grandine e sole.', fill: '#102542', top: '#1d3a63' },
  { id: 'guaina', t: 'Impermeabilizzazione', d: 'Guaine e teli che fermano l’acqua anche quando il manto non basta. È qui che nascono le infiltrazioni.', fill: '#3a4b63', top: '#56677f' },
  { id: 'isolante', t: 'Coibentazione', d: 'Il pacchetto isolante: tiene il caldo dentro d’inverno e fuori d’estate.', fill: '#74b9fc', top: '#a6d2fd' },
  { id: 'vapore', t: 'Barriera al vapore', d: 'Uno strato sottile che impedisce all’umidità di casa di entrare nell’isolante.', fill: '#cfd8e3', top: '#e6ecf3' },
  { id: 'struttura', t: 'Struttura', d: 'Travi, travetti e tavolato o solaio: lo scheletro che regge tutto il tetto.', fill: '#b8a58a', top: '#d2c2a8' },
];

function Exploded() {
  const [open, setOpen] = useState(0.55);
  const [sel, setSel] = useState(2);
  const gap = useSpring(open * 70, { stiffness: 140, damping: 22 });
  useEffect(() => gap.set(open * 70), [open, gap]);

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
      <div className="relative">
        <svg viewBox="-20 -40 560 520" className="w-full" role="img" aria-label="Sezione esplosa di una copertura">
          {LAYERS.map((_, k) => {
            const i = LAYERS.length - 1 - k; // si disegna dal basso (la struttura per prima)
            return <Layer key={LAYERS[i].id} level={k} gap={gap} layer={LAYERS[i]} active={sel === i} onClick={() => setSel(i)} />;
          })}
        </svg>
        <label className="mt-6 flex items-center gap-4 font-display text-sm uppercase tracking-[0.16em] text-navy">
          Chiuso
          <input type="range" min={0} max={1} step={0.01} value={open} onChange={(e) => setOpen(Number(e.target.value))} className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-[#102542]" aria-label="Apri la copertura" />
          Aperto
        </label>
      </div>
      <div>
        <ol className="space-y-2">
          {LAYERS.map((l, i) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => setSel(i)}
                aria-pressed={sel === i}
                className={cn('flex w-full items-center gap-5 rounded-[var(--radius)] border-2 px-5 py-4 text-left transition-colors duration-300', sel === i ? 'border-navy bg-navy text-white' : 'border-line hover:border-navy')}
              >
                <span className="size-4 shrink-0 rounded-sm" style={{ background: l.fill }} />
                <span className="font-display text-sm text-sky-ink">0{i + 1}</span>
                <span className="font-display text-xl uppercase tracking-wide">{l.t}</span>
              </button>
            </li>
          ))}
        </ol>
        <AnimatePresence mode="wait">
          <motion.p key={sel} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35, ease: EASE_EXPO }} className="mt-6 min-h-[5rem] text-lg text-text" aria-live="polite">
            {LAYERS[sel].d}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Layer({ level, gap, layer, active, onClick }: { level: number; gap: ReturnType<typeof useSpring>; layer: (typeof LAYERS)[number]; active: boolean; onClick: () => void }) {
  // isometria semplice: rombo superiore + due facce
  const thick = { manto: 14, guaina: 8, isolante: 34, vapore: 6, struttura: 30 }[layer.id] ?? 10;
  const baseY = 330;
  const y = useTransform(gap, (g) => -level * (g + 26));
  const w = 260;
  const h = 130;
  const cx = 260;
  const top = `${cx},${baseY - h / 2} ${cx + w},${baseY} ${cx},${baseY + h / 2} ${cx - w},${baseY}`;
  const left = `${cx - w},${baseY} ${cx},${baseY + h / 2} ${cx},${baseY + h / 2 + thick} ${cx - w},${baseY + thick}`;
  const right = `${cx + w},${baseY} ${cx},${baseY + h / 2} ${cx},${baseY + h / 2 + thick} ${cx + w},${baseY + thick}`;
  return (
    <motion.g style={{ y }} onClick={onClick} className="cursor-pointer" animate={{ x: active ? 18 : 0 }} transition={{ duration: 0.5, ease: EASE_EXPO }}>
      <polygon points={left} fill={layer.fill} style={{ filter: 'brightness(0.82)' }} />
      <polygon points={right} fill={layer.fill} style={{ filter: 'brightness(0.68)' }} />
      <polygon points={top} fill={layer.top} stroke={active ? '#74b9fc' : 'rgba(0,0,0,0.08)'} strokeWidth={active ? 4 : 1} />
      {layer.id === 'manto' &&
        Array.from({ length: 9 }, (_, k) => {
          const t = (k + 1) / 10;
          return <line key={k} x1={cx - w + w * t} y1={baseY - (h / 2) * t} x2={cx + w * t} y2={baseY + h / 2 - (h / 2) * t} stroke="#0a1a30" strokeWidth="3" opacity="0.6" />;
        })}
      {layer.id === 'isolante' &&
        Array.from({ length: 14 }, (_, k) => <circle key={k} cx={cx - 180 + (k % 7) * 60} cy={baseY - 20 + Math.floor(k / 7) * 40} r="5" fill="#fff" opacity="0.5" />)}
    </motion.g>
  );
}

/** Confronto prima/dopo, disegnato con gli stessi motivi dell'hero */
function BeforeAfter() {
  const box = useRef<HTMLDivElement>(null);
  const pos = useMotionValue(50);
  const clip = useTransform(pos, (p) => `inset(0 ${100 - p}% 0 0)`);
  const left = useTransform(pos, (p) => `${p}%`);
  const move = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    pos.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={box}
      className="relative aspect-[16/10] touch-none select-none overflow-hidden rounded-[var(--radius)] sm:aspect-[16/8]"
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        move(e.clientX);
      }}
      onPointerMove={(e) => e.buttons && move(e.clientX)}
    >
      {/* dopo */}
      <div className="absolute inset-0 bg-navy" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#102542 0 22px,#1d3a63 22px 34px,#0a1a30 34px 36px)' }}>
        <span className="eyebrow absolute bottom-5 right-5 rounded-full bg-sky px-4 py-2 text-navy">Dopo</span>
      </div>
      {/* prima */}
      <motion.div className="absolute inset-0" style={{ clipPath: clip, backgroundImage: 'repeating-linear-gradient(90deg,#b1aea5 0 8px,#c9c6bd 8px 14px,#8f8c84 14px 20px,#b1aea5 20px 26px)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 30%,rgba(140,130,70,.45),transparent 12%),radial-gradient(circle at 70% 60%,rgba(70,68,60,.4),transparent 14%),radial-gradient(circle at 45% 80%,rgba(140,130,70,.35),transparent 10%),radial-gradient(circle at 85% 20%,rgba(70,68,60,.35),transparent 9%)' }} />
        <span className="eyebrow absolute bottom-5 left-5 rounded-full bg-white px-4 py-2 text-ink">Prima</span>
      </motion.div>
      <motion.div className="absolute inset-y-0 w-1 -translate-x-1/2 bg-sky shadow-[0_0_24px_6px_rgba(116,185,252,.7)]" style={{ left }}>
        <span className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sky text-navy shadow-lg">
          <MoveHorizontal className="size-6" />
        </span>
      </motion.div>
      <input type="range" min={0} max={100} defaultValue={50} onChange={(e) => pos.set(Number(e.target.value))} className="sr-only" aria-label="Confronta prima e dopo" />
    </div>
  );
}

export default function CopertureTetti() {
  return (
    <ServiceLayout slug="coperture-tetti" seoTitle="Rifacimento tetti e impermeabilizzazioni a Broni (PV) | Edil 3" seoDescription="Rifacimento e manutenzione di coperture, impermeabilizzazioni e coibentazione dei tetti per case, capannoni e fabbricati a Broni e in provincia di Pavia.">
      <section className="bg-mist py-24 lg:py-36">
        <div className="container-e3">
          <InteractiveHead eyebrow="Strato per strato" title="Aprite il tetto." text="Un tetto è fatto di strati, e ognuno ha un compito. Muovete il cursore per separarli e toccate uno strato per scoprire a cosa serve." />
          <Exploded />
        </div>
      </section>
      <section className="bg-white py-24 lg:py-36">
        <div className="container-e3">
          <InteractiveHead eyebrow="Prima e dopo" title="Dalla lastra vecchia al pannello nuovo." text="Trascinate la linea azzurra: è lo stesso fronte che attraversa la copertura nella home." />
          <BeforeAfter />
        </div>
      </section>
    </ServiceLayout>
  );
}
