/**
 * Importa i contenuti del sito attuale https://www.impresaedil3.it/ (Duda / Italiaonline).
 * - legge la sitemap, scarica ogni pagina
 * - estrae title, meta description, titoli e paragrafi COMPLETI nell'ordine in cui compaiono
 * - estrae i dati del footer (indirizzo, telefono, email, orari, P.IVA)
 * - scarica le foto alla risoluzione più alta disponibile e le converte in WebP (< 300 KB)
 * Uscita: src/data/imported.json e public/img/*.webp
 *
 * Uso: npm run import:content
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { parse } from 'node-html-parser';
import sharp from 'sharp';

const ORIGIN = 'https://www.impresaedil3.it';
const UA = 'Mozilla/5.0 (compatible; site-migration-script)';
const OUT_JSON = new URL('../src/data/imported.json', import.meta.url);
const OUT_IMG = new URL('../public/img/', import.meta.url);

const get = async (url, as = 'text') => {
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return as === 'buffer' ? Buffer.from(await r.arrayBuffer()) : r.text();
};

const clean = (s) =>
  s
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** testo di un nodo mantenendo gli a capo dei <br> */
const ENT = { nbsp: ' ', amp: '&', quot: '"', apos: "'", rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', agrave: 'à', egrave: 'è', eacute: 'é', igrave: 'ì', ograve: 'ò', ugrave: 'ù', Egrave: 'È', Agrave: 'À', hellip: '…', laquo: '«', raquo: '»' };
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n] ?? m);
/** testo di un nodo (i <br> diventano spazi, le entità HTML vengono decodificate) */
const textOf = (node) => clean(decode(node.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')));

async function main() {
  await mkdir(OUT_IMG, { recursive: true });
  const sitemap = await get(`${ORIGIN}/sitemap.xml`);
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log('sitemap:', urls.join(', '));

  const pages = {};
  const images = new Map(); // nome base -> url migliore
  let footer = null;

  for (const url of urls) {
    const path = new URL(url).pathname.replace(/\/$/, '') || '/';
    const html = await get(url);
    const root = parse(html, { blockTextElements: { script: false, style: false, noscript: false } });

    const title = clean(root.querySelector('title')?.text ?? '');
    const description = root.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';

    // blocchi di contenuto nell'ordine del documento (escluso header e footer)
    const main = root.querySelector('#dmFirstContainer') ?? root.querySelector('#dm') ?? root;
    const blocks = [];
    // Duda: i testi sono widget [data-element-type=paragraph] (h1/h2 o div) con dentro un <div>/<p> per capoverso
    for (const el of main.querySelectorAll('.dmNewParagraph, a.dmButtonLink')) {
      if (el.closest('.dmFooter, footer, .dmHeader, #hcontainer, [class*="cookie"], .dmPopup, form, .dmform')) continue;
      const tag = el.tagName.toLowerCase();
      if (tag === 'a') {
        const t = textOf(el);
        if (t) blocks.push({ type: 'button', text: t, href: el.getAttribute('href') ?? '' });
        continue;
      }
      const type = /^h[1-6]$/.test(tag) ? tag : 'p';
      // capoversi: ogni <div>/<p> figlio è un capoverso; testo e tag inline consecutivi formano un capoverso a sé
      const texts = [];
      let inline = '';
      const flush = () => {
        const t = clean(decode(inline.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ')));
        if (t) texts.push(t);
        inline = '';
      };
      for (const n of el.childNodes) {
        if (n.nodeType === 1 && /^(div|p)$/i.test(n.tagName ?? '')) {
          flush();
          const t = textOf(n);
          if (t) texts.push(t);
        } else inline += n.nodeType === 1 ? n.outerHTML : n.rawText;
      }
      flush();
      for (const t of texts) {
        if (blocks.length && blocks.at(-1).text === t) continue;
        blocks.push({ type, text: t });
      }
    }

    // footer (uguale su tutte le pagine)
    if (!footer) {
      const all = clean(root.text);
      const m = (re) => all.match(re)?.[1]?.trim() ?? '';
      footer = {
        address: m(/SEDE E RECAPITI\s+(.+?)\s+CONTATTI/),
        phone: m(/CONTATTI\s+(\+39[\d\s]+?)\s+[a-z]/i),
        email: m(/([a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,})/i),
        hours: m(/ORARI DI APERTURA\s+(.+?)\s+P\.I\./),
        vat: m(/P\.I\.\s*(\d{11})/),
        brand: m(/^(EDIL3 DEI F\.LLI JAUPI)/),
      };
    }

    // immagini del sito (alias 57f0e9ae); si tiene la variante più larga
    for (const mm of html.matchAll(/https?:\/\/l?irp\.cdn-website\.com\/+(\w+)\/dms3rep\/multi\/opt\/([a-z0-9-]+?)-(\d+)w\.(jpg|jpeg|png)/gi)) {
      const [full, alias, base, w] = mm;
      const key = `${alias}/${base}`;
      const prev = images.get(key);
      if (!prev || Number(w) > prev.w) images.set(key, { url: full.replace(/cdn-website\.com\/+/, 'cdn-website.com/'), w: Number(w), alias, base });
    }

    pages[path] = { url, title, description, blocks };
    console.log(`  ${path}: ${blocks.length} blocchi`);
  }

  // download + WebP
  const photos = [];
  for (const { url, alias, base } of images.values()) {
    // l'immagine viola "image" viene da un altro sito Duda (template): non è del cliente
    const foreign = alias !== '57f0e9ae';
    if (foreign) {
      console.log('  salto immagine di template:', url);
      continue;
    }
    if (base.endsWith('-logo')) continue; // il logo diventa SVG (public/brand)
    // si prova prima l'originale a 2880px
    let buf;
    for (const w of [2880, 1920]) {
      try {
        buf = await get(url.replace(/-\d+w\./, `-${w}w.`), 'buffer');
        break;
      } catch {}
    }
    if (!buf) buf = await get(url, 'buffer');
    const name = base.replace('edilizia-edil3-broni-', 'foto-');
    const meta = await sharp(buf).metadata();
    for (const [suffix, width, q] of [
      ['lg', 1920, 72],
      ['md', 1100, 74],
      ['sm', 640, 74],
    ]) {
      let quality = q;
      let out;
      do {
        out = await sharp(buf).resize({ width: Math.min(width, meta.width ?? width), withoutEnlargement: true }).webp({ quality, effort: 6 }).toBuffer();
        quality -= 6;
      } while (out.length > 300 * 1024 && quality > 40);
      await writeFile(new URL(`${name}-${suffix}.webp`, OUT_IMG), out);
      if (suffix === 'lg') console.log(`  ${name}-lg.webp ${Math.round(out.length / 1024)} KB`);
    }
    photos.push({ id: name, source: url, width: meta.width, height: meta.height, stock: true });
  }

  const data = { importedAt: new Date().toISOString(), origin: ORIGIN, footer, pages, photos };
  await writeFile(OUT_JSON, JSON.stringify(data, null, 2) + '\n');
  console.log('scritto src/data/imported.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
