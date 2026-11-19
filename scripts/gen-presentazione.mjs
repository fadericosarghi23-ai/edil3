// Presentazione cliente Altalogik per EDIL3 dei F.lli Jaupi (5 pagine A4).
// Struttura del toolkit Altalogik (_altalogik-pdf), identità del sito EDIL3:
// Oswald (titoli) e Open Sans (testi), navy #102542 e azzurro #74B9FC, etichette da tavola tecnica,
// carta millimetrata, nastro di cantiere, schermate reali del nuovo sito.
// Uso: node scripts/gen-presentazione.mjs <out.html> <altalogik-logo.svg> <cartella screenshot>
// poi Chrome headless --print-to-pdf.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const [OUT, AL_LOGO, SHOTS] = process.argv.slice(2);
const b64 = (p) => fs.readFileSync(p).toString('base64');
const font = (pkg, file) => b64(path.join(ROOT, 'node_modules/@fontsource', pkg, 'files', file));
const svgData = (p) => 'data:image/svg+xml;base64,' + b64(path.join(ROOT, p));
async function img(p, w, q = 80) {
  const b = await sharp(path.join(ROOT, p)).resize({ width: w, withoutEnlargement: true }).jpeg({ quality: q }).toBuffer();
  return 'data:image/jpeg;base64,' + b.toString('base64');
}
async function shot(n) {
  const b = await sharp(path.join(SHOTS, n + '.png')).resize({ width: 1100 }).jpeg({ quality: 82 }).toBuffer();
  return 'data:image/jpeg;base64,' + b.toString('base64');
}

const alLogo = fs.readFileSync(AL_LOGO, 'utf8');
const logoDark = svgData('public/brand/logo.svg');
const logoLight = svgData('public/brand/logo-light.svg');
const cover = await img('public/img/hero-dopo-lg.webp', 1600, 82);
const prima = await img('public/img/hero-prima-md.webp', 900, 78);
const dopo = await img('public/img/hero-dopo-md.webp', 900, 78);
const closing = await img('public/img/foto-004-lg.webp', 1400, 78);

const elementi = [
  { s: await shot('hero'), n: '01', t: 'La bonifica in apertura', d: 'Scorrendo, un fronte azzurro attraversa il tetto e al posto delle lastre in fibrocemento compare la copertura nuova.' },
  { s: await shot('cartello'), n: '02', t: 'Il cartello di cantiere', d: 'L’impresa si presenta con il formato che tutti riconoscono davanti a un lavoro edile, con i Suoi dati reali.' },
  { s: await shot('tavole'), n: '03', t: 'I servizi come tavole', d: 'Cinque schede in stile tavola di progetto scorrono di lato; al passaggio del mouse compare il disegno tecnico.' },
  { s: await shot('quiz'), n: '04', t: 'Il test sull’amianto', d: 'Tre domande per capire se il tetto può contenere amianto, poi l’invito al sopralluogo gratuito.' },
  { s: await shot('esploso'), n: '05', t: 'Il tetto strato per strato', d: 'Un cursore separa gli strati della copertura e spiega a cosa serve ciascuno.' },
  { s: await shot('configuratore'), n: '06', t: 'La richiesta in tre scelte', d: 'Immobile, zona e lavori: il testo della richiesta arriva già scritto nel modulo contatti.' },
];

const criticita = [
  { n: '01', t: 'Un refuso nella prima frase', d: 'Il titolo che si legge appena aperto il sito è “Costruiamo i vostri sogni con l’eccenza”, sia da computer sia da telefono.', r: 'Il testo è corretto in “l’eccellenza” e affiancato da un titolo nuovo, chiaro sul Suo mestiere: “Via l’amianto, tetto nuovo.”' },
  { n: '02', t: 'L’attività principale quasi invisibile', d: 'La parola “amianto” compare una sola volta in tutto il sito e mai nella pagina Servizi; titoli e descrizioni parlano solo di costruzioni e rifiniture.', r: 'La bonifica amianto apre il sito e ha una pagina propria, con test, percorso a tappe, titolo e descrizione pensati per farsi trovare nelle ricerche.' },
  { n: '03', t: 'Solo foto di repertorio', d: 'Le sette foto del sito sono immagini stock di cantieri esteri, e tra i file è rimasto uno sfondo viola preso da un altro modello del costruttore.', r: 'Foto ottimizzate in WebP, sfondo estraneo eliminato e spazi già pronti per le foto dei Suoi cantieri, che consigliamo di inserire al più presto.' },
  { n: '04', t: 'Privacy generica', d: 'L’informativa non indica il titolare del trattamento, l’indirizzo nel piè di pagina non ha il numero civico e al caricamento partono servizi di analisi esterni.', r: 'Privacy e cookie riscritte sul nuovo sito, con titolare e dati completi: nessun cookie, nessun sistema di analisi, mappa caricata solo al clic.' },
  { n: '05', t: 'Una sola pagina e un menu fragile', d: 'Tutti i servizi stanno in un’unica pagina di testo e, a una larghezza di circa 800 pixel, il logo va su due righe e la scritta esce dal pulsante.', r: 'Cinque pagine servizio, ognuna con una sezione interattiva diversa, e un menu con tendina e versione per telefono, provati su schermi grandi e piccoli.' },
];

