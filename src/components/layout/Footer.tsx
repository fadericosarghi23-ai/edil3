import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICES } from '@/data/services';
import { SITE } from '@/data/site';
import { WaveLine } from '@/components/motion/WaveLine';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <WaveLine className="text-sky" />
      <div className="container-e3 grid gap-12 pb-10 pt-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:pt-24">
        <div className="space-y-6">
          <img src="/brand/logo-light.svg" alt="EDIL3 dei F.lli Jaupi" width={1060} height={94} className="h-6 w-auto" loading="lazy" />
          <p className="max-w-sm text-sm text-white/65">Impresa edile a Broni, in provincia di Pavia. Bonifica amianto, coperture, costruzioni e ristrutturazioni chiavi in mano.</p>
          <Link to="/contatti" className="group inline-flex items-center gap-2 font-display uppercase tracking-[0.14em] text-sky">
            Richiedi un sopralluogo gratuito
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div>
          <h2 className="eyebrow mb-5 text-sky">Sede e recapiti</h2>
          <ul className="space-y-4 text-sm text-white/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sky" />
              <span>
                {SITE.street}
                <br />
                {SITE.cap} {SITE.city} {SITE.province}, Italia
              </span>
            </li>
            <li>
              <a href={SITE.phoneHref} className="flex gap-3 hover:text-sky">
                <Phone className="mt-0.5 size-4 shrink-0 text-sky" />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="flex gap-3 break-all hover:text-sky">
                <Mail className="mt-0.5 size-4 shrink-0 text-sky" />
                {SITE.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow mb-5 text-sky">Servizi</h2>
          <ul className="space-y-2.5 text-sm text-white/80">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link to={`/servizi/${s.slug}`} className="hover:text-sky">
                  {s.nav}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="eyebrow mb-5 text-sky">Orari di apertura</h2>
          <dl className="space-y-2.5 text-sm">
            {SITE.hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
                <dt className="text-white/60">{h.days}</dt>
                <dd className="font-display tracking-wider">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="container-e3 relative">
        <p aria-hidden className="display pointer-events-none select-none whitespace-nowrap text-[22vw] leading-[0.8] text-white/[0.04] lg:text-[16rem]">
          EDIL3
        </p>
      </div>

      <div className="border-t border-white/10">
        <div className="container-e3 flex flex-col gap-3 py-6 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {SITE.name} · P.I. {SITE.vat}
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <Link to="/note-legali" className="hover:text-sky">
                Note legali
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-sky">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/cookie" className="hover:text-sky">
                Cookie
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
