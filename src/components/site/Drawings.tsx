/**
 * Disegni tecnici a tratto, uno per servizio (stile tavola di progetto).
 * Si tracciano quando entrano nella vista; `active` li ridisegna (hover sulle schede).
 */
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

type P = { active?: boolean; className?: string };

function Draw({ children, className }: P & { children: (draw: (i: number) => object) => React.ReactNode }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const on = reduce || inView;
  const draw = (i: number) => ({
    initial: reduce ? false : { pathLength: 0, opacity: 0 },
    animate: on ? { pathLength: 1, opacity: 1 } : {},
    transition: { pathLength: { duration: 1.4, delay: 0.15 + i * 0.12, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.2, delay: 0.15 + i * 0.12 } },
  });
  return (
    <svg ref={ref} viewBox="0 0 320 220" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children(draw)}
    </svg>
  );
}

/** quota: linea di misura con frecce e testo */
function Quota({ x1, x2, y, label, draw, i }: { x1: number; x2: number; y: number; label: string; draw: (i: number) => object; i: number }) {
  return (
    <g strokeWidth="1" opacity="0.7">
      <motion.path d={`M${x1} ${y}H${x2}M${x1} ${y - 5}v10M${x2} ${y - 5}v10M${x1} ${y}l6 -3M${x1} ${y}l6 3M${x2} ${y}l-6 -3M${x2} ${y}l-6 3`} {...draw(i)} />
      <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" fontSize="9" fontFamily="Oswald" letterSpacing="1.5" fill="currentColor" stroke="none">
        {label}
      </text>
    </g>
  );
}

const wave = (x0: number, x1: number, y: number, amp: number, n: number) => {
  let d = `M${x0} ${y}`;
  const step = (x1 - x0) / (n * 2);
  for (let k = 0; k < n * 2; k++) d += ` q${step / 2} ${k % 2 ? amp : -amp} ${step} 0`;
  return d;
};

export function DrawAmianto(p: P) {
  return (
    <Draw {...p}>
      {(d) => (
        <>
          {/* lastra ondulata in sezione che si solleva */}
          <motion.path d={wave(40, 280, 150, 12, 7)} {...d(0)} />
          <motion.path d={wave(60, 260, 92, 10, 6)} strokeDasharray="5 6" {...d(1)} />
          <motion.path d="M160 140V108M150 118l10 -10l10 10" {...d(2)} />
          <motion.path d="M90 140V112M80 122l10 -10l10 10M230 140V112M220 122l10 -10l10 10" {...d(3)} />
          {/* sacco sigillato */}
          <motion.path d="M250 40h44l-6 34h-32z M256 40c4 -8 28 -8 32 0" {...d(4)} />
          <motion.path d="M262 56h20" {...d(5)} />
          <Quota x1={40} x2={280} y={190} label="LASTRA IN FIBROCEMENTO" draw={d} i={6} />
        </>
      )}
    </Draw>
  );
}

export function DrawCoperture(p: P) {
  return (
    <Draw {...p}>
      {(d) => (
        <>
          {/* sezione di tetto a falde con strati */}
          <motion.path d="M30 170L160 50L290 170" {...d(0)} />
          <motion.path d="M48 170L160 66L272 170" {...d(1)} />
          <motion.path d="M64 170L160 80L256 170" strokeDasharray="4 5" {...d(2)} />
          <motion.path d="M80 170L160 94L240 170" {...d(3)} />
          <motion.path d="M20 170h280M60 170v30M260 170v30M60 200h200" {...d(4)} />
          {/* richiami */}
          <g strokeWidth="1">
            <motion.path d="M214 98l40 -30h40" {...d(5)} />
            <motion.path d="M230 124l40 -20h30" {...d(6)} />
          </g>
          <text x="258" y="64" fontSize="9" fontFamily="Oswald" letterSpacing="1.2" fill="currentColor" stroke="none">
            MANTO
          </text>
          <text x="272" y="100" fontSize="9" fontFamily="Oswald" letterSpacing="1.2" fill="currentColor" stroke="none">
            ISOLANTE
          </text>
        </>
      )}
    </Draw>
  );
}

export function DrawChiavi(p: P) {
  return (
    <Draw {...p}>
      {(d) => (
        <>
          {/* prospetto di una casa dalle fondamenta al tetto */}
          <motion.path d="M20 186h220" {...d(0)} />
          <motion.path d="M40 186v12h180v-12" strokeDasharray="4 4" {...d(1)} />
          <motion.path d="M56 186V98h148v88" {...d(2)} />
          <motion.path d="M44 104L130 40l86 64" {...d(3)} />
          <motion.path d="M76 124h34v28H76zM150 124h34v28h-34zM114 186v-38h32v38" {...d(4)} />
          {/* chiave */}
          <motion.path d="M262 70a16 16 0 1 0 0.1 0M262 102v70M262 140h14M262 158h10" {...d(5)} />
          <Quota x1={56} x2={204} y={210} label="CHIAVI IN MANO" draw={d} i={6} />
        </>
      )}
    </Draw>
  );
}

export function DrawRistrutturazioni(p: P) {
  return (
    <Draw {...p}>
      {(d) => (
        <>
          {/* muro in mattoni */}
          <motion.path d="M30 60h170v130H30z" {...d(0)} />
          <motion.path d="M30 86h170M30 112h170M30 138h170M30 164h170" strokeWidth="1.4" {...d(1)} />
          <motion.path d="M86 60v26M142 60v26M58 86v26M114 86v26M170 86v26M86 112v26M142 112v26M58 138v26M114 138v26M170 138v26M86 164v26M142 164v26" strokeWidth="1.4" {...d(2)} />
          {/* cazzuola */}
          <motion.path d="M236 70l44 26l-30 30z" {...d(3)} />
          <motion.path d="M250 112l-26 40" {...d(4)} />
          <motion.path d="M224 152l-10 16" strokeWidth="5" {...d(5)} />
          <Quota x1={30} x2={200} y={210} label="INTERNI ED ESTERNI" draw={d} i={6} />
        </>
      )}
    </Draw>
  );
}

export function DrawImpianti(p: P) {
  return (
    <Draw {...p}>
      {(d) => (
        <>
          {/* parete in sezione con impianti */}
          <motion.path d="M40 30v170M60 30v170" {...d(0)} />
          <motion.path d="M60 60h120v40h60M60 150h80v-30h100" {...d(1)} />
          <motion.path d="M180 60v-14h24v28h-24z" {...d(2)} />
          {/* simbolo presa */}
          <motion.path d="M240 100a12 12 0 1 0 0.1 0M236 98v6M244 98v6" {...d(3)} />
          {/* tubo idraulico con rubinetto */}
          <motion.path d="M240 120v40h28M268 152v16M260 168h16M264 176v8" {...d(4)} />
          {/* isolante */}
          <motion.path d="M44 40c8 6 8 12 0 18s-8 12 0 18s8 12 0 18s-8 12 0 18s8 12 0 18s-8 12 0 18s8 12 0 18" strokeWidth="1.2" {...d(5)} />
          <Quota x1={60} x2={240} y={210} label="ELETTRICO E IDRAULICO" draw={d} i={6} />
        </>
      )}
    </Draw>
  );
}

export const DRAWINGS: Record<string, (p: P) => React.JSX.Element> = {
  'bonifica-amianto': DrawAmianto,
  'coperture-tetti': DrawCoperture,
  'costruzioni-chiavi-in-mano': DrawChiavi,
  'ristrutturazioni-finiture': DrawRistrutturazioni,
  'impianti-manutenzione': DrawImpianti,
};
