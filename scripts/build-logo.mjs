/**
 * Il sito attuale ha il logo solo come JPG 302x39 (edilizia-edil3-broni-logo.jpg), senza SVG.
 * Il logo è una scritta: "EDIL3 DEI" nero + "F.LLI JAUPI" azzurro #74B9FC, in Open Sans Bold.
 * Questo script lo ridisegna in SVG vettoriale con i glifi veri di Open Sans convertiti in tracciati
 * (non dipende dal font installato).
 *
 * Uscita: public/brand/logo.svg (scuro su chiaro), logo-light.svg (bianco su scuro), favicon.svg
 * Uso: node scripts/build-logo.mjs [peso]   (peso 700 di default)
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import opentype from 'opentype.js';

const weight = process.argv[2] ?? '700';
const fontPath = new URL(`../node_modules/@fontsource/open-sans/files/open-sans-latin-${weight}-normal.woff`, import.meta.url);
const buf = await readFile(fontPath);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

const SIZE = 100;
const TRACK = 0.028; // spaziatura leggermente aperta come nel JPG originale (rapporto 11,2:1)
const INK = '#141414'; // nero del logo (campionato dal JPG: rgb 16-24)
const BLUE = '#74B9FC'; // colore calcolato dello span "F.LLI JAUPI" nel sito

const partA = 'EDIL3 DEI ';
const partB = 'F.LLI JAUPI';
const pathA = font.getPath(partA, 0, SIZE, SIZE, { letterSpacing: TRACK });
const advA = font.getAdvanceWidth(partA, SIZE, { letterSpacing: TRACK });
const pathB = font.getPath(partB, advA, SIZE, SIZE, { letterSpacing: TRACK });
const bbA = pathA.getBoundingBox();
const bbB = pathB.getBoundingBox();
const x0 = Math.floor(Math.min(bbA.x1, bbB.x1));
const y0 = Math.floor(Math.min(bbA.y1, bbB.y1));
const x1 = Math.ceil(Math.max(bbA.x2, bbB.x2));
const y1 = Math.ceil(Math.max(bbA.y2, bbB.y2));
const w = x1 - x0;
const h = y1 - y0;
const d = (p) => p.toPathData(2);

const svg = (ink, blue) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="EDIL3 dei F.lli Jaupi">` +
  `<title>EDIL3 dei F.lli Jaupi</title>` +
  `<path fill="${ink}" d="${d(pathA)}"/><path fill="${blue}" d="${d(pathB)}"/></svg>\n`;

// favicon: "E3" su navy dei bottoni
const fav = font.getPath('E3', 0, 0, 40);
const fb = fav.getBoundingBox();
const fw = fb.x2 - fb.x1;
const fh = fb.y2 - fb.y1;
const favicon =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#102542"/>` +
  `<g transform="translate(${(64 - fw) / 2 - fb.x1} ${(64 - fh) / 2 - fb.y1})"><path fill="#ffffff" d="${font.getPath('E', 0, 0, 40).toPathData(2)}"/>` +
  `<path fill="${BLUE}" d="${font.getPath('3', font.getAdvanceWidth('E', 40), 0, 40).toPathData(2)}"/></g></svg>\n`;

const out = new URL('../public/brand/', import.meta.url);
await mkdir(out, { recursive: true });
await writeFile(new URL('logo.svg', out), svg(INK, BLUE));
await writeFile(new URL('logo-light.svg', out), svg('#ffffff', BLUE));
await writeFile(new URL('../public/favicon.svg', import.meta.url), favicon);
console.log(`logo ${weight}: ${w}x${h} (rapporto ${(w / h).toFixed(3)})`);