const perche = [
  { t: 'Cura su misura', d: 'Ogni pagina è progettata sul Suo lavoro: bonifiche, coperture, cantieri. Non un modello preconfezionato, ma un sito che La rappresenta.' },
  { t: 'Pensato per chiedere un sopralluogo', d: 'Telefono, sopralluogo gratuito e modulo contatti sono sempre a portata di mano, su computer e su telefono, con le richieste già precompilate.' },
  { t: 'Veloce e in regola', d: 'Caratteri e immagini dal nostro server, foto ottimizzate e nessun cookie: un sito rapido che non chiede consensi ai visitatori.' },
  { t: 'Un solo interlocutore', d: 'Seguiamo l’intero progetto, dai contenuti alle immagini fino alla messa online, con un unico riferimento.' },
];
const passi = [
  { t: 'Le Sue conferme', d: 'I testi scritti da noi, il numero civico, la forma societaria, l’email aziendale e i passaggi della bonifica che gestite direttamente.' },
  { t: 'Le foto dei cantieri', d: 'Una bonifica vera per sostituire l’immagine illustrativa dell’apertura e le foto dei Suoi lavori al posto di quelle di repertorio.' },
  { t: 'La messa online', d: 'Pubblicazione su Netlify e collegamento del dominio impresaedil3.it, con i reindirizzamenti dai vecchi indirizzi.' },
];

const swatches = [
  { c: '#102542', l: 'Navy', h: '102542', dark: true },
  { c: '#74B9FC', l: 'Azzurro', h: '74B9FC' },
  { c: '#111111', l: 'Inchiostro', h: '111111', dark: true },
  { c: '#333333', l: 'Testo', h: '333333', dark: true },
  { c: '#939393', l: 'Grigio', h: '939393', dark: true },
  { c: '#F3F3F3', l: 'Nebbia', h: 'F3F3F3' },
  { c: '#FFFFFF', l: 'Bianco', h: 'FFFFFF' },
];

const STRIPES = 'repeating-linear-gradient(-45deg,#102542 0 9px,#74b9fc 9px 18px)';
const MM = (a, b) =>
  `linear-gradient(rgba(116,185,252,${a}) 1px,transparent 1px),linear-gradient(90deg,rgba(116,185,252,${a}) 1px,transparent 1px),linear-gradient(rgba(116,185,252,${b}) 1px,transparent 1px),linear-gradient(90deg,rgba(116,185,252,${b}) 1px,transparent 1px)`;

