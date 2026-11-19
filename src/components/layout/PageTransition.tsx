import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * Transizione tra pagine: una lastra navy col profilo ondulato attraversa lo schermo
 * con il "fronte" azzurro davanti, poi la nuova pagina sale.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.35 } }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
        {children}
      </motion.div>
      {/* lastra in uscita (copre la pagina vecchia) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] origin-left bg-navy text-sky"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0, transition: { duration: 0.7, ease: EASE, delay: 0.1 } }}
        exit={{ scaleX: 0 }}
        style={{ originX: 1 }}
      >
        <div className="corrugate absolute inset-0 opacity-60" />
        <span className="absolute inset-y-0 left-0 w-[3px] bg-sky shadow-[0_0_30px_6px_var(--e3-sky)]" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] bg-navy text-sky"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1, transition: { duration: 0.5, ease: EASE } }}
        style={{ originX: 0 }}
      >
        <div className="corrugate absolute inset-0 opacity-60" />
        <span className="absolute inset-y-0 right-0 w-[3px] bg-sky shadow-[0_0_30px_6px_var(--e3-sky)]" />
      </motion.div>
    </>
  );
}
