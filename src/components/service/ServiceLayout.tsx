import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CtaBand } from '@/components/layout/CtaBand';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { Reveal } from '@/components/motion/Reveal';
import { DRAWINGS } from '@/components/site/Drawings';
import { Label } from '@/components/site/Label';
import { SERVICES, type Service } from '@/data/services';
import { T } from '@/data/site';

/** Struttura comune delle pagine servizio; la sezione interattiva (children) è diversa per ognuna. */
export function ServiceLayout({ slug, seoTitle, seoDescription, children, quote }: { slug: string; seoTitle: string; seoDescription: string; children: ReactNode; quote?: string[] }) {
  const i = SERVICES.findIndex((s) => s.slug === slug);
  const s = SERVICES[i] as Service;
  const prev = SERVICES[(i + SERVICES.length - 1) % SERVICES.length];
  const next = SERVICES[(i + 1) % SERVICES.length];
  const source = quote ?? s.source;

  return (
    <>
      <Seo title={seoTitle} description={seoDescription} path={`/servizi/${slug}`} />
      <PageHeader
        index={`0${i + 1}`}
        eyebrow={s.kicker}
        title={s.title}
        intro={s.lead}
        photo={s.photo}
        aside={<MiniTavola slug={slug} n={i + 1} title={s.nav} />}
        crumbs={[
          { to: '/', label: 'Home' },
          { to: '/servizi', label: 'Servizi' },
          { to: `/servizi/${slug}`, label: s.nav },
        ]}
      />

      <section className="bg-white pb-20 lg:pb-28">
        <div className="container-e3 grid gap-12 lg:grid-cols-12">
          {source.length > 0 && (
            <Reveal className="lg:col-span-6">
              <div className="relative border-l-4 border-sky pl-6 lg:pl-10">
                {source.map((t) => (
                  <p key={t.slice(0, 24)} className={t.length > 260 ? 'mb-5 text-pretty text-lg text-text last:mb-0 lg:text-xl lg:leading-relaxed' : 'mb-5 text-pretty font-display text-2xl leading-snug text-navy last:mb-0 lg:text-[1.9rem]'}>
                    {t}
                  </p>
                ))}
              </div>
            </Reveal>
          )}
          <ul className={source.length > 0 ? 'grid gap-px self-start overflow-hidden rounded-[var(--radius)] bg-line lg:col-span-5 lg:col-start-8' : 'grid gap-px overflow-hidden rounded-[var(--radius)] bg-line sm:grid-cols-3 lg:col-span-12'}>
            {s.points.map((p, k) => (
              <Reveal as="li" key={p.t} delay={k * 0.08} className="flex gap-4 bg-mist-2 p-6">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy text-sky">
                  <Check className="size-4" />
                </span>
                <span>
                  <span className="block font-display text-xl uppercase tracking-wide text-ink">{p.t}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{p.d}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {children}

      <nav aria-label="Altri servizi" className="border-t border-line bg-white">
        <div className="container-e3 grid sm:grid-cols-2">
          <Link to={`/servizi/${prev.slug}`} className="group flex items-center gap-5 border-line py-10 sm:border-r sm:pr-8">
            <ArrowLeft className="size-6 shrink-0 text-sky-ink transition-transform duration-500 group-hover:-translate-x-2" />
            <span>
              <span className="eyebrow block text-muted-foreground">Servizio precedente</span>
              <span className="display mt-2 block text-3xl text-ink transition-colors group-hover:text-navy lg:text-4xl">{prev.nav}</span>
            </span>
          </Link>
          <Link to={`/servizi/${next.slug}`} className="group flex items-center justify-end gap-5 border-t border-line py-10 text-right sm:border-t-0 sm:pl-8">
            <span>
              <span className="eyebrow block text-muted-foreground">Servizio successivo</span>
              <span className="display mt-2 block text-3xl text-ink transition-colors group-hover:text-navy lg:text-4xl">{next.nav}</span>
            </span>
            <ArrowRight className="size-6 shrink-0 text-sky-ink transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </div>
      </nav>

      <CtaBand text={T.servCta} />
    </>
  );
}

/** Tavola di progetto in piccolo, appoggiata sulla foto dell'intestazione */
function MiniTavola({ slug, n, title }: { slug: string; n: number; title: string }) {
  const D = DRAWINGS[slug];
  return (
    <div className="overflow-hidden rounded-[3px] border-2 border-navy bg-white shadow-[0_30px_60px_-25px_rgba(16,37,66,0.6)]">
      <div className="flex items-center justify-between border-b-2 border-navy px-4 py-2 font-display text-xs uppercase tracking-[0.18em] text-navy">
        <span>Tav. 0{n}</span>
        <span className="text-muted-foreground">Edil 3 · Broni</span>
      </div>
      <div className="millimetrata p-4">
        <D className="w-full text-navy" />
      </div>
      <div className="border-t-2 border-navy bg-navy px-4 py-2 font-display text-sm uppercase tracking-wide text-white">{title}</div>
    </div>
  );
}

/** Intestazione delle sezioni interattive */
export function InteractiveHead({ eyebrow, title, text, dark }: { eyebrow: string; title: string; text?: string; dark?: boolean }) {
  return (
    <div className="mb-12 max-w-3xl lg:mb-16">
      <Label dark={dark} n="◆" className="mb-5">
        {eyebrow}
      </Label>
      <h2 className={`display text-balance text-5xl sm:text-6xl lg:text-7xl ${dark ? 'text-white' : ''}`}>{title}</h2>
      {text && <p className={`mt-6 text-pretty text-lg ${dark ? 'text-white/75' : 'text-text'}`}>{text}</p>}
    </div>
  );
}
