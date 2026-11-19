import { cn } from '@/lib/utils';

/** Etichetta tecnica: numero di tavola su fondo navy + titolo, come nei cartigli di progetto. */
export function Label({ n, children, dark, className }: { n?: string; children: React.ReactNode; dark?: boolean; className?: string }) {
  return (
    <span className={cn('tag', dark ? 'text-sky' : 'text-navy', className)}>
      {n && <span className={cn('px-1.5 py-1 tabular-nums', dark ? 'bg-sky text-navy' : 'bg-navy text-sky')}>{n}</span>}
      {children}
    </span>
  );
}