const CSS = `
@font-face{font-family:'Oswald';font-weight:500;src:url(data:font/woff2;base64,${font('oswald', 'oswald-latin-500-normal.woff2')}) format('woff2')}
@font-face{font-family:'Oswald';font-weight:700;src:url(data:font/woff2;base64,${font('oswald', 'oswald-latin-700-normal.woff2')}) format('woff2')}
@font-face{font-family:'Open Sans';font-weight:400;src:url(data:font/woff2;base64,${font('open-sans', 'open-sans-latin-400-normal.woff2')}) format('woff2')}
@font-face{font-family:'Open Sans';font-weight:600;src:url(data:font/woff2;base64,${font('open-sans', 'open-sans-latin-600-normal.woff2')}) format('woff2')}
@font-face{font-family:'Open Sans';font-weight:700;src:url(data:font/woff2;base64,${font('open-sans', 'open-sans-latin-700-normal.woff2')}) format('woff2')}
:root{--navy:#102542;--deep:#0b1b31;--soft:#1a3152;--sky:#74B9FC;--skyink:#3f79b4;--ink:#111111;--text:#333333;--grey:#939393;--mist:#F3F3F3;--line-l:#dde2e8;--line-d:rgba(116,185,252,.2)}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Open Sans',Arial,sans-serif}
@page{size:A4;margin:0}
.page{position:relative;width:210mm;height:297mm;overflow:hidden;page-break-after:always;display:flex;flex-direction:column}
.page:last-child{page-break-after:auto}
.light{background:#fff;color:var(--ink)}
.light.mm{background-color:#fff;background-image:${MM(0.28, 0.12)};background-size:40px 40px,40px 40px,8px 8px,8px 8px}
.dark{background-color:var(--navy);color:#fff;background-image:${MM(0.16, 0.06)};background-size:40px 40px,40px 40px,8px 8px,8px 8px}
.pad{padding:17mm 17mm 16mm}
.tag{display:inline-flex;align-items:center;gap:8px;font-family:'Oswald';font-weight:500;font-size:9.5px;letter-spacing:.18em;text-transform:uppercase}
.tag i{font-style:normal;padding:3px 6px;background:var(--navy);color:var(--sky)}
.dark .tag{color:var(--sky)} .dark .tag i{background:var(--sky);color:var(--navy)}
.light .tag{color:var(--navy)}
.h{font-family:'Oswald';font-weight:700;text-transform:uppercase;letter-spacing:-.005em;line-height:.98}
.h .c{color:var(--skyink)} .dark .h .c{color:var(--sky)}
.body{font-size:12.5px;line-height:1.6}
.light .muted{color:var(--text)} .dark .muted{color:rgba(255,255,255,.75)}
.rule{height:1px;width:100%}
.light .rule{background:var(--line-l)} .dark .rule{background:var(--line-d)}
.tape{position:absolute;left:0;right:0;height:5px;background:${STRIPES}}
.foot{position:absolute;left:17mm;right:17mm;bottom:10mm;display:flex;justify-content:space-between;font-family:'Oswald';font-weight:500;font-size:8px;letter-spacing:.18em;text-transform:uppercase}
.light .foot{color:#8a949d} .dark .foot{color:rgba(255,255,255,.55)}
.btn{display:inline-flex;align-items:center;gap:7px;border-radius:3px;font-family:'Oswald';font-weight:500;text-transform:uppercase;letter-spacing:.12em}

/* copertina */
.cv-hero{position:absolute;inset:0}
.cv-hero img{width:100%;height:100%;object-fit:cover;object-position:68% 50%}
.cv-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(16,37,66,.55) 0%,rgba(16,37,66,.15) 28%,rgba(16,37,66,.55) 52%,rgba(16,37,66,.95) 72%,#102542 84%)}
.cv-top{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:15mm 17mm 0}
.cv-top .al svg{height:36px;width:auto;display:block}
.cv-top .t{font-family:'Oswald';font-weight:500;font-size:9px;letter-spacing:.26em;color:#fff}
.cv-ill{position:absolute;right:17mm;top:30mm;z-index:2;font-size:8px;color:rgba(255,255,255,.75);background:rgba(16,37,66,.45);padding:3px 7px}
.cv-body{position:relative;z-index:2;margin-top:auto;padding:0 17mm 16mm}
.cv-body img.logo{height:22px;display:block}
.cv-name{font-size:74px;margin-top:20px}
.cv-sub{font-family:'Oswald';font-weight:500;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.8);margin-top:14px}
.cv-chips{display:flex;gap:8px;margin-top:20px;flex-wrap:wrap}
.cv-chips span{font-size:10.5px;color:#fff;border:1px solid rgba(116,185,252,.45);background:rgba(116,185,252,.1);border-radius:3px;padding:6px 11px}
.cv-foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:22px}
.cv-foot .l{font-size:12px;line-height:1.55}
.cv-foot .r{font-family:'Oswald';font-weight:500;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.7)}

/* identità */
.logos{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}
.tile{border-radius:3px;display:flex;align-items:center;justify-content:center;height:30mm;border:2px solid var(--navy)}
.tile.d{background:var(--navy)} .tile.l{background:#fff}
.tile img{height:7mm}
.cap{font-size:10px;color:#6b7480;margin-top:6px;line-height:1.45}
.type{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
.tcard{border:2px solid var(--navy);border-radius:3px;background:#fff}
.tcard .hd{display:flex;justify-content:space-between;border-bottom:2px solid var(--navy);padding:6px 10px;font-family:'Oswald';font-weight:500;font-size:8.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--navy)}
.tcard .bd{padding:10px 12px 12px}
.hier{margin-top:12px;border:2px solid var(--navy);border-radius:3px;background:#fff;display:grid;grid-template-columns:30mm 1fr}
.hier .k{border-right:2px solid var(--navy);border-bottom:1.5px solid rgba(16,37,66,.8);background:var(--mist);padding:8px 10px;font-family:'Oswald';font-weight:500;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--navy)}
.hier .v{border-bottom:1.5px solid rgba(16,37,66,.8);padding:8px 12px;display:flex;align-items:center;gap:8px}
.hier .k:nth-last-child(2),.hier .v:last-child{border-bottom:0}
.sw{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:10px}
.sw .s{height:21mm;border-radius:3px;display:flex;flex-direction:column;justify-content:flex-end;padding:7px 8px;border:1px solid var(--line-l)}
.sw .s b{font-family:'Oswald';font-weight:500;font-size:9px;letter-spacing:.06em;text-transform:uppercase}
.sw .s span{font-size:8px;opacity:.85;margin-top:1px}
.pd{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
.pd figure{position:relative;aspect-ratio:16/9;overflow:hidden;border:2px solid var(--navy);border-radius:3px}
.pd img{width:100%;height:100%;object-fit:cover;object-position:70% 50%;display:block}
.pd figcaption{position:absolute;left:0;top:0;font-family:'Oswald';font-weight:500;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;background:var(--navy);color:#fff;padding:3px 7px}
.pd figcaption i{font-style:normal;color:var(--sky);margin-right:6px}

/* esperienza */
.egrid{display:grid;grid-template-columns:1fr 1fr;gap:9px 12px;margin-top:10px}
.ecard{background:var(--deep);border:2px solid rgba(116,185,252,.35);border-radius:3px;overflow:hidden}
.ecard .eh{display:flex;justify-content:space-between;padding:5px 10px;border-bottom:1px solid var(--line-d);font-family:'Oswald';font-weight:500;font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:var(--sky)}
.ecard figure{aspect-ratio:16/8.6;overflow:hidden}
.ecard img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.ecard .tx{padding:7px 10px 9px;border-top:1px solid var(--line-d)}
.ecard .et{font-family:'Oswald';font-weight:700;font-size:13px;text-transform:uppercase}
.ecard .ed{font-size:10px;line-height:1.45;margin-top:3px;color:rgba(255,255,255,.75)}

/* criticità */
.crit .item{padding:13px 0}
.crit .top{display:flex;gap:12px;align-items:center}
.crit .num{font-family:'Oswald';font-weight:500;font-size:11px;background:var(--navy);color:var(--sky);padding:3px 7px}
.crit .ct{font-family:'Oswald';font-weight:700;font-size:17px;text-transform:uppercase}
.crit .cd{font-size:12px;line-height:1.55;margin:7px 0 0 38px;color:var(--text)}
.crit .resp{margin:9px 0 0 38px;padding:9px 13px;border-left:4px solid var(--sky);background:rgba(116,185,252,.12);font-size:12px;line-height:1.55}
.crit .resp b{font-family:'Oswald';font-weight:500;font-size:9px;letter-spacing:.16em;color:var(--navy);margin-right:7px}

/* perché */
.prow{display:grid;grid-template-columns:56mm 1fr;gap:16px;padding:11px 0;align-items:start}
.prow .pl{font-family:'Oswald';font-weight:700;font-size:14px;text-transform:uppercase;color:#fff}
.prow .pr{font-size:12px;line-height:1.55;color:rgba(255,255,255,.75)}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:10px}
.step{background:var(--deep);border:2px solid rgba(116,185,252,.35);border-radius:3px;padding:11px}
.step .n{display:inline-block;background:var(--sky);color:var(--navy);font-family:'Oswald';font-weight:500;font-size:10px;padding:2px 7px}
.step .st{font-family:'Oswald';font-weight:700;font-size:12px;text-transform:uppercase;margin-top:8px}
.step .sd{font-size:10px;line-height:1.45;color:rgba(255,255,255,.75);margin-top:4px}
.close{position:relative;height:96mm;margin-top:auto;overflow:hidden}
.close img{width:100%;height:100%;object-fit:cover}
.close:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,#102542 0%,rgba(16,37,66,.5) 38%,rgba(16,37,66,.88) 100%)}
.close .cap2{position:absolute;left:17mm;right:17mm;bottom:20mm;z-index:2;display:flex;justify-content:space-between;align-items:flex-end}
.close .ch{font-size:34px;color:#fff}
.close .btn{background:var(--sky);color:var(--navy);font-size:9.5px;padding:10px 16px;white-space:nowrap}
`;

