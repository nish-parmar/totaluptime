/**
 * One-off: capture a full-page screenshot of the live Total Uptime
 * homepage at 1280 px wide, ready to be overlaid with audit pins.
 *
 *   node scripts/screenshot.js \
 *     [URL] [output.png] [viewportWidth]
 *
 * Defaults capture the live TU homepage.
 *
 * Uses puppeteer-core + the system-installed Chrome (no Chromium
 * download), and scrolls the page first so any lazy-loaded imagery
 * is in the DOM before capture.
 */
const puppeteer = require('puppeteer-core');
const fs        = require('node:fs/promises');
const path      = require('node:path');

const URL_DEFAULT = 'https://totaluptime1.wpenginepowered.com/';
const OUT_DEFAULT = 'assets/tu-old-homepage.png';
const WIDTH_DEFAULT = 1280;

const CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
];

async function findChrome() {
  for (const p of CHROME_PATHS) {
    try { await fs.access(p); return p; } catch (_) {}
  }
  throw new Error('Chrome not found in /Applications.');
}

(async () => {
  const [, , urlArg, outArg, widthArg] = process.argv;
  const url   = urlArg || URL_DEFAULT;
  const out   = outArg || OUT_DEFAULT;
  const width = Number(widthArg) || WIDTH_DEFAULT;
  const executablePath = await findChrome();

  console.log(`→ ${url}\n→ ${out}  (${width} px wide)`);

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900, deviceScaleFactor: 2 });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60_000 });

  /* Scroll to bottom in chunks to trigger any lazy-loaded media,
   * then back to the top before fullPage capture. */
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = 600;
      const t = setInterval(() => {
        window.scrollBy(0, step);
        y += step;
        if (y >= document.body.scrollHeight) {
          clearInterval(t);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 90);
    });
  });

  /* Give late images / animations a beat to settle. */
  await new Promise((r) => setTimeout(r, 1500));

  /* Dismiss any obvious cookie banner that would clutter the
   * screenshot — best-effort, fails silently. */
  await page.evaluate(() => {
    const candidates = [
      '#onetrust-accept-btn-handler',
      '.cookie-accept',
      '[aria-label*="accept" i]',
      'button[id*="accept" i]',
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el && typeof el.click === 'function') { el.click(); break; }
    }
  });
  await new Promise((r) => setTimeout(r, 600));

  await fs.mkdir(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, fullPage: true });
  const stat = await fs.stat(out);
  const dims = await page.evaluate(() => ({
    w: document.documentElement.scrollWidth,
    h: document.documentElement.scrollHeight,
  }));
  console.log(`✓ Saved ${out} — ${(stat.size / 1024).toFixed(0)} KB, page ${dims.w}×${dims.h}`);

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
