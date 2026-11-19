import { sentence } from './site';

/**
 * Le 5 pagine servizio. Il sito attuale ha un'unica pagina "Servizi": le voci qui sotto sono
 * i servizi che lo stesso sito elenca nei suoi testi (home, servizi, contatti).
 *
 * - `source`: frasi ORIGINALI del sito attuale, citate testualmente
 * - `lead`, `points`: TESTI SCRITTI DA ALTALOGIK, da far confermare al cliente
 */
export type Service = {
  slug: string;
  nav: string;
  title: string;
  kicker: string;
  lead: string;
  source: string[];
  points: { t: string; d: string }[];
  photo: string;
  /** citazione del sito attuale da cui nasce il servizio */
  from: string;
};

export const SERVICES: Service[] = [
  {
    slug: 'bonifica-amianto',
    nav: 'Bonifica amianto',
    title: 'Bonifica amianto',
    kicker: 'Smaltimento e rifacimento',
    lead: 'Coperture in fibrocemento rimosse in sicurezza, smaltite secondo le norme e sostituite con un tetto nuovo. Un solo interlocutore dal sopralluogo alla nuova copertura.',
    source: [
      sentence('/', 'Inoltre, la Edil 3 si impegna'),
    ],
    points: [
      { t: 'Sopralluogo gratuito', d: 'Un incaricato viene a vedere la copertura e valuta con voi come intervenire.' },
      { t: 'Rimozione e smaltimento', d: 'Le lastre vengono rimosse e conferite secondo la normativa vigente.' },
      { t: 'Tetto nuovo', d: 'Dopo la bonifica, la stessa impresa rifà la copertura e la impermeabilizza.' },
    ],
    photo: 'foto-005',
    from: 'Home',
  },
  {
    slug: 'coperture-tetti',
    nav: 'Coperture e tetti',
    title: 'Coperture e impermeabilizzazioni',
    kicker: 'Rifacimento tetti',
    lead: 'Rifacimento e manutenzione di tetti per case, capannoni e fabbricati: struttura, isolamento, impermeabilizzazione e manto di copertura.',
    source: [
      sentence('/', 'Si occupa di costruzioni edili'),
      sentence('/', 'Inoltre, la Edil 3 si impegna'),
    ],
    points: [
      { t: 'Rifacimento completo', d: 'Dalla struttura al manto, il tetto viene rifatto strato per strato.' },
      { t: 'Impermeabilizzazione', d: 'Guaine e lattonerie per fermare le infiltrazioni.' },
      { t: 'Coibentazione', d: 'Isolamento termico della copertura per abitare e lavorare meglio.' },
    ],
    photo: 'foto-004',
    from: 'Home',
  },
  {
    slug: 'costruzioni-chiavi-in-mano',
    nav: 'Costruzioni chiavi in mano',
    title: 'Costruzioni chiavi in mano',
    kicker: 'Civili e industriali',
    lead: 'Case, villette, capannoni e fabbricati realizzati dalle fondamenta alle finiture, con un unico referente per tutto il cantiere.',
    source: [],
    points: [
      { t: 'Civile e industriale', d: 'Case, villette, capannoni, fabbricati e altre strutture.' },
      { t: 'Dalle fondamenta al tetto', d: 'Ogni lavorazione del cantiere seguita dalla stessa impresa.' },
      { t: 'Rispetto delle norme', d: 'Un servizio completo e rispettoso di tutte le normative vigenti.' },
    ],
    photo: 'foto-001',
    from: 'Home',
  },
  {
    slug: 'ristrutturazioni-finiture',
    nav: 'Ristrutturazioni e finiture',
    title: 'Ristrutturazioni, restauri e finiture',
    kicker: 'Interni ed esterni',
    lead: 'Ristrutturazioni interne ed esterne di case, uffici e capannoni: murature, restauri, pavimenti, infissi e finiture di pregio.',
    source: [],
    points: [
      { t: 'Interni ed esterni', d: 'Ristrutturazioni civili e industriali, dentro e fuori.' },
      { t: 'Restauro e finitura', d: 'Opere di restauro, murature, rivestimenti e finiture.' },
      { t: 'Pavimenti e infissi', d: 'Dalla posa dei pavimenti agli infissi.' },
    ],
    photo: 'foto-006',
    from: 'Servizi',
  },
  {
    slug: 'impianti-manutenzione',
    nav: 'Impianti e manutenzione',
    title: 'Impianti, coibentazioni e manutenzione stabili',
    kicker: 'Elettrico, idraulico, isolamento',
    lead: 'Impianti elettrici e idraulici, coibentazioni e manutenzione di stabili civili e industriali, anche come singoli interventi.',
    source: [],
    points: [
      { t: 'Impianto elettrico', d: 'Impiantistica elettrica per case, uffici e capannoni.' },
      { t: 'Impianto idraulico', d: 'Impiantistica idraulica nelle nuove costruzioni e nelle ristrutturazioni.' },
      { t: 'Coibentazioni', d: 'Isolamento di pareti e coperture.' },
    ],
    photo: 'foto-002',
    from: 'Servizi',
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
