import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

/** Entrata allo scroll: sale e si scopre. */
export function Reveal({ children, delay = 0, y = 40, className, as = 'div' }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'section' | 'p' }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: EASE_EXPO, delay }}
    >
      {children}
    </M>
  );
}

/** Titolo che entra parola per parola da sotto una maschera. */
export function SplitWords({ text, className, delay = 0, stagger = 0.06, as = 'h2' }: { text: string; className?: string; delay?: number; stagger?: number; as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // si osserva il titolo intero: le parole sono nascoste dalla maschera e non risulterebbero mai visibili
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' });
  const Tag = as as 'h2';
  const words = text.split(' ');
  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '110%' }}
            animate={inView || reduce ? { y: '0%' } : { y: '110%' }}
            transition={{ duration: 0.9, ease: EASE_EXPO, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Numero che conta fino al valore quando entra nella vista. */
export function Counter({ to, from = 0, duration = 1.8, className, format = (n: number) => String(Math.round(n)) }: { to: number; from?: number; duration?: number; className?: string; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : from);
  const mv = useMotionValue(from);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(mv, to, { duration, ease: EASE_EXPO, onUpdate: (v) => setVal(v) });
    return () => c.stop();
  }, [inView, reduce, to, duration, mv]);
  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {format(val)}
    </span>
  );
}

/** Parallasse verticale legato allo scroll della sezione. */
export function Parallax({ children, speed = 0.15, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]), { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-[-18%_0]">
        {children}
      </motion.div>
    </div>
  );
}

/** Foto che si scopre con una "lastra" che scorre via (maschera orizzontale). */
export function SheetReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
      {!reduce && (
        <motion.div
          aria-hidden
          className="corrugate absolute inset-0 z-10 bg-navy text-sky"
          initial={{ x: '0%' }}
          whileInView={{ x: '101%' }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay }}
        >
          <span className="absolute inset-y-0 left-0 w-1 bg-sky shadow-[0_0_24px_4px_var(--e3-sky)]" />
        </motion.div>
      )}
    </div>
  );
}
