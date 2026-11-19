import imported from './imported.json';

/** Dati aziendali: tutti presi dal footer e dalle pagine del sito attuale (vedi imported.json). */
export const SITE = {
  name: 'EDIL3 dei F.lli Jaupi',
  short: 'Edil 3',
  url: 'https://www.impresaedil3.it',
  // il footer dice "Via Vescovera", il testo della home "in via Vescovera al numero civico 8"
  street: 'Via Vescovera 8',
  cap: '27043',
  city: 'Broni',
  province: 'PV',
  area: 'provincia di Pavia',
  phone: imported.footer.phone, // +39 327 9052873
  phoneHref: 'tel:+393279052873',
  email: imported.footer.email,
  vat: imported.footer.vat,
  hours: [
    { days: 'Lun - Ven', time: '9:00 - 17:00' },
    { days: 'Sab - Dom', time: 'Chiuso' },
  ],
  mapsQuery: 'Via Vescovera 8, 27043 Broni PV',
} as const;

export type Block = { type: string; text: string; href?: string };
type PageKey = keyof typeof imported.pages;

/** blocchi importati di una pagina del sito attuale, nell'ordine originale */
export const pageBlocks = (key: PageKey) => imported.pages[key].blocks as Block[];

/** testo del blocco che segue il titolo indicato (paragrafi completi, non riassunti) */
export function textsAfter(key: PageKey, heading: string): string[] {
  const blocks = pageBlocks(key);
  const i = blocks.findIndex((b) => b.text === heading);
  if (i < 0) return [];
  const out: string[] = [];
  for (const b of blocks.slice(i + 1)) {
    if (b.type !== 'p') break;
    out.push(b.text);
  }
  return out;
}

/** primo paragrafo (lungo) di una pagina, quello di presentazione */
export const introOf = (key: PageKey) => pageBlocks(key).find((b) => b.type === 'p' && b.text.length > 200)?.text ?? '';

export const T = {
  // home
  homeClaim: "Costruiamo i vostri sogni con l'eccellenza", // originale: "...con l'eccenza" (refuso corretto)
  homeH1: 'Impresa edile leader a Broni, in provincia di Pavia',
  homeIntro: introOf('/'),
  homeKeyH2: 'Costruzioni chiavi in mano',
  homeKey: textsAfter('/', 'Costruzioni chiavi in mano'),
  homeExcH2: 'L’eccellenza dell’edilizia pavese',
  homeExc: textsAfter('/', 'L’eccellenza dell’edilizia pavese').filter((t) => !t.startsWith('Per i tuoi')),
  homeCta: 'Per i tuoi lavori di edilizia, chiama e richiedi un preventivo gratuito!',
  // servizi
  servH1: 'Servizi di edilizia civile a Broni, in provincia di Pavia',
  servIntro: introOf('/servizi'),
  servCivH2: 'Edilizia civile e industriale',
  servCiv: textsAfter('/servizi', 'Edilizia civile e industriale'),
  servFreeH2: 'Preventivi e sopralluoghi gratuiti',
  servFree: textsAfter('/servizi', 'Preventivi e sopralluoghi gratuiti').filter((t) => !t.startsWith('Chiama per')),
  servCta: 'Chiama per richiedere un sopralluogo e un preventivo gratuito!',
  // contatti
  contH1: 'Lavori edili chiavi in mano a Broni, in provincia di Pavia',
  contFormH2: 'Richiedi un preventivo per lavori edili compilando il modulo di contatto!',
  contIntro: introOf('/contatti'),
} as const;

export const PHOTOS = imported.photos;

/** frase originale (fino al punto) che inizia con `start`, cercata nei testi importati di una pagina */
export function sentence(key: PageKey, start: string): string {
  for (const b of pageBlocks(key)) {
    const i = b.text.indexOf(start);
    if (i >= 0) {
      const rest = b.text.slice(i);
      const end = rest.search(/[.!?](\s|$)/);
      return end >= 0 ? rest.slice(0, end + 1) : rest;
    }
  }
  if (import.meta.env.DEV) console.warn('frase non trovata:', start);
  return '';
}
