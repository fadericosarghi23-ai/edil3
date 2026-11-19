# EDIL3 dei F.lli Jaupi, nuovo sito

Vite + React + TypeScript, Tailwind v4, struttura shadcn (`components.json`, `src/components/ui`, alias `@/`), framer-motion, GSAP + Lenis.

```bash
npm ci
npm run dev            # http://localhost:4820
npm run build          # tsc + vite build in dist/
npm run import:content # reimporta testi e foto da impresaedil3.it
npm run build:logo     # rigenera il logo SVG dai glifi di Open Sans Bold
npm run build:hero     # rigenera le foto prima/dopo dell'hero
```

## Da dove vengono i contenuti

- `scripts/import-content.mjs` legge la sitemap del sito attuale e salva testi completi e foto (WebP sm/md/lg) in `src/data/imported.json` e `public/img/`.
- Colori estratti dal CSS calcolato del sito attuale (`src/index.css`): navy `#102542`, azzurro `#74B9FC`, testo `#111111`/`#333333`. Font: Oswald (titoli) e Open Sans (testi), ospitati in locale.
- Logo: il sito attuale ha solo un JPG 302x39; `scripts/build-logo.mjs` lo ridisegna in SVG.

## Hero

"Via l'amianto, tetto nuovo.": hero 2.5D fotografico. Due foto della stessa casa, prima con il tetto in lastre di fibrocemento e dopo con la copertura nuova; scorrendo, il fronte azzurro attraversa il tetto e scopre quella nuova (`src/components/hero/HeroPhoto.tsx`).

Le foto sono **illustrative, generate con AI** (non sono un cantiere del cliente) e nel sito sono indicate come "Immagine illustrativa". Originali in `assets-src/hero/`; `npm run build:hero` rifà il composito (dal "dopo" si prende solo il tetto, così il resto è identico al pixel) e le versioni WebP. Da sostituire con le foto di una bonifica vera appena il cliente le fornisce.

## Testi scritti da Altalogik (da far confermare)

- Titolo dell'hero ("Via l'amianto, tetto nuovo.") e sottotitolo; didascalie "Stato di fatto" e "Progetto".
- `src/data/services.ts`: `lead` e `points` delle 5 pagine servizio.
- Quiz amianto e 5 tappe della bonifica (`BonificaAmianto.tsx`).
- Strati del tetto (`CopertureTetti.tsx`), segnali da tenere d'occhio (`ImpiantiManutenzione.tsx`).
- Privacy, cookie e note legali (`src/pages/Legal.tsx`).

## Deploy

`netlify.toml`: build `npm run build`, cartella `dist`, Node 22, 301 dai vecchi indirizzi (`/home`), rewrite per le pagine e 404 vera per gli indirizzi inesistenti. Il modulo contatti usa Netlify Forms (modulo statico in `index.html`).
