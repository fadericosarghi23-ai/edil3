/**
 * Hero 2.5D fotografico: due foto della stessa casa (prima con il tetto in fibrocemento, dopo con il
 * tetto nuovo). Il fronte azzurro attraversa il tetto seguendo lo scroll e scopre la copertura nuova;
 * dietro al fronte si staccano piccoli frammenti di lastra. Didascalie da tavola tecnica agganciate.
 * Le foto sono ILLUSTRATIVE (generate con AI, vedi scripts/build-hero.mjs), non un cantiere del cliente.
 */
import { motion, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { useState } from 'react';

/** proporzioni della foto e riquadro del tetto, misurati sull'immagine (frazioni di larghezza/altezza) */
export const PHOTO_RATIO = 1344 / 752;
const ROOF = { x0: 0.462, x1: 0.99, y0: 0.335, y1: 0.612 };
const SLANT = 0.035; // il fronte è leggermente inclinato: in alto è più indietro
const VB_W = 1000 * PHOTO_RATIO;
const VB_H = 1000;

/** posizione del fronte (frazione di larghezza, a metà altezza del tetto) */
export const edgeAt = (p: number) => ROOF.x0 - 0.05 + (ROOF.x1 - ROOF.x0 + 0.1) * p;
/** quota di tetto già scoperta, 0..1 */
export const doneAt = (p: number) => Math.min(1, Math.max(0, (edgeAt(p) - ROOF.x0) / (ROOF.x1 - ROOF.x0)));

const srcset = (name: string) => `/img/hero-${name}-sm.webp 900w, /img/hero-${name}-md.webp 1280w, /img/hero-${name}-lg.webp 1920w`;

const rnd = (i: number, k = 1) => {
  const x = Math.sin(i * 12.9898 * k + 78.233 * k) * 43758.5453;
  return x - Math.floor(x);
};
const FLAKES = Array.from({ length: 34 }, (_, i) => ({
  x: ROOF.x0 + 0.02 + rnd(i) * (ROOF.x1 - ROOF.x0 - 0.04),
  y: ROOF.y0 + 0.02 + rnd(i, 2) * (ROOF.y1 - ROOF.y0 - 0.05),
  s: 5 + rnd(i, 3) * 9,
  r: rnd(i, 4) * 180,
}));

export function HeroPhoto({ progress, scroll }: { progress: MotionValue<number>; scroll: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const [p, setP] = useState(progress.get());
  useMotionValueEvent(progress, 'change', (v) => setP(v));
  const scale = useTransform(scroll, [0, 1], [1.02, 1.09]);

  const e = edgeAt(p);
  // poligono di ritaglio della foto "dopo": tutto ciò che sta a sinistra del fronte inclinato
  const topX = (e - SLANT) * 100;
  const botX = (e + SLANT) * 100;
  const clip = `polygon(0% 0%, ${topX}% 0%, ${botX}% 100%, 0% 100%)`;
  // il fronte disegnato solo sull'altezza del tetto
  const yA = ROOF.y0 - 0.05;
  const yB = ROOF.y1 + 0.03;
  const xAt = (y: number) => e - SLANT + 2 * SLANT * y;
  const showFront = p > 0.002 && p < 0.995;

  const a = Math.min(1, Math.max(0, 1 - (p - 0.22) / 0.12));
  const b = Math.min(1, Math.max(0, (p - 0.66) / 0.12));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#dfe1e8_0%,#e4e6ec_45%,#eceef1_100%)]" aria-hidden>
      {/* riquadro che copre l'hero mantenendo le proporzioni della foto (come object-fit: cover) */}
      <motion.div
        style={{ ...(reduce ? {} : { scale }), transformOrigin: '75% 100%' }}
        className="hero-photo absolute aspect-[1344/752] max-lg:bottom-[11%] max-lg:left-1/2 max-lg:w-[180%] max-lg:-translate-x-[71%] lg:bottom-0 lg:right-0 lg:h-[76%]"
      >
        <img src="/img/hero-prima-md.webp" srcSet={srcset('prima')} sizes="100vw" alt="" className="absolute inset-0 h-full w-full" fetchPriority="high" decoding="async" />
        <img src="/img/hero-dopo-md.webp" srcSet={srcset('dopo')} sizes="100vw" alt="" className="absolute inset-0 h-full w-full" style={{ clipPath: clip }} decoding="async" />

        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="hp-glow" x1="0" x2="1">
              <stop offset="0" stopColor="#74b9fc" stopOpacity="0" />
              <stop offset="0.5" stopColor="#74b9fc" stopOpacity="0.55" />
              <stop offset="1" stopColor="#74b9fc" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* frammenti di lastra che si staccano dietro al fronte */}
          {!reduce &&
            FLAKES.map((f, i) => {
              const age = (xAt(f.y) - f.x) / 0.09;
              if (age <= 0 || age >= 1) return null;
              return (
                <rect
                  key={i}
                  x={(f.x + age * 0.025) * VB_W}
                  y={(f.y - age * 0.16) * VB_H}
                  width={f.s * 1.6}
                  height={f.s}
                  fill="#8f8c84"
                  stroke="#e9f1fa"
                  strokeWidth="1"
                  opacity={(1 - age) * 0.9}
                  transform={`rotate(${f.r + age * 120} ${(f.x + age * 0.025) * VB_W} ${(f.y - age * 0.16) * VB_H})`}
                />
              );
            })}
          {showFront && (
            <g>
              <polygon
                points={`${(xAt(yA) - 0.025) * VB_W},${yA * VB_H} ${(xAt(yA) + 0.025) * VB_W},${yA * VB_H} ${(xAt(yB) + 0.025) * VB_W},${yB * VB_H} ${(xAt(yB) - 0.025) * VB_W},${yB * VB_H}`}
                fill="url(#hp-glow)"
                style={{ mixBlendMode: 'screen' }}
              />
              <line x1={xAt(yA) * VB_W} y1={yA * VB_H} x2={xAt(yB) * VB_W} y2={yB * VB_H} stroke="#74b9fc" strokeWidth="5" strokeLinecap="round" />
              <line x1={xAt(yA) * VB_W} y1={yA * VB_H} x2={xAt(yB) * VB_W} y2={yB * VB_H} stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
            </g>
          )}
        </svg>

        {/* didascalie da tavola tecnica, agganciate a punti del tetto */}
        <div className="hidden lg:block">
          <Callout x={0.8} y={0.42} n="A" title="Stato di fatto" text="Copertura in lastre di fibrocemento" opacity={a} />
          <Callout x={0.64} y={0.44} n="B" title="Progetto" text="Copertura nuova, impermeabilizzata" opacity={b} />
        </div>
      </motion.div>
    </div>
  );
}

function Callout({ x, y, n, title, text, opacity }: { x: number; y: number; n: string; title: string; text: string; opacity: number }) {
  return (
    <div className="absolute transition-opacity duration-300" style={{ left: `${x * 100}%`, top: `${y * 100}%`, opacity }}>
      <span className="absolute -left-[7px] -top-[7px] size-3.5 rounded-full border-2 border-navy bg-white shadow" />
      <span className="absolute bottom-[7px] left-0 h-[92px] w-px bg-navy" />
      <div className="absolute bottom-[99px] left-0 flex -translate-x-1/2 items-stretch whitespace-nowrap border border-navy bg-white/95 font-display uppercase text-navy shadow-[0_10px_30px_-16px_rgba(16,37,66,0.5)]">
        <span className="grid w-7 place-items-center bg-navy text-[11px] text-sky">{n}</span>
        <span className="px-3 py-1.5">
          <span className="block text-[10px] tracking-[0.2em] text-muted-foreground">{title}</span>
          <span className="block text-[13px] tracking-[0.08em]">{text}</span>
        </span>
      </div>
    </div>
  );
}
