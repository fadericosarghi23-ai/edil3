import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { Reveal, SplitWords } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { SERVICES } from '@/data/services';
import { SITE, T } from '@/data/site';
import { EASE_EXPO } from '@/lib/motion';
import { cn } from '@/lib/utils';

// messaggi del modulo del sito attuale
const OK = 'Grazie per averci contattato. Ti risponderemo il più presto possibile.';
const KO = "Si è verificato un errore durante l'invio del messaggio. Riprova in un secondo momento.";

const field = 'peer w-full rounded-[var(--radius)] border-2 border-line bg-white px-4 pb-2.5 pt-6 text-base text-ink outline-none transition-colors placeholder-transparent focus:border-navy';
const label = 'pointer-events-none absolute left-4 top-2 font-display text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[0.7rem] peer-focus:text-navy';

function Field({ name, label: l, type = 'text', required, defaultValue, autoComplete }: { name: string; label: string; type?: string; required?: boolean; defaultValue?: string; autoComplete?: string }) {
  return (
    <div className="relative">
      <input id={`f-${name}`} name={name} type={type} required={required} placeholder={l} defaultValue={defaultValue} autoComplete={autoComplete} className={field} />
      <label htmlFor={`f-${name}`} className={label}>
        {l}
        {required && ' *'}
      </label>
    </div>
  );
}