const foot = (n, label) => `<div class="foot"><span>EDIL3 dei F.lli Jaupi · ${label}</span><span>Altalogik · 0${n}</span></div>`;

const p1 = `<div class="page dark" style="background-image:none">
  <div class="cv-hero"><img src="${cover}" alt=""></div>
  <div class="tape" style="top:0"></div>
  <div class="cv-top"><span class="al">${alLogo}</span><span class="t">PRESENTAZIONE CLIENTE</span></div>
  <span class="cv-ill">Immagine illustrativa</span>
  <div class="cv-body">
    <img class="logo" src="${logoLight}" alt="EDIL3 dei F.lli Jaupi">
    <div class="h cv-name">Via l’amianto,<br><span class="c">tetto nuovo.</span></div>
    <div class="cv-sub">EDIL3 dei F.lli Jaupi · Bonifica amianto e coperture · Broni (PV)</div>
    <div class="cv-chips"><span>Hero fotografico prima e dopo</span><span>Cinque pagine servizio interattive</span><span>Nessun cookie</span><span>Sopralluogo gratuito in evidenza</span></div>
    <div class="rule" style="margin-top:22px;background:rgba(116,185,252,.3)"></div>
    <div class="cv-foot">
      <div class="l">Proposta di nuovo sito web<br>a cura di Altalogik</div>
      <div class="r">19 novembre 2026</div>
    </div>
  </div>
</div>`;

