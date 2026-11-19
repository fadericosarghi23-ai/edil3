/**
 * Prepara le due foto dell'hero (prima e dopo la bonifica).
 *
 * Le immagini sono ILLUSTRATIVE, generate con AI (non sono un cantiere del cliente):
 * - assets-src/hero/prima.png           casa con tetto in lastre di fibrocemento
 * - assets-src/hero/dopo-generata.png   stessa foto con il tetto rifatto
 *
 * Per avere un allineamento perfetto, la foto "dopo" non si usa intera: si prende solo la zona
 * dove le due immagini differiscono davvero (il tetto), con una maschera sfumata, e la si incolla
 * sulla foto "prima". Tutto il resto resta identico al pixel.
 *
 * Uscita: public/img/hero-prima-{sm,md,lg}.webp, public/img/hero-dopo-{sm,md,lg}.webp
 * Uso: node scripts/build-hero.mjs
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SRC = new URL('../assets-src/hero/', import.meta.url);
const OUT = new URL('../public/img/', import.meta.url);

const prima = sharp(fileURLToPath(new URL('prima.png', SRC)));
const dopo = sharp(fileURLToPath(new URL('dopo-generata.png', SRC)));
const { width: W, height: H } = await prima.metadata();

const a = await prima.clone().removeAlpha().raw().toBuffer();
const b = await dopo.clone().resize(W, H).removeAlpha().raw().toBuffer();

// maschera: differenza di luminanza sopra soglia
const mask = Buffer.alloc(W * H);
for (let i = 0, p = 0; p < W * H; p++, i += 3) {
  const d = Math.abs(a[i] - b[i]) * 0.3 + Math.abs(a[i + 1] - b[i + 1]) * 0.59 + Math.abs(a[i + 2] - b[i + 2]) * 0.11;
  mask[p] = d > 22 ? 255 : 0;
}
// tiene solo il blocco principale (il tetto): riquadro dei pixel diversi nella metà destra alta
let x0 = W, y0 = H, x1 = 0, y1 = 0;
for (let y = 0; y < H * 0.75; y++)
  for (let x = Math.floor(W * 0.35); x < W; x++)
    if (mask[y * W + x]) {
      // conta i vicini per scartare il rumore
      let n = 0;
      for (let k = -3; k <= 3; k++) if (mask[y * W + Math.min(W - 1, Math.max(0, x + k))]) n++;
      if (n >= 6) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
// fuori dal riquadro del tetto la maschera è vuota
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (x < x0 - 6 || x > x1 + 6 || y < y0 - 6 || y > y1 + 6) mask[y * W + x] = 0;

// chiusura morfologica + sfumatura, per una maschera piena e morbida
const gray = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 1 } });
// apertura: sfoca e ri-soglia per togliere i puntini isolati (piccole differenze di arbusti e cielo)
const opened = await gray(mask).blur(3).extractChannel(0).threshold(170).extractChannel(0).raw().toBuffer();
const soft = await gray(opened)
  .blur(6)
  .linear(4, -180) // riempie i buchi dentro il tetto
  .blur(2.5)
  .extractChannel(0)
  .raw()
  .toBuffer();
// riquadro reale del tetto, dalla maschera pulita
x0 = W; y0 = H; x1 = 0; y1 = 0;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (soft[y * W + x] > 200) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }

const composite = Buffer.alloc(W * H * 3);
for (let p = 0, i = 0; p < W * H; p++, i += 3) {
  const t = soft[p] / 255;
  composite[i] = a[i] * (1 - t) + b[i] * t;
  composite[i + 1] = a[i + 1] * (1 - t) + b[i + 1] * t;
  composite[i + 2] = a[i + 2] * (1 - t) + b[i + 2] * t;
}

const sizes = [
  ['lg', 1920, 74],
  ['md', 1280, 76],
  ['sm', 900, 76],
];
for (const [name, buf] of [
  ['prima', a],
  ['dopo', composite],
]) {
  for (const [suf, w, q] of sizes) {
    let quality = q;
    let out;
    do {
      out = await sharp(buf, { raw: { width: W, height: H, channels: 3 } })
        .resize({ width: w, kernel: 'lanczos3' })
        .sharpen({ sigma: 0.6 })
        .webp({ quality, effort: 6 })
        .toBuffer();
      quality -= 6;
    } while (out.length > 300 * 1024 && quality > 40);
    await writeFile(new URL(`hero-${name}-${suf}.webp`, OUT), out);
    console.log(`hero-${name}-${suf}.webp ${Math.round(out.length / 1024)} KB`);
  }
}

console.log('riquadro maschera (indicativo):', { x0: +(x0 / W).toFixed(3), x1: +(x1 / W).toFixed(3), y0: +(y0 / H).toFixed(3), y1: +(y1 / H).toFixed(3) });