function ContactForm() {
  const [params] = useSearchParams();
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'ko'>('idle');
  const servizio = params.get('servizio') ?? '';
  const messaggio = params.get('messaggio') ?? '';

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState('sending');
    try {
      const body = new URLSearchParams(fd as unknown as Record<string, string>).toString();
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
      if (!r.ok) throw new Error(String(r.status));
      setState('ok');
      form.reset();
    } catch {
      setState('ko');
    }
  };

  return (
    <form name="contatti" method="POST" data-netlify="true" netlify-honeypot="azienda" onSubmit={submit} className="space-y-4">
      <input type="hidden" name="form-name" value="contatti" />
      <p className="hidden">
        <label>
          Non compilare: <input name="azienda" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="nome" label="Nome" autoComplete="given-name" />
        <Field name="cognome" label="Cognome" autoComplete="family-name" />
        <Field name="email" label="Email" type="email" required autoComplete="email" />
        <Field name="telefono" label="Telefono" type="tel" autoComplete="tel" />
      </div>
      <div className="relative">
        <select id="f-servizio" name="servizio" defaultValue={servizio} className={cn(field, 'appearance-none')}>
          <option value="">Nessun servizio in particolare</option>
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.nav}>
              {s.nav}
            </option>
          ))}
          {servizio && !SERVICES.some((s) => s.nav === servizio) && <option value={servizio}>{servizio}</option>}
        </select>
        <label htmlFor="f-servizio" className="pointer-events-none absolute left-4 top-2 font-display text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          Servizio
        </label>
      </div>
      <div className="relative">
        <textarea id="f-messaggio" name="messaggio" rows={5} placeholder="Messaggio" defaultValue={messaggio} className={cn(field, 'resize-y')} />
        <label htmlFor="f-messaggio" className={label}>
          Messaggio
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm text-text">
        <input type="checkbox" name="privacy" value="si" required className="mt-1 size-5 shrink-0 accent-[#102542]" />
        <span>
          Ho letto l’
          <Link to="/privacy" className="font-semibold text-navy underline decoration-sky decoration-2 underline-offset-4">
            Informativa
          </Link>{' '}
          e autorizzo il trattamento dei miei dati personali per le finalità ivi indicate. *
        </span>
      </label>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-muted-foreground">* Campi obbligatori</p>
        <Button type="submit" size="lg" disabled={state === 'sending'}>
          {state === 'sending' ? 'Invio in corso' : 'Invia la richiesta'} <ArrowRight />
        </Button>
      </div>
      <AnimatePresence>
        {(state === 'ok' || state === 'ko') && (
          <motion.p role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn('rounded-[var(--radius)] px-5 py-4 font-semibold', state === 'ok' ? 'bg-sky-soft text-navy' : 'bg-red-50 text-destructive')}>
            {state === 'ok' ? OK : KO}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

/** Mappa: si carica solo dopo il clic (Google Maps può impostare cookie di terze parti) */
function MapOnClick() {
  const [on, setOn] = useState(false);
  const q = encodeURIComponent(SITE.mapsQuery);
  return (
    <div className="relative h-[420px] overflow-hidden rounded-[var(--radius)] bg-navy lg:h-full lg:min-h-[520px]">
      {on ? (
        <iframe title="Mappa della sede di Edil 3 a Broni" src={`https://www.google.com/maps?q=${q}&output=embed`} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-8 text-center text-white">
          <div className="corrugate pointer-events-none absolute inset-0 text-sky opacity-20" aria-hidden />
          <motion.span className="relative grid size-20 place-items-center rounded-full bg-sky text-navy" animate={{ y: [0, -8, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
            <MapPin className="size-9" />
          </motion.span>
          <p className="relative display text-4xl">
            {SITE.street}
            <br />
            <span className="text-sky">
              {SITE.cap} {SITE.city} ({SITE.province})
            </span>
          </p>
          <p className="relative max-w-sm text-sm text-white/70">La mappa è fornita da Google Maps e si carica solo se lo chiedete. Google potrebbe raccogliere dati sulla vostra navigazione.</p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <Button variant="sky" onClick={() => setOn(true)}>
              Mostra la mappa
            </Button>
            <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener" className="inline-flex h-13 items-center px-4 font-display text-sm uppercase tracking-[0.14em] text-sky underline decoration-2 underline-offset-8">
              Apri in Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Contatti() {
  return (
    <>
      <Seo title="Contatti e preventivi | Edil 3 Broni (PV)" description="Richiedete un sopralluogo e un preventivo gratuiti a Edil 3 dei fratelli Jaupi, Via Vescovera 8, Broni (PV). Tel. +39 327 9052873." path="/contatti" />
      <PageHeader eyebrow="Contatti" title={T.contH1} intro={T.contIntro} photo="foto-003" crumbs={[{ to: '/', label: 'Home' }, { to: '/contatti', label: 'Contatti' }]} />

      <section className="bg-white pb-16">
        <div className="container-e3">
        <div className="grid gap-px overflow-hidden rounded-[var(--radius)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Phone, t: 'Chiama', v: SITE.phone, href: SITE.phoneHref },
            { icon: Mail, t: 'Scrivi', v: SITE.email, href: `mailto:${SITE.email}` },
            { icon: MapPin, t: 'Sede', v: `${SITE.street}, ${SITE.city}`, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}` },
            { icon: Clock, t: 'Orari di apertura', v: SITE.hours.map((h) => `${h.days} ${h.time}`).join(' · ') },
          ].map((c, i) => {
            const inner = (
              <>
                <c.icon className="size-6 text-sky-ink transition-transform duration-500 group-hover:-translate-y-1" />
                <span className="eyebrow mt-6 block text-muted-foreground">{c.t}</span>
                <span className="mt-2 block break-words font-display text-xl tracking-wide text-ink">{c.v}</span>
              </>
            );
            return (
              <Reveal key={c.t} delay={i * 0.07} className="bg-white">
                {c.href ? (
                  <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel={c.href.startsWith('http') ? 'noopener' : undefined} className="group block h-full p-7 transition-colors hover:bg-mist">
                    {inner}
                  </a>
                ) : (
                  <div className="group h-full p-7">{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
        </div>
      </section>

      <section className="bg-mist py-24 lg:py-32">
        <div className="container-e3 grid gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <SplitWords as="h2" text={T.contFormH2} className="display mb-10 text-balance text-4xl sm:text-5xl lg:text-6xl" />
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE_EXPO }}>
              <ContactForm />
            </motion.div>
          </div>
          <MapOnClick />
        </div>
      </section>
    </>
  );
}
