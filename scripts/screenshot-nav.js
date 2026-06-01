/**
 * Capture the live Total Uptime top-nav with its "Products" dropdown
 * open, plus dump the dropdown's HTML so we can describe what's
 * actually there (not what we remember being there).
 *
 *   node scripts/screenshot-nav.js
 *
 * Output:
 *   assets/tu-old-nav-products.png     - viewport screenshot, dropdown open
 *   scripts/tu-old-nav-products.html   - the dropdown's outerHTML
 */
const puppeteer = require('puppeteer-core');
const fs        = require('node:fs/promises');

const URL = 'https://totaluptime1.wpenginepowered.com/';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60_000 });

  /* Find the Products top-level nav link by text and hover it. */
  const productsHandle = await page.evaluateHandle(() => {
    const links = Array.from(document.querySelectorAll('a, button'));
    return links.find((el) => /^products$/i.test((el.textContent || '').trim()));
  });
  if (!productsHandle || !productsHandle.asElement()) {
    console.error('Could not find a "Products" link in the nav.');
    process.exit(1);
  }
  await productsHandle.asElement().hover();
  await new Promise((r) => setTimeout(r, 800));

  /* Capture the dropdown HTML (best-effort: the menu commonly sits
   * inside the parent <li> of the trigger). */
  const dropdownHtml = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a, button'));
    const trig = links.find((el) => /^products$/i.test((el.textContent || '').trim()));
    if (!trig) return null;
    /* Climb until we find a <ul> sibling within an <li> */
    let node = trig;
    for (let i = 0; i < 6 && node; i++) {
      const ul = node.querySelector && node.querySelector('ul');
      if (ul) return ul.outerHTML;
      node = node.parentElement;
    }
    return null;
  });

  await fs.writeFile('scripts/tu-old-nav-products.html', dropdownHtml || '<!-- not found -->', 'utf8');
  await page.screenshot({ path: 'assets/tu-old-nav-products.png', clip: { x: 0, y: 0, width: 1280, height: 700 } });
  console.log('✓ wrote assets/tu-old-nav-products.png');
  console.log('✓ wrote scripts/tu-old-nav-products.html');

  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
