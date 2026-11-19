import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Menu, Phone, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SERVICES } from '@/data/services';
import { SITE } from '@/data/site';
import { EASE_EXPO, lenisStore } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { ButtonLink } from './ButtonLink';

const linkCls = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative font-display text-[0.95rem] font-medium uppercase tracking-[0.14em] transition-colors hover:text-white',
    'after:absolute after:-bottom-1.5 after:left-0 after:h-[3px] after:w-full after:origin-left after:bg-sky after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)]',
    isActive ? 'text-white after:scale-x-100' : 'text-white/75 after:scale-x-0 hover:after:scale-x-100',
  );

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drop, setDrop] = useState(false);
  const [mobile, setMobile] = useState(false);
  const loc = useLocation();
  const closeT = useRef<number | undefined>(undefined);

  // la barra resta sempre visibile: scorrendo si compatta e prende un'ombra
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrop(false);
    setMobile(false);
  }, [loc.pathname]);

  useEffect(() => {
    if (!drop) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrop(false);
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[data-servizi-menu]')) setDrop(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [drop]);

  useEffect(() => {
    if (mobile) lenisStore.current?.stop();
    else lenisStore.current?.start();
    document.documentElement.style.overflow = mobile ? 'hidden' : '';
  }, [mobile]);

  const openDrop = () => {
    window.clearTimeout(closeT.current);
    setDrop(true);
  };
  const closeDrop = () => {
    closeT.current = window.setTimeout(() => setDrop(false), 160);
  };
  const servActive = loc.pathname.startsWith('/servizi');

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[95] transition-[background-color,box-shadow] duration-500',
          scrolled ? 'bg-navy/95 shadow-[0_10px_30px_-18px_rgba(16,37,66,0.8)] backdrop-blur-md' : 'bg-navy',
        )}
      >
        <div className={cn('container-e3 flex h-[72px] items-center justify-between gap-6 transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]', scrolled ? 'lg:h-[68px]' : 'lg:h-[84px]')}>
          <Link to="/" className="shrink-0" aria-label="EDIL3 dei F.lli Jaupi, torna alla home">
            <img src="/brand/logo-light.svg" alt="EDIL3 dei F.lli Jaupi" width={1060} height={94} className="h-[19px] w-auto sm:h-[22px] lg:h-[24px]" />
          </Link>

          <nav aria-label="Principale" className="hidden items-center gap-10 lg:flex">
            <NavLink to="/" end className={linkCls}>
              Home
            </NavLink>
            <div
              className="relative flex items-center gap-1"
              data-servizi-menu
              onPointerEnter={(e) => e.pointerType === 'mouse' && openDrop()}
              onPointerLeave={(e) => e.pointerType === 'mouse' && closeDrop()}
            >
              <NavLink
                to="/servizi"
                className={() => linkCls({ isActive: servActive })}
                onClick={(e) => {
                  // su touch il primo tocco apre la tendina, il secondo apre la pagina
                  if (!drop && window.matchMedia('(hover: none)').matches) {
                    e.preventDefault();
                    setDrop(true);
                  }
                }}
              >
                Servizi
              </NavLink>
              <button type="button" aria-label={drop ? 'Chiudi elenco servizi' : 'Apri elenco servizi'} aria-expanded={drop} aria-controls="menu-servizi" onClick={() => setDrop((d) => !d)} className="grid size-7 place-items-center rounded-full text-white/75 hover:text-white">
                <ChevronDown className={cn('size-4 transition-transform duration-300', drop && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {drop && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, clipPath: 'inset(0 0 100% 0)' }}
                    animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
                    exit={{ opacity: 0, y: -6, clipPath: 'inset(0 0 100% 0)' }}
                    transition={{ duration: 0.45, ease: EASE_EXPO }}
                    id="menu-servizi"
                    className="absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-5"
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) closeDrop();
                    }}
                  >
                    <div className="overflow-hidden rounded-[3px] border border-line bg-white text-navy shadow-2xl shadow-navy/25">
                      <ul className="divide-y divide-line">
                        {SERVICES.map((s, i) => (
                          <li key={s.slug}>
                            <Link to={`/servizi/${s.slug}`} className="group flex items-center gap-5 px-6 py-4 transition-colors hover:bg-mist">
                              <span className="bg-navy px-1.5 py-1 font-display text-xs text-sky">0{i + 1}</span>
                              <span className="flex-1">
                                <span className="block font-display text-lg uppercase tracking-wide">{s.nav}</span>
                                <span className="block text-[0.8rem] text-muted-foreground">{s.kicker}</span>
                              </span>
                              <ArrowUpRight className="size-5 text-sky-ink transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link to="/servizi" className="block bg-navy px-6 py-3 font-display text-sm uppercase tracking-[0.16em] text-white transition-colors hover:bg-sky hover:text-navy">
                        Tutti i servizi
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavLink to="/contatti" className={linkCls}>
              Contatti
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <a href={SITE.phoneHref} className="hidden items-center gap-2 font-display text-[0.95rem] tracking-wider text-white/85 transition-colors hover:text-white xl:inline-flex" aria-label={`Chiama ${SITE.phone}`}>
              <Phone className="size-4 text-sky" />
              {SITE.phone}
            </a>
            <ButtonLink to="/contatti" size="sm" variant="sky" className="hidden before:bg-white hover:text-navy md:inline-flex">
              Richiedi un sopralluogo
            </ButtonLink>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-[var(--radius)] bg-sky text-navy lg:hidden"
              aria-label={mobile ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={mobile}
              onClick={() => setMobile((v) => !v)}
            >
              {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [servOpen, setServOpen] = useState(true);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mm"
          className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-navy pt-[72px] text-white lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="corrugate pointer-events-none absolute inset-0 text-sky opacity-30" aria-hidden />
          <nav aria-label="Menu mobile" className="container-e3 relative flex-1 py-8">
            <ul className="space-y-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/servizi', label: 'Servizi', sub: true },
                { to: '/contatti', label: 'Contatti' },
              ].map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07, duration: 0.7, ease: EASE_EXPO }}>
                  <div className="flex items-center justify-between border-b border-white/15">
                    <NavLink to={l.to} end={l.to === '/'} onClick={onClose} className={({ isActive }) => cn('display block py-3 text-[2.6rem] sm:text-6xl', isActive ? 'text-sky' : 'text-white')}>
                      {l.label}
                    </NavLink>
                    {l.sub && (
                      <button type="button" aria-label={servOpen ? 'Chiudi elenco servizi' : 'Apri elenco servizi'} aria-expanded={servOpen} onClick={() => setServOpen((v) => !v)} className="grid size-11 place-items-center rounded-full border border-white/30">
                        <ChevronDown className={cn('size-5 transition-transform', servOpen && 'rotate-180')} />
                      </button>
                    )}
                  </div>
                  {l.sub && (
                    <AnimatePresence initial={false}>
                      {servOpen && (
                        <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          {SERVICES.map((s, j) => (
                            <li key={s.slug}>
                              <Link to={`/servizi/${s.slug}`} onClick={onClose} className="flex items-baseline gap-4 py-2.5 pl-1 text-lg">
                                <span className="font-display text-sm text-sky">0{j + 1}</span>
                                <span className="font-display uppercase tracking-wide">{s.nav}</span>
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>
          <div className="container-e3 relative space-y-3 pb-10">
            <a href={SITE.phoneHref} className="flex h-14 items-center justify-center gap-3 rounded-[var(--radius)] bg-sky font-display text-lg uppercase tracking-widest text-navy">
              <Phone className="size-5" /> Chiama ora
            </a>
            <p className="text-center text-sm text-white/60">
              {SITE.hours[0].days} {SITE.hours[0].time}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