const p2 = `<div class="page light mm pad">
  <span class="tag"><i>01</i>L’identità</span>
  <h2 class="h" style="font-size:36px;margin-top:9px">Lo stesso marchio, <span class="c">più deciso</span></h2>
  <p class="body muted" style="margin-top:9px;max-width:170mm">Abbiamo tenuto il Suo logo, i caratteri e i colori del sito attuale, e il fondo chiaro. Cambia il modo di usarli: titoli forti in maiuscolo, il linguaggio del cantiere e delle tavole di progetto, e un solo colore di richiamo, l’azzurro del logo, per tutto ciò che porta al sopralluogo.</p>
  <div class="logos">
    <div><div class="tile l"><img src="${logoDark}" alt=""></div><div class="cap">Il logo originale. Esisteva solo come immagine di 302 pixel: lo abbiamo ridisegnato in vettoriale, identico, per restare nitido a ogni dimensione.</div></div>
    <div><div class="tile d"><img src="${logoLight}" alt=""></div><div class="cap">La versione per fondi scuri, usata nella barra di navigazione e nel piè di pagina.</div></div>
  </div>
  <div class="type">
    <div class="tcard"><div class="hd"><span>Titoli</span><span>Oswald</span></div><div class="bd"><div class="h" style="font-size:25px">Bonifica <span class="c">amianto</span></div><div class="cap">Il carattere dei titoli del sito attuale, ora in maiuscolo e più pieno.</div></div></div>
    <div class="tcard"><div class="hd"><span>Testi</span><span>Open Sans</span></div><div class="bd"><div style="font-size:12px;line-height:1.55;color:var(--text)">L’impresa edile Edil 3 dei fratelli Jaupi ha sede a Broni, provincia di Pavia, in via Vescovera.</div><div class="cap">Lo stesso carattere dei testi e del logo, chiaro e leggibile.</div></div></div>
  </div>
  <div class="hier">
    <span class="k">Etichetta</span><span class="v"><span class="tag"><i>02</i>Servizi</span></span>
    <span class="k">Titolo</span><span class="v"><span class="h" style="font-size:19px">Coperture e impermeabilizzazioni</span></span>
    <span class="k">Testo</span><span class="v" style="font-size:11.5px;color:var(--text)">Rifacimento e manutenzione di tetti per case, capannoni e fabbricati.</span>
    <span class="k">Azione</span><span class="v"><span class="btn" style="background:var(--navy);color:#fff;font-size:8.5px;padding:7px 13px">Richiedi un sopralluogo</span><span class="btn" style="background:var(--sky);color:var(--navy);font-size:8.5px;padding:7px 13px">Chiedi un preventivo</span></span>
  </div>
  <span class="tag" style="margin-top:14px"><i>◆</i>La palette, misurata sul sito attuale</span>
  <div class="sw">
    ${swatches.map((s) => `<div class="s" style="background:${s.c};color:${s.dark ? '#fff' : '#102542'}"><b>${s.l}</b><span>#${s.h}</span></div>`).join('')}
  </div>
  <span class="tag" style="margin-top:14px"><i>◆</i>L’apertura: la stessa casa, prima e dopo</span>
  <div class="pd">
    <figure><img src="${prima}" alt=""><figcaption><i>A</i>Stato di fatto</figcaption></figure>
    <figure><img src="${dopo}" alt=""><figcaption><i>B</i>Progetto</figcaption></figure>
  </div>
  <div class="cap">Immagini illustrative, generate per mostrare l’effetto della bonifica: da sostituire con le foto di un Suo cantiere.</div>
  ${foot(2, 'L’identità')}
