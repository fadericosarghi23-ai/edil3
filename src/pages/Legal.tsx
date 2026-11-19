/**
 * Privacy, cookie e note legali, riscritte sulla base di ciò che il nuovo sito usa davvero:
 * nessun cookie, nessun analytics, font ospitati in locale, modulo contatti su Netlify Forms,
 * Google Maps solo dopo il clic del visitatore.
 * TESTI SCRITTI DA ALTALOGIK: da far verificare al cliente (o al suo consulente) prima della pubblicazione.
 */
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Seo } from '@/components/layout/Seo';
import { SITE } from '@/data/site';

const UPDATED = '19 novembre 2026';

function LegalBody({ children }: { children: ReactNode }) {
  return (
    <section className="bg-white pb-28">
      <div className="container-e3">
        <div className="max-w-3xl space-y-6 text-text [&_a]:font-semibold [&_a]:text-navy [&_a]:underline [&_a]:decoration-sky [&_a]:decoration-2 [&_a]:underline-offset-4 [&_h2]:display [&_h2]:pt-8 [&_h2]:text-3xl [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
          {children}
          <p className="pt-8 text-sm text-muted-foreground">Ultimo aggiornamento: {UPDATED}</p>
        </div>
      </div>
    </section>
  );
}

const Titolare = () => (
  <p>
    {SITE.name}, {SITE.street}, {SITE.cap} {SITE.city} ({SITE.province}), P.IVA {SITE.vat}. Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, telefono <a href={SITE.phoneHref}>{SITE.phone}</a>.
  </p>
);

export function Privacy() {
  return (
    <>
      <Seo title="Informativa privacy | Edil 3" description="Informativa sul trattamento dei dati personali del sito di Edil 3 dei F.lli Jaupi, Broni (PV)." path="/privacy" />
      <PageHeader eyebrow="Informativa" title="Privacy" crumbs={[{ to: '/', label: 'Home' }, { to: '/privacy', label: 'Privacy' }]} intro="Informativa ai sensi degli articoli 13 e 14 del Regolamento UE 2016/679 (GDPR) per chi visita questo sito e per chi ci scrive tramite il modulo contatti." />
      <LegalBody>
        <h2>Titolare del trattamento</h2>
        <Titolare />
        <h2>Quali dati trattiamo</h2>
        <ul>
          <li>
            <strong>Dati inviati con il modulo contatti</strong>: nome, cognome, email, telefono, servizio di interesse e testo del messaggio. L’email è obbligatoria, gli altri campi sono facoltativi.
          </li>
          <li>
            <strong>Dati di navigazione</strong>: il server che ospita il sito registra in automatico dati tecnici come indirizzo IP, data e ora della richiesta e pagina visitata. Servono solo a far funzionare il sito e a garantirne la sicurezza.
          </li>
        </ul>
        <p>Il sito non usa strumenti di statistica, di profilazione o di pubblicità e non installa cookie (vedi la <Link to="/cookie">pagina cookie</Link>).</p>
        <h2>Perché li trattiamo</h2>
        <ul>
          <li>Per rispondere alle vostre richieste di informazioni, sopralluogo e preventivo: la base giuridica è l’esecuzione di misure precontrattuali richieste da voi (art. 6, par. 1, lett. b GDPR).</li>
          <li>Per la sicurezza e il funzionamento del sito: la base giuridica è il legittimo interesse del titolare (art. 6, par. 1, lett. f GDPR).</li>
        </ul>
        <h2>Per quanto tempo</h2>
        <p>I messaggi ricevuti dal modulo vengono conservati per il tempo necessario a gestire la richiesta. Se la richiesta porta a un contratto, i dati vengono conservati per la durata prevista dalle norme civilistiche e fiscali.</p>
        <h2>A chi li comunichiamo</h2>
        <p>
          Il sito è ospitato da Netlify, Inc., che riceve anche i messaggi del modulo contatti e agisce come responsabile del trattamento. Netlify ha sede negli Stati Uniti: il trasferimento avviene sulla base delle clausole contrattuali standard della Commissione europea e del Data Privacy Framework UE e USA. I dati non vengono venduti né ceduti a terzi per finalità commerciali.
        </p>
        <p>
          Se scegliete di visualizzare la mappa nella pagina contatti, il contenuto viene fornito da Google (Google Ireland Limited), che tratta i dati secondo la propria <a href="https://policies.google.com/privacy?hl=it" target="_blank" rel="noopener">informativa privacy</a>.
        </p>
        <h2>I vostri diritti</h2>
        <p>
          Potete chiedere in qualunque momento l’accesso ai vostri dati, la rettifica, la cancellazione, la limitazione del trattamento, la portabilità e opporvi al trattamento (articoli da 15 a 22 GDPR), scrivendo a <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Avete inoltre il diritto di presentare reclamo al{' '}
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">
            Garante per la protezione dei dati personali
          </a>
          .
        </p>
      </LegalBody>
    </>
  );
}