</div>`;

const p3 = `<div class="page dark pad">
  <span class="tag"><i>02</i>L’esperienza</span>
  <h2 class="h" style="font-size:36px;margin-top:9px">Un sito che <span class="c">porta al sopralluogo</span></h2>
  <p class="body muted" style="margin-top:9px;max-width:172mm">Ogni voce del menu apre una pagina sua e ogni servizio ha una sezione interattiva diversa, pensata per quel lavoro. Le immagini sono schermate reali del nuovo sito.</p>
  <div class="egrid">
    ${elementi.map((e) => `<div class="ecard"><div class="eh"><span>Tav. ${e.n}</span><span>Edil 3 · Broni</span></div><figure><img src="${e.s}" alt=""></figure><div class="tx"><div class="et">${e.t}</div><div class="ed">${e.d}</div></div></div>`).join('')}
  </div>
  ${foot(3, 'L’esperienza')}
</div>`;

const p4 = `<div class="page light pad">
  <span class="tag"><i>03</i>Criticità rilevate sul sito attuale</span>
  <h2 class="h" style="font-size:36px;margin-top:9px">Cinque criticità, <span class="c">cinque risposte</span></h2>
  <div class="crit" style="margin-top:6px">
    ${criticita.map((c, i) => `<div class="item"><div class="top"><span class="num">${c.n}</span><span class="ct">${c.t}</span></div><div class="cd">${c.d}</div><div class="resp"><b>RISPOSTA</b>${c.r}</div></div>${i < criticita.length - 1 ? '<div class="rule"></div>' : ''}`).join('')}
  </div>
  <div class="tape" style="bottom:0"></div>
  ${foot(4, 'Criticità e risposte')}
</div>`;

const p5 = `<div class="page dark">
  <div class="pad" style="padding-bottom:0">
    <span class="tag"><i>04</i>Perché Altalogik</span>
    <h2 class="h" style="font-size:34px;margin-top:9px">Il mestiere, non solo <span class="c">il risultato</span></h2>
    <div style="margin-top:8px">
      ${perche.map((p, i) => `<div class="prow"><div class="pl">${p.t}</div><div class="pr">${p.d}</div></div>${i < perche.length - 1 ? '<div class="rule"></div>' : ''}`).join('')}
    </div>
    <span class="tag" style="margin-top:14px"><i>◆</i>I prossimi passi</span>
    <div class="steps">
      ${passi.map((s, i) => `<div class="step"><span class="n">0${i + 1}</span><div class="st">${s.t}</div><div class="sd">${s.d}</div></div>`).join('')}
    </div>
  </div>
  <div class="close">
    <img src="${closing}" alt="">
    <div class="cap2">
      <div class="h ch">Restiamo a Sua <span class="c">disposizione</span></div>
      <span class="btn">Altalogik · sito e messa online</span>
    </div>
  </div>
  <div class="tape" style="bottom:0"></div>
  ${foot(5, 'Perché Altalogik')}
</div>`;

const html = `<!doctype html><html lang="it"><head><meta charset="utf-8"><title>EDIL3 · Presentazione Altalogik</title><style>${CSS}</style></head><body>${p1}${p2}${p3}${p4}${p5}</body></html>`;
if (/[–—]/.test(html.replace(/data:[^"')]+/g, ''))) throw new Error('Trattino lungo o medio nel testo del PDF');
fs.writeFileSync(OUT, html);
console.log('html KB', Math.round(html.length / 1024));