export function CookiePage() {
  return (
    <>
      <Seo title="Cookie | Edil 3" description="Informativa sui cookie del sito di Edil 3 dei F.lli Jaupi: il sito non installa cookie." path="/cookie" />
      <PageHeader eyebrow="Informativa" title="Cookie" crumbs={[{ to: '/', label: 'Home' }, { to: '/cookie', label: 'Cookie' }]} intro="In breve: questo sito non installa cookie, né tecnici né di profilazione, e per questo non vi chiede il consenso con un banner." />
      <LegalBody>
        <h2>Cosa usa il sito</h2>
        <ul>
          <li>Nessun cookie di statistica (niente Google Analytics o strumenti simili).</li>
          <li>Nessun cookie di profilazione o pubblicità.</li>
          <li>Nessun cookie tecnico proprio: il sito non ha aree riservate né carrello.</li>
          <li>I caratteri tipografici sono ospitati sul sito stesso: nessuna richiesta a Google Fonts.</li>
        </ul>
        <h2>Servizi esterni attivati da voi</h2>
        <p>
          Nella pagina <Link to="/contatti">contatti</Link> la mappa di Google Maps non viene caricata in automatico. Si carica solo se premete “Mostra la mappa”: da quel momento Google può impostare i propri cookie, regolati dalla{' '}
          <a href="https://policies.google.com/technologies/cookies?hl=it" target="_blank" rel="noopener">
            cookie policy di Google
          </a>
          . Allo stesso modo, il link “Apri in Google Maps” porta sul sito di Google.
        </p>
        <h2>Come gestire i cookie</h2>
        <p>Potete cancellare o bloccare i cookie in ogni momento dalle impostazioni del vostro browser.</p>
        <h2>Titolare</h2>
        <Titolare />
      </LegalBody>
    </>
  );
}

export function NoteLegali() {
  return (
    <>
      <Seo title="Note legali | Edil 3" description="Dati societari e note legali del sito di Edil 3 dei F.lli Jaupi, Broni (PV)." path="/note-legali" />
      <PageHeader eyebrow="Informazioni legali" title="Note legali" crumbs={[{ to: '/', label: 'Home' }, { to: '/note-legali', label: 'Note legali' }]} />
      <LegalBody>
        <h2>Dati dell’impresa</h2>
        <Titolare />
        <h2>Contenuti del sito</h2>
        <p>I testi e le informazioni pubblicati hanno scopo informativo. Il test sull’amianto e gli strumenti interattivi del sito sono orientativi e non sostituiscono un sopralluogo o le analisi previste dalla normativa.</p>
        <p>Alcune fotografie del sito sono immagini di repertorio e non ritraggono cantieri dell’impresa.</p>
        <h2>Link ad altri siti</h2>
        <p>I link verso siti esterni sono forniti per comodità: l’impresa non è responsabile dei loro contenuti.</p>
      </LegalBody>
    </>
  );
}
